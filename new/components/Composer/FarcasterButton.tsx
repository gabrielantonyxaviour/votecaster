import Image from "next/image";
import React, { useEffect, useState } from "react";

export default function FarcasterButton({
  fetched,
  profileImage,
  userId,
}: {
  fetched: boolean;
  profileImage: string;
  userId: string;
}) {
  return (
    fetched && (
      <div
        className={`  bg-[#4A0C63] translate-y-[3px] rounded-lg text-center select-none`}
      >
        <div
          className={`${"bg-[#8A08BF] text-white"} -translate-y-1  translate-x-1 rounded-lg border-2 ${"border-[#4A0C63]"} cursor-pointer flex py-[5px] px-3 space-x-3`}
        >
          <Image
            src={profileImage}
            width={25}
            height={25}
            alt="pfp"
            className="rounded-full"
          />
          <p className={`text-white text-md font-normal my-auto`}>{userId}</p>
        </div>
      </div>
    )
  );
}
