"use client";

import { useEffect, useState } from "react";
import { useAccount, useSwitchChain } from "wagmi";
import TopBar from "../TopBar";
import SelectableButton from "../Common/SelectableButton";
import getPoll from "@/utils/supabase/getPoll";
import { Poll as PollType, TimeLeft, Transaction } from "@/utils/types";
import calculateTimeLeft from "@/utils/calculateTimeLeft";
import {
  IDKitWidget,
  VerificationLevel,
  ISuccessResult,
} from "@worldcoin/idkit";
import HoverButton from "../Common/HoverButton";
import getCastVoteSignData from "@/utils/write/helpers/getCastVoteSignData";
import { concat, createWalletClient, custom, recoverPublicKey } from "viem";
import { baseSepolia } from "viem/chains";

export default function Poll({ pollId }: { pollId: string }) {
  const { status, chainId, address } = useAccount();
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);
  const [pollEnded, setPollEnded] = useState<boolean>(false);
  const [poll, setPoll] = useState<PollType>({
    question: "",
    options: ["", "", "", ""],
    duration: 0,
    theme: 0,
  });
  const [viewResults, setViewResults] = useState<boolean>(false);
  const [proofOfHumanity, setProofOfHumanity] = useState<boolean>(false);
  const [worldcoin, setWorldCoin] = useState<any>(null);
  const [worldVerified, setWorldVerified] = useState<boolean>(false);
  const [fName, setFName] = useState("");
  const [fId, setFId] = useState<number | null>(1); // TODO: Change from null
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [signTxStatus, setSignTxStatus] = useState(0);
  const [sendTxStatus, setSendTxStatus] = useState(0);
  const { switchChainAsync } = useSwitchChain();
  const [transaction, setTransaction] = useState<Transaction>({
    account: "0x",
    data: "0x",
    gas: BigInt(0),
    to: "0x",
    value: BigInt(0),
  });
  useEffect(() => {
    console.log(address);
    if (address != undefined) {
      console.log("Fetching polls");
      (async function () {
        const { response: res } = await getPoll({ pollId });
        console.log(res);
        if (res != null) {
          setPoll({
            question: res.question,
            options: [res.option_a, res.option_b, res.option_c, res.option_d],
            duration: res.duration,
            theme: res.theme,
          });
          setProofOfHumanity(res.is_anon);
          updateCountdown(new Date(10000000000 * 1000));
        }
      })();
    }
  }, [address]);
  const updateCountdown = (targetTimestamp: Date) => {
    const remainingTime = calculateTimeLeft(targetTimestamp);
    console.log(remainingTime);
    if (remainingTime.total <= 0) {
      setPollEnded(true);
      setTimeLeft(null);
    } else {
      setPollEnded(false);
      setTimeLeft(remainingTime);
    }
  };

  return (
    <div className="px-3 h-screen">
      <div className="w-full bg-[#FBF6FF] text-[#450C63] h-full">
        <div className="flex flex-col h-full justify-start items-center w-full pt-6 px-10">
          <TopBar
            setFName={setFName}
            fName={fName}
            setFid={setFId}
            isComposer={false}
          />
          {poll.question != "" && (
            <div className="flex-1 flex flex-col justify-center space-y-2">
              {" "}
              <p className="text-[#450C63] font-bold text-5xl py-12">
                {poll.question}
              </p>
              <div className="grid grid-cols-2 gap-4 w-full ">
                <div className="flex-1 ">
                  <SelectableButton
                    isSelected={selectedOption === 0}
                    disabled={pollEnded || fId == null}
                    text={poll.options[0]}
                    click={() => {
                      if (selectedOption !== 0) setSelectedOption(0);
                      else setSelectedOption(4);
                    }}
                  />
                </div>

                <div className="flex-1">
                  <SelectableButton
                    isSelected={selectedOption === 1}
                    disabled={pollEnded || fId == null}
                    text={poll.options[1]}
                    click={() => {
                      if (selectedOption !== 1) setSelectedOption(1);
                      else setSelectedOption(4);
                    }}
                  />
                </div>
                <div className="flex-1">
                  <SelectableButton
                    isSelected={selectedOption === 2}
                    disabled={pollEnded || fId == null}
                    text={poll.options[2]}
                    click={() => {
                      if (selectedOption !== 2) setSelectedOption(2);
                      else setSelectedOption(4);
                    }}
                  />
                </div>

                <div className="flex-1">
                  <SelectableButton
                    isSelected={selectedOption === 3}
                    disabled={pollEnded || fId == null}
                    text={poll.options[3]}
                    click={() => {
                      if (selectedOption !== 3) setSelectedOption(3);
                      else setSelectedOption(4);
                    }}
                  />
                </div>
              </div>
              {pollEnded ? (
                <div className="text-center py-6">
                  <p className="text-lg font-bold">Poll has ended.</p>
                  <div className="pt-4 w-[40%] mx-auto">
                    <HoverButton
                      text="View Results"
                      disabled={false}
                      click={() => {
                        setViewResults(true);
                      }}
                    />
                  </div>
                </div>
              ) : (
                <div className="text-center py-6">
                  <p className="text-lg font-bold">POLL ENDS IN ⏳</p>
                  <div className="flex space-x-2 text-md justify-center fomt-semibold">
                    {timeLeft && timeLeft.days > 0 && (
                      <span>{timeLeft.days} days :</span>
                    )}
                    {timeLeft && timeLeft.hours > 0 && (
                      <span>{timeLeft.hours} hours :</span>
                    )}
                    {timeLeft && timeLeft.minutes > 0 && (
                      <span>{timeLeft.minutes} mins :</span>
                    )}
                    {timeLeft && timeLeft.seconds > 0 && (
                      <span>{timeLeft.seconds} secs</span>
                    )}
                  </div>
                  {fId == null ? (
                    <>
                      {" "}
                      <p className="text-center text-xl pt-12 font-bold">
                        NO FARCASTER PROFILE DETECTED 🔎
                      </p>{" "}
                      <p className="text-center text-sm w-[60%] mx-auto">
                        Switch your wallet to an address that is connected to
                        your Farcaster profile.
                      </p>
                    </>
                  ) : (
                    <div className="flex justify-between pt-12">
                      <div className="flex-1">
                        <p className="text-lg font-bold">PROOF OF HUMANITY</p>
                        <p className="text-center font-semibold text-xs w-[80%] pb-4 mx-auto">
                          Prove your huamnity using World ID 🤖
                        </p>
                        <div className="flex justify-center">
                          <HoverButton
                            text={worldVerified ? "Verified ✅" : "Verify 🤖"}
                            disabled={!worldVerified}
                            click={() => {}}
                          />
                        </div>
                      </div>
                      <div className="flex-1">
                        <p className="text-lg font-bold">CONFIRMATION</p>
                        <div className="flex flex-col space-y-4 pt-2 items-center justify-center pb-4">
                          <div className="flex items-center space-x-2">
                            <SelectableButton
                              text={
                                signTxStatus == 0
                                  ? "✏️ Sign Message"
                                  : signTxStatus == 1
                                  ? "⌛ Tx Pending"
                                  : "✅ Signed Data"
                              }
                              isSelected={false}
                              click={async () => {
                                setSignTxStatus(1);

                                const {
                                  ciphertext,
                                  nonce,
                                  payloadHash,
                                  signData,
                                  userPublicKeyBytes,
                                } = await getCastVoteSignData({
                                  callerAddress: address as `0x${string}`,
                                  pollId: parseInt(pollId),
                                  vote: selectedOption as number,
                                  fId: fId as number,
                                });
                                // const params = [
                                //   address as `0x${string}`,
                                //   signData,
                                // ];
                                // const client = createWalletClient({
                                //   account: address as `0x${string}`,
                                //   chain: baseSepolia,
                                //   transport: custom(window.ethereum),
                                // });

                                // const payloadSignature = await client.signMessage(
                                //   {
                                //     message: concat(params),
                                //   }
                                // );
                                // const user_pubkey = await recoverPublicKey({
                                //   hash: payloadHash,
                                //   signature: payloadSignature,
                                // });
                                // console.log(user_pubkey);
                                // const { gas, to, from, value, data } =
                                //   await createPoll({
                                //     nonce,
                                //     payloadHash,
                                //     ciphertext,
                                //     signature: signData,
                                //     userAddress: address as `0x${string}`,
                                //     userPublicKey: user_pubkey,
                                //     userPublicKeyBytes,
                                //   });
                                // console.log({ gas, to, from, value, data });

                                // setTransaction({
                                //   to,
                                //   account: address as `0x${string}`,
                                //   value: hexToBigInt(value),
                                //   data,
                                //   gas: hexToBigInt(gas),
                                // });
                                // setSignTxStatus(2);
                              }}
                              disabled={signTxStatus != 0}
                            />
                          </div>
                          <div className="flex items-center space-x-2">
                            <SelectableButton
                              text={
                                sendTxStatus == 0
                                  ? "🖼️ Create Poll"
                                  : sendTxStatus == 1
                                  ? "⌛ Tx Pending"
                                  : "✅ Created Poll"
                              }
                              isSelected={false}
                              click={async () => {
                                setSendTxStatus(1);
                                if (chainId != baseSepolia.id)
                                  await switchChainAsync({
                                    chainId: baseSepolia.id,
                                  });
                                // const txHash = await sendTransaction(config, {
                                //   ...transaction,
                                // });
                                // setSendTxHash(txHash);
                                // await updateSupabase();

                                // setStep(3);
                              }}
                              disabled={signTxStatus != 2 || sendTxStatus != 0}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
              <div className="flex justify-between space-x-8 pt-12"></div>
              <div className="flex justify-between space-x-8 mt-4"></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
