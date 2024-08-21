"use client";
import Image from "next/image";
import React from "react";
export default function TopBar() {
  return (
    <div className="flex">
      <Image
        src="/logo.png"
        className="rounded-md border-2 border-[#450C63]"
        alt="Logo"
        width={30}
        height={30}
      />
      <p className="text-[#450C63] text-lg font-semibold mx-2 my-auto">
        PRIV.CAST
      </p>
    </div>
  );
}
