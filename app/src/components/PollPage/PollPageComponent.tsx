"use client";
import React, { useEffect, useState } from "react";
import FarcasterButton from "../FarcasterButton";
import { Data, QueryResponse } from "@/utils/airstackInterface";
import SelectableButton from "@/components/SelectableButton";
import { useAccount } from "wagmi";
import { useQuery } from "@airstack/airstack-react";
import { ConnectKitButton } from "connectkit";
import {
  AnonAadhaarProof,
  LogInWithAnonAadhaar,
  useAnonAadhaar,
} from "@anon-aadhaar/react";

type HomeProps = {
  setUseTestAadhaar: (state: boolean) => void;
  useTestAadhaar: boolean;
};
export default function PollPageComponent({
  setUseTestAadhaar,
  useTestAadhaar,
}: HomeProps) {
  const [poll, setPoll] = useState<any>({
    question: "WHICH TEAM IS WINNING LA LIGA?",
    options: ["Real Madrid", "Barcelona", "Atletico Madrid", "Sevilla"],
    selectedOption: 0,
  });
  const [selectedOption, setSelectedOption] = useState(0);
  const { address } = useAccount();
  const [hasProfile, setHasProfile] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const {
    data,
    loading,
    error: queryError,
  }: QueryResponse = useQuery<Data>(
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
  const [anonAadhaar] = useAnonAadhaar();

  useEffect(() => {
    console.log("Anon Aadhaar: ", anonAadhaar.status);
    console.log(anonAadhaar);
    if (anonAadhaar.status === "logged-in") {
      setLogs(["Anon Aadhar logged-in. Proof verified ✅"]);
    }
  }, [anonAadhaar]);

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
  }, [data, loading, queryError]);
  return (
    <div className="max-w-[1200px] mx-auto h-screen py-8">
      <div className="flex justify-between pb-12 ">
        <p className="text-3xl font-bold ">PRIV.CAST</p>
        <div className="flex space-x-4 ">
          <FarcasterButton isInverted={true} />
          <ConnectKitButton theme="retro" />
        </div>
      </div>
      <div className="flex justify-between h-full">
        <div className="w-[60%] h-full bg-[#FBF6FF]">
          <div className="flex flex-col h-full p-12">
            <p className="text-[#450C63] font-bold text-5xl">{poll.question}</p>
            <div className="flex justify-between space-x-8 pt-12">
              <div className="flex-1">
                {poll.options.length > 0 && (
                  <SelectableButton
                    isSelected={selectedOption === 1}
                    disabled={false}
                    text={poll.options[0]}
                    click={() => {
                      if (selectedOption !== 1) setSelectedOption(1);
                      else setSelectedOption(0);
                    }}
                  />
                )}
              </div>

              <div className="flex-1">
                {poll.options.length > 1 && (
                  <SelectableButton
                    isSelected={selectedOption === 2}
                    disabled={false}
                    text={poll.options[1]}
                    click={() => {
                      if (selectedOption !== 2) setSelectedOption(2);
                      else setSelectedOption(0);
                    }}
                  />
                )}
              </div>
            </div>
            <div className="flex justify-between space-x-8 mt-4">
              <div className="flex-1">
                {poll.options.length > 2 && (
                  <SelectableButton
                    isSelected={selectedOption === 3}
                    disabled={false}
                    text={poll.options[2]}
                    click={() => {
                      if (selectedOption !== 3) setSelectedOption(3);
                      else setSelectedOption(0);
                    }}
                  />
                )}
              </div>

              <div className="flex-1">
                {poll.options.length > 3 && (
                  <SelectableButton
                    isSelected={selectedOption === 4}
                    disabled={false}
                    text={poll.options[3]}
                    click={() => {
                      if (selectedOption !== 4) setSelectedOption(4);
                      else setSelectedOption(0);
                    }}
                  />
                )}
              </div>
            </div>
            {hasProfile ? (
              <div className="flex-1 h-full flex flex-col space-y-4 justify-center items-center">
                <p className="text-xl font-semibold text-[#450C63] pt-12">
                  AADHAR VERIFICATION
                </p>
                <div className="pb-12">
                  <LogInWithAnonAadhaar />
                </div>
                <SelectableButton
                  text="🗳️ Cast Vote"
                  isSelected={false}
                  disabled={false}
                  click={() => {}}
                />
              </div>
            ) : (
              <div className="flex-1 h-full flex flex-col space-y-4 justify-center items-center">
                <p className="text-lg font-semibold text-[#450C63] pt-12">
                  Connected Wallet does not have a Farcaster Account
                </p>
              </div>
            )}
          </div>
        </div>
        <div className="h-[80%] text-[#450C63] bg-[#FBF6FF] w-[35%] my-auto p-12">
          <p className="text-[#450C63] font-bold text-3xl text-center">LOGS</p>
          <p className="text-sm pt-4 pb-2">
            [1] Anon Aadhar logged-in. Proof verified ✅
          </p>
          {anonAadhaar.status === "logged-in" && (
            <div className="flex justify-center">
              <div className="whitespace-normal overflow-y-auto h-[100px] mx-auto ">
                <AnonAadhaarProof
                  code={JSON.stringify(
                    (anonAadhaar as any).anonAadhaarProof,
                    null,
                    2
                  )}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
