import Navbar from "@/components/Navbar";
import React from "react";
import "@farcaster/auth-kit/styles.css";

import Head from "next/head";
import { useSession, signIn, signOut, getCsrfToken } from "next-auth/react";
import {
  SignInButton,
  AuthKitProvider,
  StatusAPIResponse,
} from "@farcaster/auth-kit";
import { useCallback, useState } from "react";
const config = {
  rpcUrl: "https://mainnet.optimism.io",
  domain: "https://priv-cast.vercel.app",
  siweUri: "https://priv-cast.vercel.app/login",
};

export default function Home() {
  return (
    <>
      <Head>
        <title>Farcaster AuthKit + NextAuth Demo</title>
      </Head>
      <main style={{ fontFamily: "Inter, sans-serif" }}>
        <AuthKitProvider config={config}>
          <div className="max-w-[1200px] mx-auto h-screen py-8">
            <Navbar />
          </div>
        </AuthKitProvider>
      </main>
    </>
  );
}
