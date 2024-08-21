"use client";

import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import TopBar from "../TopBar";

export default function Poll() {
  const { status, address } = useAccount();
  const [fName, setFName] = useState("");

  return (
    <div className="px-3 h-screen">
      <div className="w-full bg-[#FBF6FF] text-[#450C63] h-full">
        <div className="flex flex-col h-full justify-between items-center  pt-6">
          <TopBar setFName={setFName} fName={fName} />
        </div>
      </div>
    </div>
  );
}
