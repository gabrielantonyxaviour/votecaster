import ChooseFeatures from "@/components/Create/ChooseFeatures";
import Confirmation from "@/components/Create/Confirmation";
import CreateQuestion from "@/components/Create/CreateQuestion";
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
          <Confirmation
            sign={() => {}}
            post={() => {}}
            isEnabled={true}
            isSigned={false}
            isPosted={false}
          />
        </div>
      </div>
    </div>
  );
}
