"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ConnectKitProvider, getDefaultConfig } from "connectkit";

import React from "react";

import { scrollSepolia } from "viem/chains";
import { WagmiProvider, createConfig, http } from "wagmi";

import PollPageComponent from "./PollPageComponent";
import { AirstackProvider } from "@airstack/airstack-react";

const projectId = process.env["NEXT_PUBLIC_PROJECT_ID"] ?? "";
const airstackApiKey = process.env["NEXT_PUBLIC_AIRSTACK_API_KEY"] ?? "";
const config = createConfig(
  getDefaultConfig({
    appName: "Priv Cast",
    walletConnectProjectId: projectId,
    chains: [scrollSepolia],
    ssr: true,
    transports: {
      [scrollSepolia.id]: http("https://rpc.ankr.com/scroll_sepolia_testnet"),
    },
    appDescription:
      "PRIVACY PRESERVED, SYBIL RESISTANT POLLS NOW IN FARCASTER.",
    appUrl: "https://priv-cast.vercel.app", // your app's url
    appIcon: "https://family.co/logo.png",
  })
);
const queryClient = new QueryClient();
export default function PollPageWrapper() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <ConnectKitProvider>
          <AirstackProvider apiKey={airstackApiKey}>
            <PollPageComponent />
          </AirstackProvider>
        </ConnectKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
