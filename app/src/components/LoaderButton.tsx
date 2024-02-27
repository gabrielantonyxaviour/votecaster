"use client";

import React from "react";

export default function LoaderButton({
  name,
  percentage,
  remaining,
  voteCount,
  biggest,
}: {
  name: string;
  percentage: number;
  remaining: number;
  voteCount: number;
  biggest: boolean;
}) {
  console.log("Name", name);
  console.log("Percentage", percentage);
  console.log("Remaining", remaining);

  return (
    <div className="bg-[#630C0C] relative rounded-sm  ">
      <div
        className={`${
          biggest ? "bg-white" : "bg-[#BF0808]"
        } -translate-y-1 -translate-x-1 rounded-l-sm border-2 border-[#4A0C63]  w-full`}
      >
        <p
          className={
            biggest
              ? "text-black text-sm font-semibold mx-4 my-2"
              : "text-white text-sm font-semibold mx-4 my-2"
          }
        >
          {name + " (" + percentage + "%)"} {voteCount} Vote(s)
        </p>
      </div>
    </div>
  );
}
