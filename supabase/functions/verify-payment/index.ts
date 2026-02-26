import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

// CONFIGURATION
const MERCHANT_WALLET = Deno.env.get("MERCHANT_WALLET_ADDRESS") || "";
const POLYGON_RPC_URL = Deno.env.get("POLYGON_RPC_URL") || "https://polygon-rpc.com";
const MIN_CONFIRMATIONS = parseInt(Deno.env.get("MIN_CONFIRMATIONS") || "3");
const DAI_CONTRACT_ADDRESS = "0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063";

const TIER_PRICES: Record<string, { dai: number; tokens: number }> = {
  "Starter": { dai: 5, tokens: 1000000 },
  "Pro": { dai: 20, tokens: 5000000 },
  "Whale": { dai: 50, tokens: 20000000 },
};

async function polygonRPC(method: string, params: unknown[]): Promise<unknown> {
  const response = await fetch(POLYGON_RPC_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ jsonrpc: "2.0", method, params, id: Date.now() }),
  });
  const data = await response.json();
  if (data.error) throw new Error(`Polygon RPC Error: ${data.error.message}`);
  return data.result;
}

function hexToNumber(hex: string): number { return parseInt(hex, 16); }

function parseDAIValue(logs: any[]): string {
  const transferLog = logs.find(
    (log) => log.address.toLowerCase() === DAI_CONTRACT_ADDRESS.toLowerCase() &&
      log.topics[0] === "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef"
  );
  if (!transferLog) return "0";
  const valueWei = BigInt(transferLog.data);
  return (Number(valueWei) / 1e18).toString();
}

function verifyAmount(receivedAmount: number, expectedDAI: number): boolean {
  return Math.abs(receivedAmount - expectedDAI) <= 0.01;
}

async function getCurrentBlockNumber(): Promise<number> {
  const result = await polygonRPC("eth_blockNumber", []) as string;
  return hexToNumber(result);
}

