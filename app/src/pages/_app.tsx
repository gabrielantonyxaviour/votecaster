import type { AppProps } from "next/app";
import "@/styles/globals.css";
import { http, createConfig } from "wagmi";
import { scrollSepolia } from "wagmi/chains";
import { useEffect, useState } from "react";
import { WagmiProvider } from "wagmi";
import { ConnectKitProvider, getDefaultConfig } from "connectkit";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { AirstackProvider } from "@airstack/airstack-react";
import { config } from "@/utils/constants";

const airstackApiKey = process.env["NEXT_PUBLIC_AIRSTACK_API_KEY"] ?? "";

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  const [ready, setReady] = useState<boolean>(false);
  const [useTestAadhaar, setUseTestAadhaar] = useState<boolean>(false);

  useEffect(() => {
    setReady(true);
  }, []);
  const queryClient = new QueryClient();
  return (
    <>
      {ready ? (
        <WagmiProvider config={config}>
          <QueryClientProvider client={queryClient}>
            <ConnectKitProvider>
              <AirstackProvider apiKey={airstackApiKey}>
                <Component {...pageProps} />
              </AirstackProvider>
            </ConnectKitProvider>
          </QueryClientProvider>
        </WagmiProvider>
      ) : null}
    </>
  );
}
