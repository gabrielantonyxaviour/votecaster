"use client";

import Link from "next/link";
import { useRouter } from "next/router";
import { ConnectKitButton } from "connectkit";
import FarcasterButton from "./FarcasterButton";

export default function Navbar() {
  const router = useRouter();

  return (
    <div className="flex justify-between p-4 bg-[#FBF6FF] text-[#450C63] rounded-xl py-5">
      <Link href={"/"} className="text-2xl font-bold my-auto ">
        PRIV.CAST
      </Link>

      <div className="flex space-x-4 my-auto">
        <Link
          href={"/polls"}
          className={router.pathname == "/polls" ? "underline" : ""}
        >
          Polls
        </Link>
        <Link
          href={"/create"}
          className={router.pathname == "/create" ? "underline" : ""}
        >
          Create
        </Link>
      </div>
      <div className="flex space-x-4">
        <FarcasterButton />
        <ConnectKitButton theme="retro" />
      </div>
    </div>
  );
}
