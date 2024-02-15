import ChooseFeatures from "@/components/Create/ChooseFeatures";
import Confirmation from "@/components/Create/Confirmation";
import CreateQuestion from "@/components/Create/CreateQuestion";
import Navbar from "@/components/Navbar";
import React, { useEffect, useState } from "react";
import { Data, QueryResponse } from "@/utils/airstackInterface";
import { useQuery } from "@airstack/airstack-react";
import { useAccount } from "wagmi";

export default function CreatePage() {
  const [poll, setPoll] = useState<{
    question: string;
    options: string[];
    duration: number;
  }>({
    question: "",
    options: ["Option 1", "Option 2", "Option 3", "Option 4 "],
    duration: 0,
  });
  const [isSybil, setIsSybil] = useState(false);
  const [hasProfile, setHasProfile] = useState(false);
  const { address } = useAccount();
  const { data, loading, error }: QueryResponse = useQuery<Data>(
    `  query MyQuery {
  Socials(
    input: {blockchain: ethereum, filter: {dappName: {_eq: farcaster}, identity: {_eq: "${address}"}}}
  ) {
    Social {
      userId
    }
  }
}`,
    {},
    { cache: false }
  );
  useEffect(() => {
    console.log(data);
  }, [data]);
  useEffect(() => {
    if (
      data != null &&
      (data as any).Socials != null &&
      (data as any).Socials.Social != null &&
      (data as any).Socials.Social.length > 0
    ) {
      setHasProfile(true);
    } else {
      setHasProfile(false);
    }
  }, [data, loading, error]);

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
            isEnabled={poll.question != "" && hasProfile && poll.duration != 0}
            isSigned={false}
            hasProfile={hasProfile}
            isPosted={false}
          />
        </div>
      </div>
    </div>
  );
}
