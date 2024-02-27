import { useEffect, useState } from "react";
import ResultComponent from "./ResultComponent";
import VoteComponent from "./VoteComponent";
import getPoll from "@/utils/supabase/getPoll";

type PollProps = {
  setUseTestAadhaar: (state: boolean) => void;
  useTestAadhaar: boolean;
  id: string;
  result: boolean;
};

export default function PollPageComponent({ id, result }: PollProps) {
  const [poll, setPoll] = useState<any>({
    question: "",
    options: ["", "", "", ""],
  });

  useEffect(() => {
    console.log(result);
    (async function () {
      const { response } = await getPoll({ pollId: id });
      console.log(response);
      if (response.length == 0 || response == null || response == undefined) {
        console.log("No poll found");
      } else {
        setPoll(response);
      }
    })();
  }, []);

  return result ? (
    <ResultComponent poll={poll} />
  ) : (
    <VoteComponent poll={poll} />
  );
}
