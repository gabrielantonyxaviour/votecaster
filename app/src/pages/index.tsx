import "@farcaster/auth-kit/styles.css";
import Head from "next/head";
import {
  SignInButton,
  AuthKitProvider,
  StatusAPIResponse,
} from "@farcaster/auth-kit";
import { useCallback, useState } from "react";
import Navbar from "@/components/Navbar";
const config = {
  relay: "https://relay.farcaster.xyz",
  rpcUrl: "https://mainnet.optimism.io",
  siweUri: "http://example.com/login",
  domain: "priv-cast.vercel.app",
};
import "@/styles/machina.css";
import Landing from "@/components/Landing";

export default function Home() {
  return (
    <>
      <Head>
        <title>Farcaster AuthKit + NextAuth Demo</title>
      </Head>
      <main style={{ fontFamily: "Inter, sans-serif" }}>
        <AuthKitProvider config={config}>
          <Content />
        </AuthKitProvider>
      </main>
    </>
  );
}

function Content() {
  return (
    <div className="max-w-[1200px] mx-auto h-screen py-8">
      <Navbar />
      <Landing />
    </div>
  );
}

// function Profile() {
//   const { data: session } = useSession();

//   return session ? (
//     <div style={{ fontFamily: "sans-serif" }}>
//       <p>Signed in as {session.user?.name}</p>
//       <p>
//         <button
//           type="button"
//           style={{ padding: "6px 12px", cursor: "pointer" }}
//           onClick={() => signOut()}
//         >
//           Click here to sign out
//         </button>
//       </p>
//     </div>
//   ) : (
//     <p>
//       Click the "Sign in with Farcaster" button above, then scan the QR code to
//       sign in.
//     </p>
//   );
// }
