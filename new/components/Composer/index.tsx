import React, { useEffect, useState } from "react";

import { useRouter } from "next/navigation";
import TopBar from "./TopBar";

import Steps from "./Steps";
import QuestionPage from "@/components/Composer/pages/QuestionPage";
import { Poll } from "@/utils/types";
import ChooseThemePage from "./pages/ChooseThemePage";
import { useAccount } from "wagmi";
import ConnectPage from "./pages/ConnectPage";
import PollCreatedPage from "@/components/Composer/pages/PollCreatedPage";

export default function ComposerAction() {
  const [pollId, setPollId] = useState("");
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
          ) : step == 2 ? (
            <ChooseThemePage
              poll={poll}
              setStep={setStep}
              setProofOfHumanity={(value: boolean) => {
                setPoll({ ...poll, proofOfHumanity: value });
              }}
              setPollId={setPollId}
              setTheme={(theme: boolean) => {
                setPoll({
                  ...poll,
                  theme: theme ? (poll.theme + 1) % 7 : (poll.theme + 6) % 7,
                });
              }}
            />
          ) : (
            <PollCreatedPage pollId={pollId} poll={poll} setStep={setStep} />
          )}
        </div>
      </div>
    </div>
  );
}
