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
import createPollSupabase from "@/utils/supabase/createPoll";

export default function ComposerAction() {
  const [pollId, setPollId] = useState("");
  const [step, setStep] = useState(1);
  const [error, setError] = useState(false);
  const [poll, setPoll] = useState<Poll>({
    question: "",
    options: ["Option 1", "Option 2", "Option 3", "Option 4"],
    duration: 0,
    theme: 0,
  });
  const [pollImage, setPollImage] = useState<string>("");
  const [proofOfHumanity, setProofOfHumanity] = useState<boolean>(false);

  const [durationInput, setDurationInput] = useState("");
  const [sendTxHash, setSendTxHash] = useState("");
  const { status, address } = useAccount();
  const [fName, setFName] = useState("");
  useEffect(() => {
    if (status != "connected") setStep(0);
    else if (status == "connected" && step == 0) setStep(1);
  }, [status]);

  useEffect(() => {
    if (step == 2) {
      (async function () {
        const response = await fetch(
          `/api/visualize/${encodeURIComponent(
            poll.question
          )}/a/${encodeURIComponent(poll.options[0])}/b/${encodeURIComponent(
            poll.options[1]
          )}/c/${encodeURIComponent(poll.options[2])}/d/${encodeURIComponent(
            poll.options[3]
          )}/theme/${poll.theme}`
        ); // Get the HTML text from the response
        const html = await response.text();
        console.log(html);
        const regex = /<meta\s+property="fc:frame:image"\s+content="([^"]*)"/;
        const match = html.match(regex);
        if (match) {
          const metaTagContent = match[1];
          console.log(metaTagContent);
          const metaRegex = /\/api\/visualize\/.*/;
          const metaMatch = metaTagContent.match(metaRegex);
          if (metaMatch) {
            console.log(metaMatch[0]);
            setPollImage(metaMatch[0]);
          } else {
            console.log("No match found");
          }
        } else {
          console.log("Meta tag not found");
        }
      })();
    }
  }, [step, poll]);
  return (
    <div className="px-3 h-screen">
      <div className="w-full bg-[#FBF6FF] text-[#450C63] h-full">
        <Steps step={step} />
        <div className="flex flex-col h-full justify-between items-center  pt-6">
          <TopBar setFName={setFName} fName={fName} />
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
              setProofOfHumanity={setProofOfHumanity}
              setPollId={setPollId}
              setTheme={(theme: boolean) => {
                setPoll({
                  ...poll,
                  theme: theme ? (poll.theme + 1) % 7 : (poll.theme + 6) % 7,
                });
              }}
              proofOfHumanity={proofOfHumanity}
              pollImage={pollImage}
              setSendTxHash={setSendTxHash}
              updateSupabase={async () => {
                const pId = (
                  Math.floor(Math.random() * 9999999951) + 50
                ).toString();
                const { message } = await createPollSupabase({
                  pollId: pId,
                  question: poll.question,
                  creator: address as string,
                  farcaster_username: fName,
                  optionA: poll.options[0],
                  optionB: poll.options[1],
                  optionC: poll.options[2],
                  optionD: poll.options[3],
                  isAnon: proofOfHumanity,
                  validity: durationInput ? parseInt(durationInput) : 0,
                });
                if (message == "Poll created") {
                  setPollId(pId);
                }
              }}
            />
          ) : (
            <PollCreatedPage
              pollId={pollId}
              pollImage={pollImage}
              sendTxHash={sendTxHash}
            />
          )}
        </div>
      </div>
    </div>
  );
}
