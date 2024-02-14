"use client";
import { useRouter } from "next/router";
import Button from "./Button";

import { useEffect, useState } from "react";
import { useAccount } from "wagmi";

export default function YourPolls() {
  const [error, setError] = useState(false);
  const { address } = useAccount();
  const polls = [];
  const router = useRouter();

  useEffect(() => {
    console.log(address);
  }, []);
  return (
    <div className="w-full rounded-xl bg-[#FBF6FF] text-[#450C63] px-14 h-full pt-10   mt-4 ">
      <div className="flex justify-between">
        <p className="text-3xl font-bold">My Polls</p>
      </div>
      {polls.length === 0 ? (
        <div className="flex flex-col justify-center h-full items-center">
          {address == undefined ? (
            <p className="font-semibold text-lg mb-2">
              Connect wallet to view your polls
            </p>
          ) : (
            <>
              <p className="font-semibold text-lg mb-2">
                You have no polls yet 😈
              </p>
              <Button
                text="Create a poll"
                click={() => {
                  router.push("/create");
                }}
              ></Button>
            </>
          )}
        </div>
      ) : (
        <div>View Polls</div>
      )}
    </div>
  );
}
