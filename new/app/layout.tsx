"use client";
import { WagmiProvider, createConfig, http } from "wagmi";
import { ConnectKitProvider } from "connectkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AirstackProvider } from "@airstack/airstack-react";
import { OnchainKitProvider } from "@coinbase/onchainkit";
import "../styles/machina.css";
import "@/styles/globals.css";
import "../styles/monument.css";
import { ReactNode, useEffect, useState } from "react";
import { baseSepolia, scrollSepolia } from "viem/chains";

const airstackApiKey = process.env.NEXT_PUBLIC_AIRSTACK_API_KEY ?? "";

const queryClient = new QueryClient();

export default function RootLayout({ children }: { children: JSX.Element }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(true);
  }, []);

  return (
    <html lang="en">
      <head />
      <body>
        {ready ? (
          <WagmiProvider
            config={createConfig({
              chains: [baseSepolia],
              transports: {
                [baseSepolia.id]: http(process.env.BASE_ALCHEMY_URL),
              },
            })}
          >
            <QueryClientProvider client={queryClient}>
              <ConnectKitProvider>
                <OnchainKitProvider
                  apiKey={process.env.PUBLIC_ONCHAINKIT_API_KEY}
                  chain={baseSepolia}
                >
                  <AirstackProvider apiKey={airstackApiKey}>
                    {children}
                  </AirstackProvider>
                </OnchainKitProvider>
              </ConnectKitProvider>
            </QueryClientProvider>
          </WagmiProvider>
        ) : null}
      </body>
    </html>
  );
}
