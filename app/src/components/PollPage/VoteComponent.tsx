"use client";
import circuit from "@/utils/privCastCircuit.json";
import React, { useEffect, useState } from "react";
import FarcasterButton from "../FarcasterButton";
import { Data, QueryResponse } from "@/utils/airstackInterface";
import SelectableButton from "@/components/SelectableButton";
import { useAccount } from "wagmi";
import { useQuery } from "@airstack/airstack-react";
import { ConnectKitButton } from "connectkit";
import connectSecretWallet from "@/utils/connectSecretWallet";

import { createWalletClient, custom } from "viem";
import { scrollSepolia } from "viem/chains";

import vote from "@/utils/supabase/vote";
import getVoted from "@/utils/supabase/getVoted";
import {
  secret_contract_address,
  secret_contract_hash,
} from "@/utils/constants";

type HomeProps = {
  poll: any;
};
export default function VoteComponent({ poll }: HomeProps) {
  const [selectedOption, setSelectedOption] = useState(4);
  const { address } = useAccount();
  const [hasProfile, setHasProfile] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [walletClient, setWalletClient] = useState<any>();
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
    if (poll != null && poll.question != "") setReady(true);
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
        <p className="text-3xl font-bold text-[#FDE2C4]">PRIV.CAST</p>
        <div className="flex space-x-4 ">
          <FarcasterButton isInverted={true} />
          <ConnectKitButton theme="retro" />
        </div>
      </div>
      <div className="flex justify-between h-full">
        {ready && (
          <div className="w-[60%] h-full bg-[#FDE2C4]">
            <div className="flex flex-col h-full p-12">
              <p className="text-[#BF080A] font-bold text-5xl">
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
                    click={async () => {
                      const { response: isVoted } = await getVoted({
                        pollId: poll.id,
                        nullifier: (data as any).Socials.Social[0].userId,
                      });
                      if (isVoted) {
                        setLogs((prev) => [
                          ...prev,
                          "[" +
                            Number(prev.length + 1) +
                            "] " +
                            "Already Voted",
                        ]);
                      } else {
                        const result = await connectSecretWallet(
                          address as string
                        );
                        setLogs((prev) => [
                          ...prev,
                          "[" +
                            Number(prev.length + 1) +
                            "] " +
                            "Transaction Pending... ⏳",
                        ]);
                        console.log({
                          farcaster_id: Number(
                            (data as any).Socials.Social[0].userId
                          ),
                          poll_id: poll.id,
                          vote: selectedOption,
                        });
                        const tx =
                          await result?.secretjs.tx.compute.executeContract(
                            {
                              sender: result.wallet.address,
                              contract_address: secret_contract_address,
                              msg: {
                                vote: {
                                  farcaster_id: Number(
                                    (data as any).Socials.Social[0].userId
                                  ),
                                  poll_id: poll.id,
                                  vote: selectedOption,
                                },
                              },
                              code_hash: secret_contract_hash,
                            },
                            { gasLimit: 100_000 }
                          );
                        console.log(tx);
                        setLogs((prev) => [
                          ...prev,
                          "[" +
                            Number(prev.length + 1) +
                            "] " +
                            "Transaction Confimed ✅",
                        ]);
                        setLogs((prev) => [
                          ...prev,
                          ("[" +
                            Number(prev.length + 1) +
                            "] " +
                            ("https://testnet.ping.pub/secret/tx/" +
                              tx?.transactionHash)) as string,
                        ]);
                        await vote({
                          pollId: poll.id,
                          nullifier: (data as any).Socials.Social[0].userId,
                          vote: selectedOption,
                        });
                      }
                    }}
                  />
                </div>
              ) : (
                <div className="flex-1 h-full flex flex-col space-y-4 justify-center items-center">
                  <p className="text-lg font-semibold text-[#BF080A] pt-12">
                    Connected Wallet does not have a Farcaster Account
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
        {ready && (
          <div className="h-[80%] text-[#BF080A] bg-[#FDE2C4] w-[35%] my-auto p-12">
            <p className="text-[#BF080A] font-bold text-3xl text-center pb-4">
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
        )}
      </div>
    </div>
  );
}
