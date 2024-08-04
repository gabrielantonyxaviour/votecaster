"use client";

import Link from "next/link";
import { useRouter } from "next/router";
import { ConnectKitButton } from "connectkit";
import FarcasterButton from "./FarcasterButton";
import { usePathname } from "next/navigation";

export default function Navbar() {
  return (
    <div className="flex justify-between p-4 bg-[#FBF6FF] text-[#450C63] rounded-xl py-5">
      <Link href={"/"} className="text-2xl font-bold my-auto ">
        PRIV.CAST
      </Link>

      <div className="flex space-x-4 my-auto">
        <Link
          href={"/create"}
          className={usePathname() == "/create" ? "underline" : ""}
        >
          Create
        </Link>
        <Link
          href={"/polls"}
          className={usePathname() == "/polls" ? "underline" : ""}
        >
          Polls
        </Link>
      </div>
      <div className="flex space-x-4">
        <FarcasterButton isInverted={false} />
        <ConnectKitButton theme="retro" />
      </div>
    </div>
  );
}
