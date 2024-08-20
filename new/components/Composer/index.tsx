import React, { useEffect, useState } from "react";

import { useRouter } from "next/navigation";
import TopBar from "./TopBar";

import Steps from "./Steps";
import QuestionPage from "./QuestionPage";
import { Poll } from "@/utils/types";
import ChooseThemePage from "./ChooseThemePage";
import { useAccount } from "wagmi";
import ConnectPage from "./ConnectPage";

export default function ComposerAction() {
  const [step, setStep] = useState(1);
  const [error, setError] = useState(false);
  const [poll, setPoll] = useState<Poll>({
    question: "",
    options: ["Option 1", "Option 2", "Option 3", "Option 4"],
    duration: 0,
    theme: 0,
    proofOfHumanity: false,
  });

  const [durationInput, setDurationInput] = useState("");
  const router = useRouter();
  const { address, status } = useAccount();
  useEffect(() => {
    if (status != "connected") setStep(0);
    else if (status == "connected" && step == 0) setStep(1);
  }, [status]);
  return (
    <div className="px-3 h-screen">
      <div className="w-full bg-[#FBF6FF] text-[#450C63] h-full">
        <Steps step={step} />
        <div className="flex flex-col h-full justify-between items-center  pt-6">
          <TopBar />
          {step == 0 ? (
            <ConnectPage />
          ) : step == 1 ? (
            <QuestionPage
              poll={poll}
              setPoll={setPoll}
              setStep={setStep}
              durationInput={durationInput}
              setDurationInput={setDurationInput}
            />
          ) : (
            <ChooseThemePage
              poll={poll}
              setStep={setStep}
              setProofOfHumanity={(value: boolean) => {
                setPoll({ ...poll, proofOfHumanity: value });
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
