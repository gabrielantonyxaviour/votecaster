import { SessionProvider } from "next-auth/react";
import type { AppProps } from "next/app";
import "@/styles/globals.css";
import "@farcaster/auth-kit/styles.css";
import { http, createConfig } from "wagmi";
import { scrollSepolia } from "wagmi/chains";
import { AnonAadhaarProvider } from "@anon-aadhaar/react";
import { useEffect, useState } from "react";
import { WagmiProvider } from "wagmi";
import { ConnectKitProvider, getDefaultConfig } from "connectkit";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import MyCustomAvatar from "@/components/MyCustomAvatar";
import { AuthKitProvider } from "@farcaster/auth-kit";

const projectId = process.env["NEXT_PUBLIC_PROJECT_ID"] ?? "";
const authKitConfig = {
  relay: "https://relay.farcaster.xyz",
  rpcUrl: "https://mainnet.optimism.io",
  siweUri: "http://example.com/login",
  domain: "example.com",
};

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
        <AnonAadhaarProvider
          _useTestAadhaar={useTestAadhaar}
          _fetchArtifactsFromServer={false}
        >
          <WagmiProvider config={config}>
            <QueryClientProvider client={queryClient}>
              <ConnectKitProvider
                options={{
                  customAvatar: MyCustomAvatar,
                }}
              >
                <SessionProvider session={session}>
                  <Component
                    {...pageProps}
                    setUseTestAadhaar={setUseTestAadhaar}
                    useTestAadhaar={useTestAadhaar}
                  />
                </SessionProvider>
              </ConnectKitProvider>
            </QueryClientProvider>
          </WagmiProvider>
        </AnonAadhaarProvider>
      ) : null}
    </>
  );
}
