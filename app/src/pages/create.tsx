import ChooseFeatures from "@/components/Create/ChooseFeatures";
import Confirmation from "@/components/Create/Confirmation";
import CreateQuestion from "@/components/Create/CreateQuestion";
import Navbar from "@/components/Navbar";
import React, { useEffect, useState } from "react";
import { Data, QueryResponse } from "@/utils/airstackInterface";
import { useQuery } from "@airstack/airstack-react";
import { useAccount, useWriteContract } from "wagmi";
import axios from "axios";
import Confetti from "react-confetti";
import { abi, deployment } from "@/utils/constants";
import { scrollSepolia } from "viem/chains";
import { createPublicClient, http } from "viem";
import CreatedModal from "@/components/CreatedModal";
import useWindowSize from "@/hooks/useWindowSize";

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
  const { height, width } = useWindowSize();
  const [isSybil, setIsSybil] = useState(false);
  const [pollId, setPollId] = useState<string>("");
  const [hasProfile, setHasProfile] = useState(false);
  const { address } = useAccount();
  const [ipfsHash, setIpfsHash] = useState<string>("");
  const [txHash, setTxHash] = useState<string>("");
  const [isDisabled, setIsDisabled] = useState(false);
  const [status, setStatus] = useState("");
  const { writeContractAsync: createPoll } = useWriteContract();

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
      {pollId != "" && <Confetti width={width} height={height} />}
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
                transport: http("https://rpc.ankr.com/scroll_sepolia_testnet"),
              });
              const unwatch = publicClient.watchContractEvent({
                address: deployment,
                abi,
                onLogs: (logs) => {
                  console.log((logs[0] as any).args.createrAddress);
                  if ((logs[0] as any).args.createrAddress == address) {
                    setStatus("Transaction Confirmed!");
                    setPollId((logs[0] as any).args.pollId);
                  }
                  unwatch();
                },
              });

              const tx = await createPoll({
                abi,
                address: deployment,
                functionName: "createPoll",
                args: [res.data.IpfsHash, poll.duration, isSybil],
              });
              setTxHash("https://sepolia.scrollscan.dev/tx/" + tx);
              setStatus("Waiting for Confirmation...");
              // contract call
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
