"use client";
import React, { useEffect, useState } from "react";
import FarcasterButton from "../FarcasterButton";
import { Data, QueryResponse } from "@/utils/airstackInterface";
import SelectableButton from "@/components/WebPage/SelectableButton";
import { useAccount } from "wagmi";
import { useQuery } from "@airstack/airstack-react";
import { ConnectKitButton } from "connectkit";

import { createWalletClient, custom } from "viem";
import { scrollSepolia } from "viem/chains";

type HomeProps = {
  poll: any;
};
export default function VoteComponent({ poll }: HomeProps) {
  const [selectedOption, setSelectedOption] = useState(4);
  const { address } = useAccount();
  const [hasProfile, setHasProfile] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [walletClient, setWalletClient] = useState<any>();
  const [proof, setProof] = useState("");
  const [ready, setReady] = useState(false);
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
    { cache: true }
  );
  useEffect(() => {
    if (poll != null) setReady(true);
  }, [poll]);
  useEffect(() => {
    if ((window as any).ethereum != undefined) {
      setWalletClient(
        createWalletClient({
          chain: scrollSepolia,
          transport: custom((window as any).ethereum),
        })
      );
    }
  }, []);

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
        {ready && (
          <div className="w-[60%] h-full bg-[#FBF6FF]">
            <div className="flex flex-col h-full p-12">
              <p className="text-[#450C63] font-bold text-5xl">
                {poll.question}
              </p>
              <div className="flex justify-between space-x-8 pt-12">
                <div className="flex-1">
                  <SelectableButton
                    isSelected={selectedOption === 0}
                    disabled={false}
                    text={poll.option_a}
                    click={() => {
                      if (selectedOption !== 0) setSelectedOption(0);
                      else setSelectedOption(4);
                    }}
                  />
                </div>

                <div className="flex-1">
                  <SelectableButton
                    isSelected={selectedOption === 1}
                    disabled={false}
                    text={poll.option_b}
                    click={() => {
                      if (selectedOption !== 1) setSelectedOption(1);
                      else setSelectedOption(4);
                    }}
                  />
                </div>
              </div>
              <div className="flex justify-between space-x-8 mt-4">
                <div className="flex-1">
                  <SelectableButton
                    isSelected={selectedOption === 2}
                    disabled={false}
                    text={poll.option_c}
                    click={() => {
                      if (selectedOption !== 2) setSelectedOption(2);
                      else setSelectedOption(4);
                    }}
                  />
                </div>

                <div className="flex-1">
                  <SelectableButton
                    isSelected={selectedOption === 3}
                    disabled={false}
                    text={poll.option_d}
                    click={() => {
                      if (selectedOption !== 3) setSelectedOption(3);
                      else setSelectedOption(4);
                    }}
                  />
                </div>
              </div>{" "}
              {hasProfile ? (
                <div className="flex-1 h-full flex flex-col space-y-4 justify-center items-center">
                  <SelectableButton
                    text="🗳️ Cast Vote"
                    isSelected={false}
                    disabled={selectedOption == 4}
                    click={async () => {}}
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
        )}
        <div className="h-[80%] text-[#450C63] bg-[#FBF6FF] w-[35%] my-auto p-12">
          <p className="text-[#450C63] font-bold text-3xl text-center pb-4">
            LOGS
          </p>

          {logs.map((log, index) => (
            <p
              key={index}
              className="text-sm py-1 whitespace-normal text-nowrap overflow-x-auto "
            >
              {log}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}
