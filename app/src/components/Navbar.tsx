"use client";

import Button from "./Button";
import Link from "next/link";
import { useProfile } from "@farcaster/auth-kit";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { ConnectKitButton } from "connectkit";

export default function Navbar() {
  const router = useRouter();
  const {
    isAuthenticated,
    profile: { username, fid, bio, displayName, pfpUrl },
  } = useProfile();

  useEffect(() => {
    console.log(username, fid, bio, displayName, pfpUrl, isAuthenticated);
    if (isAuthenticated) router.push("/polls");
  }, [isAuthenticated]);
  return (
    <div className="flex justify-between p-4 bg-[#FBF6FF] text-[#450C63] rounded-xl py-5">
      <Link href={"/"} className="text-2xl font-bold my-auto ">
        PRIV.CAST
      </Link>
      {isAuthenticated ? (
        <div className="flex space-x-4 my-auto">
          <Link href={"/polls"} className="hover:underline">
            Polls
          </Link>
          <Link href={"/create"} className="hover:underline">
            Create
          </Link>
        </div>
      ) : (
        <div></div>
      )}
      <ConnectKitButton theme="retro" />
    </div>
  );
}
