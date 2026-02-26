import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

interface OpenRouterMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

interface RequestBody {
  messages: OpenRouterMessage[];
  model: string;
  temperature?: number;
  max_tokens?: number;
}

serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Only allow POST requests
    if (req.method !== "POST") {
      return new Response(
        JSON.stringify({ error: "Method not allowed" }),
        {
          status: 405,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Parse request body
    const body: RequestBody = await req.json();
    const { messages, model, temperature = 0.7, max_tokens = 2048 } = body;

    // Validate required fields
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return new Response(
        JSON.stringify({ error: "Messages array is required" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    if (!model || typeof model !== "string") {
      return new Response(
        JSON.stringify({ error: "Model ID is required" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Get OpenRouter API key from environment variables
    const openRouterApiKey = Deno.env.get("OPENROUTER_API_KEY");

    if (!openRouterApiKey) {
      console.error("OPENROUTER_API_KEY is not set");
      return new Response(
        JSON.stringify({ error: "Server configuration error" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Get site URL from environment (optional, for OpenRouter ranking)
    const siteUrl = Deno.env.get("SITE_URL") || "https://freedom-hub.io";
    const siteName = Deno.env.get("SITE_NAME") || "Freedom Hub";

    // Make request to OpenRouter API
    const openRouterResponse = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${openRouterApiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": siteUrl,
        "X-Title": siteName,
      },
      body: JSON.stringify({
        model,
        messages,
        temperature,
        max_tokens,
        stream: false,
      }),
    });

    if (!openRouterResponse.ok) {
      const errorData = await openRouterResponse.json().catch(() => ({}));
      console.error("OpenRouter API error:", errorData);

      return new Response(
        JSON.stringify({
          error: errorData.error?.message || "Failed to get response from AI model",
          code: errorData.error?.code || "openrouter_error",
        }),
        {
          status: openRouterResponse.status,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const data = await openRouterResponse.json();

    // Return the response to the client
    return new Response(
      JSON.stringify({
        success: true,
        data: {
          id: data.id,
          model: data.model,
          content: data.choices?.[0]?.message?.content || "",
          finishReason: data.choices?.[0]?.finish_reason,
          usage: data.usage,
        },
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Edge function error:", error);

    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Unknown error occurred",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
