import type { AppProps } from "next/app";
import "@/styles/globals.css";
import { http, createConfig } from "wagmi";
import { scrollSepolia } from "wagmi/chains";
import { useEffect, useState } from "react";
import { WagmiProvider } from "wagmi";
import { ConnectKitProvider, getDefaultConfig } from "connectkit";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import MyCustomAvatar from "@/components/MyCustomAvatar";
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
            <ConnectKitProvider
              options={{
                customAvatar: MyCustomAvatar,
              }}
            >
              <AirstackProvider apiKey={airstackApiKey}>
                <Component
                  {...pageProps}
                  setUseTestAadhaar={setUseTestAadhaar}
                  useTestAadhaar={useTestAadhaar}
                />
              </AirstackProvider>
            </ConnectKitProvider>
          </QueryClientProvider>
        </WagmiProvider>
      ) : null}
    </>
  );
}
