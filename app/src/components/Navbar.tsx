"use client";
import React from "react";
import Button from "./Button";
import Link from "next/link";

export default function Navbar() {
  return (
    <div className="flex justify-between p-4 bg-[#FBF6FF] text-[#450C63] rounded-xl">
      <Link href={"/"} className="text-xl font-bold">
        PRIV.CAST
      </Link>
      <div className="flex space-x-4">
        <Link href={"/polls"} className="hover:underline">
          Polls
        </Link>
        <Link href={"/create"} className="hover:underline">
          Create
        </Link>
      </div>
      <Button text="Sign in with Farcaster" click={() => {}} />
    </div>
  );
}
