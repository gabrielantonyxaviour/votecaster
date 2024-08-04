"use client";
import { useEffect, useState } from "react";
import { useQuery } from "@airstack/airstack-react";
import { useAccount, useWriteContract } from "wagmi";
import axios from "axios";
import { scrollSepolia } from "viem/chains";
import { createPublicClient, http } from "viem";
import Navbar from "@/components/WebPage/Navbar";
import Confirmation from "@/components/WebPage/Create/Confirmation";
import CreateQuestion from "@/components/WebPage/Create/CreateQuestion";
import CreatedModal from "@/components/WebPage/CreatedModal";
import createPoll from "@/utils/supabase/createPoll";
import { Data, QueryResponse } from "@/utils/airstackInterface";

export default function CreatePage() {
  const [poll, setPoll] = useState({
    question: "",
    options: ["Option 1", "Option 2", "Option 3", "Option 4"],
    duration: 0,
  });
  const [isSybil, setIsSybil] = useState(false);
  const [pollId, setPollId] = useState("");
  const [hasProfile, setHasProfile] = useState(false);
  const { address } = useAccount();
  const [ipfsHash, setIpfsHash] = useState("");
  const [txHash, setTxHash] = useState("");
  const [isDisabled, setIsDisabled] = useState(false);
  const [status, setStatus] = useState("");
  const { writeContractAsync: createPollContractCall } = useWriteContract();

  const { data, loading, error }: QueryResponse = useQuery<Data>(
    `query MyQuery {
      Socials(input: {blockchain: ethereum, filter: {dappName: {_eq: farcaster}, identity: {_eq: "${address}"}}}) {
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
    // if (data?.Socials?.Social?.length > 0) {
    //   setHasProfile(true);
    // } else {
    //   setHasProfile(false);
    // }

    console.log("AIRSTACK DATA");
    console.log(data);
  }, [data, loading, error]);

  return (
    <div className="max-w-[1200px] mx-auto h-screen py-8">
      <Navbar />
      <div className="flex justify-between h-full w-full">
        <CreateQuestion poll={poll} setPoll={setPoll} />
        {pollId && <CreatedModal pollId={pollId} close={() => setPollId("")} />}
        <div className="flex flex-col justify-center w-[39%] h-full py-3">
          <Confirmation
            post={async () => {
              try {
                setIsDisabled(true);
                setStatus("Uploading to IPFS...");
                const res = await axios.post("/api/pinata", poll, {
                  headers: {
                    "Content-Type": "application/json",
                  },
                });
                setIpfsHash(res.data.IpfsHash);
                setStatus("Initiating transaction...");

                const publicClient = createPublicClient({
                  chain: scrollSepolia,
                  transport: http(),
                });

                // const unwatch = publicClient.watchContractEvent({
                //   address: deployment,
                //   abi,
                //   onLogs: async (logs) => {
                //     if (logs[0].args.creatorAddress === address) {
                //       const { response: createPollResponse } = await createPoll(
                //         {
                //           pollId: logs[0].args.pollId,
                //           question: poll.question,
                //           creator: address as string,
                //           farcaster_username: data.Socials.Social[0].fnames[0],
                //           optionA: poll.options[0] || "",
                //           optionB: poll.options[1] || "",
                //           optionC: poll.options[2] || "",
                //           optionD: poll.options[3] || "",
                //           isAnon: false,
                //           validity: poll.duration,
                //         }
                //       );
                //       setPollId(createPollResponse.id);
                //       setStatus("Transaction Confirmed!");
                //       unwatch();
                //     }
                //   },
                // });

                // const tx = await createPollContractCall({
                //   abi,
                //   address: deployment,
                //   functionName: "createPoll",
                //   args: [res.data.IpfsHash, poll.duration],
                // });
                // setTxHash("https://sepolia.scrollscan.dev/tx/" + tx);
                // setStatus("Waiting for Confirmation...");
              } catch (e) {
                console.error(e);
              }
            }}
            // isEnabled={
            //   !isDisabled && poll.question && hasProfile && poll.duration
            // }
            isEnabled={true}
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