async function verifyTransaction(request: { txHash: string; userId: string; tierName: string }) {
  const { txHash, userId, tierName } = request;
  const supabase = createClient(Deno.env.get("SUPABASE_URL") ?? "", Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "");

  // ШАГ 1: Проверка на Replay Attack (дубликат транзакции)
  const { data: existingTx } = await supabase.from("processed_transactions").select("tx_hash").eq("tx_hash", txHash).single();
  if (existingTx) {
    await supabase.from("payment_attempts").insert({ user_id: userId, tx_hash: txHash, tier_name: tierName, expected_amount_dai: TIER_PRICES[tierName]?.dai || 0, status: "duplicate", error_message: "Transaction already processed" });
    return { success: false, error: "Transaction already processed (Replay Attack prevented)" };
  }

  // ШАГ 2: Получаем receipt транзакции из Polygon
  let receipt: any;
  try {
    const receiptResult = await polygonRPC("eth_getTransactionReceipt", [txHash]);
    receipt = receiptResult;
  } catch (error) {
    await supabase.from("payment_attempts").insert({ user_id: userId, tx_hash: txHash, tier_name: tierName, expected_amount_dai: TIER_PRICES[tierName]?.dai || 0, status: "failed", error_message: `Transaction not found: ${error}` });
    return { success: false, error: "Transaction not found on Polygon network" };
  }

  if (!receipt) {
    await supabase.from("payment_attempts").insert({ user_id: userId, tx_hash: txHash, tier_name: tierName, expected_amount_dai: TIER_PRICES[tierName]?.dai || 0, status: "failed", error_message: "Transaction receipt is null" });
    return { success: false, error: "Transaction not confirmed yet. Please wait." };
  }

  // ШАГ 3: Проверяем статус транзакции (0x1 = success)
  if (receipt.status !== "0x1") {
    await supabase.from("payment_attempts").insert({ user_id: userId, tx_hash: txHash, tier_name: tierName, expected_amount_dai: TIER_PRICES[tierName]?.dai || 0, status: "failed", error_message: "Transaction failed on chain" });
    return { success: false, error: "Transaction failed on Polygon network" };
  }

  // ШАГ 4: Проверяем получателя (должен совпадать с MERCHANT_WALLET)
  const transferToAddress = receipt.logs.find(log => log.address.toLowerCase() === DAI_CONTRACT_ADDRESS.toLowerCase())?.topics[2];
  if (!transferToAddress) {
    await supabase.from("payment_attempts").insert({ user_id: userId, tx_hash: txHash, tier_name: tierName, expected_amount_dai: TIER_PRICES[tierName]?.dai || 0, status: "failed", error_message: "No DAI transfer found" });
    return { success: false, error: "No DAI transfer found in this transaction" };
  }
  const recipientAddress = "0x" + transferToAddress.slice(-40);
  if (recipientAddress.toLowerCase() !== MERCHANT_WALLET.toLowerCase()) {
    await supabase.from("payment_attempts").insert({ user_id: userId, tx_hash: txHash, tier_name: tierName, expected_amount_dai: TIER_PRICES[tierName]?.dai || 0, status: "failed", error_message: `Recipient mismatch: ${recipientAddress}` });
    return { success: false, error: "Payment was not sent to the correct merchant address" };
  }

  // ШАГ 5: Проверяем сумму перевода
  const expectedTier = TIER_PRICES[tierName];
  if (!expectedTier) {
    await supabase.from("payment_attempts").insert({ user_id: userId, tx_hash: txHash, tier_name: tierName, expected_amount_dai: 0, status: "failed", error_message: `Invalid tier: ${tierName}` });
    return { success: false, error: `Invalid tier: ${tierName}` };
  }
  const receivedAmount = parseFloat(parseDAIValue(receipt.logs));
  if (!verifyAmount(receivedAmount, expectedTier.dai)) {
    await supabase.from("payment_attempts").insert({ user_id: userId, tx_hash: txHash, tier_name: tierName, expected_amount_dai: expectedTier.dai, status: "failed", error_message: `Amount mismatch: ${receivedAmount} DAI` });
    return { success: false, error: `Incorrect amount: received ${receivedAmount} DAI, expected ${expectedTier.dai} DAI` };
  }

  // ШАГ 6: Проверяем количество подтверждений
  const currentBlock = await getCurrentBlockNumber();
  const txBlockNumber = hexToNumber(receipt.blockNumber);
  const confirmations = currentBlock - txBlockNumber;
  if (confirmations < MIN_CONFIRMATIONS) {
    await supabase.from("payment_attempts").insert({ user_id: userId, tx_hash: txHash, tier_name: tierName, expected_amount_dai: expectedTier.dai, status: "pending", error_message: `Waiting for confirmations: ${confirmations}/${MIN_CONFIRMATIONS}` });
    return { success: false, error: `Transaction has ${confirmations} confirmations. Waiting for ${MIN_CONFIRMATIONS}.` };
  }

  // ШАГ 7: Всё проверено! Записываем транзакцию и начисляем токены
  const { error: insertError } = await supabase.from("processed_transactions").insert({ tx_hash: txHash, user_id: userId, amount_dai: expectedTier.dai, tokens_added: expectedTier.tokens, tier_name: tierName, polygon_block_number: txBlockNumber });
  if (insertError) {
    if (insertError.code === "23505") {
      await supabase.from("payment_attempts").insert({ user_id: userId, tx_hash: txHash, tier_name: tierName, expected_amount_dai: expectedTier.dai, status: "duplicate", error_message: "Concurrent duplicate" });
      return { success: false, error: "Transaction already being processed" };
    }
    await supabase.from("payment_attempts").insert({ user_id: userId, tx_hash: txHash, tier_name: tierName, expected_amount_dai: expectedTier.dai, status: "failed", error_message: `Database error: ${insertError.message}` });
    return { success: false, error: "Failed to record transaction" };
  }

  const newBalance = await supabase.rpc("add_ai_credits", { target_user_id: userId, tokens_amount: expectedTier.tokens, source_tier: tierName });
  await supabase.from("payment_attempts").insert({ user_id: userId, tx_hash: txHash, tier_name: tierName, expected_amount_dai: expectedTier.dai, status: "verified", verification_details: { confirmations, receivedAmount } });

  return { success: true, newBalance: newBalance.data as number, details: { txHash, tier: tierName, tokensAdded: expectedTier.tokens, confirmations } };
}

serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return new Response(JSON.stringify({ error: "Method not allowed" }), { status: 405, headers: { ...corsHeaders, "Content-Type": "application/json" } });

  try {
    const body: { txHash: string; userId: string; tierName: string } = await req.json();
    const { txHash, userId, tierName } = body;

    if (!txHash || !userId || !tierName) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }
    if (!txHash.startsWith("0x") || txHash.length !== 66) {
      return new Response(JSON.stringify({ error: "Invalid transaction hash format" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const result = await verifyTransaction(body);
    return new Response(JSON.stringify(result), { status: result.success ? 200 : 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (error) {
    console.error("Verify payment error:", error);
    return new Response(JSON.stringify({ success: false, error: error instanceof Error ? error.message : "Unknown error" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
