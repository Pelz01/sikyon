"use client";

import "@mysten/dapp-kit/dist/index.css";

import { createNetworkConfig, SuiClientProvider, WalletProvider } from "@mysten/dapp-kit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { useState } from "react";

const { networkConfig } = createNetworkConfig({
  mainnet: {
    network: "mainnet",
    url: process.env.NEXT_PUBLIC_SUI_RPC_URL || "https://fullnode.mainnet.sui.io:443",
  },
  testnet: {
    network: "testnet",
    url: process.env.NEXT_PUBLIC_SUI_TESTNET_RPC_URL || "https://fullnode.testnet.sui.io:443",
  },
});

export default function SuiProviders({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <SuiClientProvider networks={networkConfig} defaultNetwork="mainnet">
        <WalletProvider autoConnect>{children}</WalletProvider>
      </SuiClientProvider>
    </QueryClientProvider>
  );
}
