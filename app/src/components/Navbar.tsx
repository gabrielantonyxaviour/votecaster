"use client";
import React, { useCallback, useEffect, useState } from "react";
import Button from "./Button";
import Link from "next/link";
import {
  SignInButton,
  StatusAPIResponse,
  useProfile,
  useSignIn,
} from "@farcaster/auth-kit";
import { useSession, signIn, signOut, getCsrfToken } from "next-auth/react";

export default function Navbar() {
  const [error, setError] = useState(false);
  const {
    isAuthenticated,
    profile: { username, fid, bio, displayName, pfpUrl },
  } = useProfile();
  const getNonce = useCallback(async () => {
    const nonce = await getCsrfToken();
    if (!nonce) throw new Error("Unable to generate nonce");
    return nonce;
  }, []);
  useEffect(() => {
    console.log("isAuthenticated", isAuthenticated);
    console.log("username", username);
  }, []);
  const handleSuccess = useCallback(
    (res: StatusAPIResponse) => {
      signIn("credentials", {
        message: res.message,
        signature: res.signature,
        name: res.username,
        pfp: res.pfpUrl,
        redirect: false,
      });
    },
    [signIn]
  );
  return (
    <div className="flex justify-between p-4 bg-[#FBF6FF] text-[#450C63] rounded-xl py-5">
      <Link href={"/"} className="text-xl font-bold my-auto ">
        PRIV.CAST
      </Link>
      <div className="flex space-x-4 my-auto">
        <Link href={"/polls"} className="hover:underline">
          Polls
        </Link>
        <Link href={"/create"} className="hover:underline">
          Create
        </Link>
      </div>
      <Button text="Connect Wallet" click={() => {}}></Button>

      {/* <SignInButton
        nonce={getNonce}
        onSuccess={handleSuccess}
        onError={() => setError(true)}
        onSignOut={() => signOut()}
      /> */}
    </div>
  );
}
