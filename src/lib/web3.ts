import { createConfig, http } from 'wagmi';
import { mainnet, polygon, bsc } from 'wagmi/chains';
import { walletConnect } from 'wagmi/connectors';

const chains = [mainnet, polygon, bsc];

const WALLET_CONNECT_PROJECT_ID = import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID || 'demo';

export const wagmiConfig = createConfig({
  chains: [mainnet, polygon, bsc],
  connectors: [
    walletConnect({
      projectId: WALLET_CONNECT_PROJECT_ID,
      showQrModal: true,
    }),
  ],
  transports: {
    [mainnet.id]: http(),
    [polygon.id]: http(),
    [bsc.id]: http(),
  },
});

export const getChainById = (chainId: number) => {
  return [mainnet, polygon, bsc].find((chain) => chain.id === chainId);
};

export const getExplorerUrl = (chainId: number): string => {
  const explorers: Record<number, string> = {
    1: 'https://etherscan.io',
    137: 'https://polygonscan.com',
    56: 'https://bscscan.com',
  };
  return explorers[chainId] || 'https://etherscan.io';
};
