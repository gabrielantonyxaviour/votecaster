import ChooseFeatures from "@/components/Create/ChooseFeatures";
import Confirmation from "@/components/Create/Confirmation";
import CreateQuestion from "@/components/Create/CreateQuestion";
import Navbar from "@/components/Navbar";
import React, { useEffect, useState } from "react";
import { Data, QueryResponse } from "@/utils/airstackInterface";
import { useQuery } from "@airstack/airstack-react";
import { useAccount, useWriteContract } from "wagmi";
import axios from "axios";
import { abi, deployment } from "@/utils/constants";
import { scrollSepolia } from "viem/chains";
import { createPublicClient, http } from "viem";
import CreatedModal from "@/components/CreatedModal";
import createPoll from "@/utils/supabase/createPoll";

export default function CreatePage() {
  const [poll, setPoll] = useState<{
    question: string;
    options: string[];
    duration: number;
  }>({
    question: "",
    options: ["Option 1", "Option 2", "Option 3", "Option 4"],
    duration: 0,
  });
  const [isSybil, setIsSybil] = useState(false);
  const [pollId, setPollId] = useState<string>("");
  const [hasProfile, setHasProfile] = useState(false);
  const { address } = useAccount();
  const [ipfsHash, setIpfsHash] = useState<string>("");
  const [txHash, setTxHash] = useState<string>("");
  const [isDisabled, setIsDisabled] = useState(false);
  const [status, setStatus] = useState("");
  const { writeContractAsync: createPollContractCall } = useWriteContract();

  const { data, loading, error }: QueryResponse = useQuery<Data>(
    `  query MyQuery {
  Socials(
    input: {blockchain: ethereum, filter: {dappName: {_eq: farcaster}, identity: {_eq: "${address}"}}}
  ) {
    Social {
      userId
      fnames
    }
  }
}`,
    {},
    { cache: true }
  );
  useEffect(() => {
    // console.log(data);
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
        {pollId != "" && (
          <CreatedModal pollId={pollId} close={() => setPollId("")} />
        )}
        <div className="flex flex-col justify-between w-[39%] h-full py-3">
          <ChooseFeatures isSybil={isSybil} setIsSybil={setIsSybil} />
          <Confirmation
            post={async () => {
              setIsDisabled(true);
              setStatus("Uploading to IPFS...");
              console.log("Uploading to IPFS...");

              const res = await axios.post("/api/pinata", poll, {
                headers: {
                  "Content-Type": "application/json",
                },
              });
              setIpfsHash(res.data.IpfsHash);
              setStatus("Initiating transaction...");
              console.log("Initiating transaction...");

              const publicClient = createPublicClient({
                chain: scrollSepolia,
                transport: http(),
              });
              console.log("Worked till now");
              const unwatch = publicClient.watchContractEvent({
                address: deployment,
                abi,
                onLogs: async (logs) => {
                  console.log("Logged!");
                  console.log((logs[0] as any).args.creatorAddress);
                  if ((logs[0] as any).args.creatorAddress == address) {
                    console.log("Got the right log!");

                    const { response: createPollResponse } = await createPoll({
                      pollId: (logs[0] as any).args.pollId,
                      question: poll.question,
                      creator: address as string,
                      farcaster_username: (data as any).Socials.Social[0]
                        .fnames[0],
                      optionA: poll.options.length > 0 ? poll.options[0] : "",
                      optionB: poll.options.length > 1 ? poll.options[1] : "",
                      optionC: poll.options.length > 2 ? poll.options[2] : "",
                      optionD: poll.options.length > 3 ? poll.options[3] : "",
                      isAnon: isSybil,
                      validity: poll.duration,
                    });
                    console.log(createPollResponse);
                    setPollId(createPollResponse.id);
                    setStatus("Transaction Confirmed!");
                    unwatch();
                  }
                },
              });

              const tx = await createPollContractCall({
                abi,
                address: deployment,
                functionName: "createPoll",
                args: [res.data.IpfsHash, poll.duration, isSybil],
              });
              setTxHash("https://sepolia.scrollscan.dev/tx/" + tx);
              setStatus("Waiting for Confirmation...");
            }}
            isEnabled={
              !isDisabled &&
              poll.question != "" &&
              hasProfile &&
              poll.duration != 0
            }
            status={status}
            isSigned={false}
            hasProfile={hasProfile}
            isPosted={false}
            txHash={txHash}
            ipfsHash={ipfsHash}
          />
        </div>
      </div>
    </div>
  );
}
