import ChooseFeatures from "@/components/Create/ChooseFeatures";
import CreateQuestion from "@/components/Create/CreateQuestion";
import InputButton from "@/components/InputButton";
import Navbar from "@/components/Navbar";
import React, { useState } from "react";

export default function CreatePage() {
  const [poll, setPoll] = useState<{
    question: string;
    options: string[];
  }>({
    question: "",
    options: ["Option 1", "Option 2", "Option 3", "Option 4 "],
  });
  const [isSybil, setIsSybil] = useState(false);
  return (
    <div className="max-w-[1200px] mx-auto h-screen py-8">
      <Navbar />
      <div className="flex justify-between h-full w-full">
        <CreateQuestion poll={poll} setPoll={setPoll} />
        <div className="flex flex-col justify-between w-[39%] h-full py-3">
          <ChooseFeatures isSybil={isSybil} setIsSybil={setIsSybil} />
          <div className="h-[33%] w-full bg-[#FBF6FF] rounded-xl"></div>
        </div>
      </div>
    </div>
  );
}
