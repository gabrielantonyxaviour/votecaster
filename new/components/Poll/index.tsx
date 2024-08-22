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
import {
  concat,
  createWalletClient,
  custom,
  decodeAbiParameters,
  hexToBigInt,
  recoverPublicKey,
} from "viem";
import { baseSepolia } from "viem/chains";
import { sendTransaction } from "@wagmi/core";
import { config } from "@/utils/constants";
import vote from "@/utils/supabase/vote";
import getVoted from "@/utils/supabase/getVoted";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUpRightFromSquare } from "@fortawesome/free-solid-svg-icons";
import getSecretPathData from "@/utils/write/helpers/getSecretPathData";

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
  const [sendTxHash, setSendTxHash] = useState("");
  const [proofOfHumanity, setProofOfHumanity] = useState<boolean>(false);
  const [worldcoin, setWorldCoin] = useState<any>(null);
  const [worldVerified, setWorldVerified] = useState<boolean>(false);
  const [fName, setFName] = useState("");
  const [fId, setFId] = useState<number | null>(3); // TODO: Change from null
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [signTxStatus, setSignTxStatus] = useState(0);
  const [sendTxStatus, setSendTxStatus] = useState(0);
  const [userVote, setUserVote] = useState<number>(-1);
  const { switchChainAsync } = useSwitchChain();
  const [transaction, setTransaction] = useState<Transaction>({
    from: "0x",
    data: "0x",
    gas: "0x",
    to: "0x",
    value: "0x",
  });
  const [voteResults, setVoteResults] = useState<number[]>([2, 8, 9, 12]);
  const [highestIndex, setHighestIndex] = useState<number>(
    voteResults.reduce((maxIndex, currentValue, currentIndex, array) => {
      return currentValue > array[maxIndex] ? currentIndex : maxIndex;
    }, 0)
  );
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
            duration: res.validity,
            theme: res.theme,
          });
          setProofOfHumanity(res.is_anon);
          console.log("DURATION");
          console.log(res.validity);
          console.log(Date.now());
          updateCountdown(new Date(res.validity));
        }
      })();
    }
  }, [address]);

  useEffect(() => {
    (async function () {
      if (proofOfHumanity) {
        if (worldcoin != null) {
          const { response: resVoted } = await getVoted({
            pollId,
            nullifier: worldcoin.nullifier_hash || Math.random(),
            fid: fId?.toString() || "1",
          });
          if (resVoted != null) {
            setUserVote(resVoted.vote);
            setSendTxHash(resVoted.tx);
          }
        }
      } else if (fId != null) {
        const { response: resVoted } = await getVoted({
          pollId,
          nullifier: Math.random().toString(),
          fid: fId.toString() || "1",
        });
        if (resVoted != null) {
          setUserVote(resVoted.vote);
          setSendTxHash(resVoted.tx);
        }
      }
    })();
  }, [worldcoin]);
  const unpack = (proof: `0x${string}`) => {
    return decodeAbiParameters([{ type: "uint256[8]" }], proof)[0];
  };
  const updateCountdown = (targetDate: Date) => {
    const interval = setInterval(() => {
      const remaining = calculateTimeLeft(targetDate);

      if (remaining.total <= 0) {
        clearInterval(interval);
        setPollEnded(true);
        setTimeLeft(null);
      } else {
        setPollEnded(false);
        setTimeLeft(remaining);
      }
    }, 1000);
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
                {poll.options.map((option, index) => (
                  <div key={index} className="flex-1">
                    <SelectableButton
                      isSelected={
                        selectedOption === index ||
                        (pollEnded && highestIndex == index) ||
                        (!pollEnded && userVote == index)
                      }
                      text={`${option} ${
                        pollEnded ? "( " + voteResults[index] + " Votes )" : ""
                      }`}
                      disabled={fId == null}
                      click={() => {
                        if (pollEnded) return;
                        if (userVote != -1) return;
                        if (selectedOption !== index) setSelectedOption(index);
                      }}
                    />
                  </div>
                ))}
              </div>
              {pollEnded ? (
                <div className="text-center py-6">
                  <p className="text-lg font-bold pt-4">POLL HAS ENDED</p>
                  {userVote != -1 ? (
                    <div className="flex flex-col pt-6 space-y-2">
                      <div className="flex justify-center space-x-2 items-center">
                        <p className="text-sm font-bold  text-center">
                          Your vote
                        </p>
                        <FontAwesomeIcon
                          icon={faArrowUpRightFromSquare}
                          onClick={() => {
                            window.open(
                              "https://sepolia.basescan.org/tx/" + sendTxHash,
                              "_blank",
                              "noopener,noreferrer"
                            );
                          }}
                          height={13}
                          width={13}
                          className="cursor-pointer"
                        />
                      </div>
                      <div className="flex justify-center items-center space-x-2">
                        <SelectableButton
                          isSelected={
                            selectedOption === userVote ||
                            (pollEnded && highestIndex == userVote)
                          }
                          text={`${poll.options[userVote]} ${
                            pollEnded
                              ? "( " + voteResults[userVote] + " Votes )"
                              : ""
                          }`}
                          disabled={fId == null}
                          click={() => {
                            window.open(
                              "https://sepolia.basescan.org/tx/" + sendTxHash,
                              "_blank",
                              "noopener,noreferrer"
                            );
                          }}
                        />
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm pt-4">
                      You did not vote on this poll ❌
                    </p>
                  )}
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
                      <p className="text-center text-xl pt-12 font-bold">
                        NO FARCASTER PROFILE DETECTED 🔎
                      </p>
                      <p className="text-center text-sm w-[60%] mx-auto">
                        Switch your wallet to an address that is connected to
                        your Farcaster profile.
                      </p>
                    </>
                  ) : userVote == -1 ? (
                    <div className="flex justify-between pt-12">
                      {proofOfHumanity && (
                        <div className="flex-1">
                          <p className="text-lg font-bold">PROOF OF HUMANITY</p>
                          <p className="text-center font-semibold text-xs w-[80%] pb-4 mx-auto">
                            Prove your huamnity using World ID
                          </p>
                          <div className="flex justify-center">
                            {worldVerified && (
                              <HoverButton
                                text={"Verified ✅"}
                                disabled={true}
                                click={() => {}}
                              />
                            )}
                            {address != undefined && !worldVerified && (
                              <IDKitWidget
                                app_id={
                                  (process.env
                                    .NEXT_PUBLIC_WORLDCOIN_APP_ID as `app_${string}`) ||
                                  "app_"
                                }
                                action="unique-human-airdrop"
                                onSuccess={(result: ISuccessResult) => {
                                  const bigNumProofs = unpack(
                                    (result as any).proof
                                  );
                                  setWorldCoin({
                                    ...result,
                                    proofs: bigNumProofs,
                                  });
                                  console.log("Success");
                                  console.log(result);
                                  setWorldVerified(true);
                                }}
                                onError={(error: any) => {
                                  console.log(error);
                                }}
                                signal={address as `0x${string}`}
                                verification_level={VerificationLevel.Orb}
                              >
                                {({ open }: any) => (
                                  <HoverButton
                                    text={"Verify 🤖"}
                                    disabled={selectedOption == null}
                                    click={open}
                                  />
                                )}
                              </IDKitWidget>
                            )}
                          </div>
                        </div>
                      )}
                      <div className="flex-1">
                        <p className="text-lg font-bold">CONFIRMATION</p>
                        <div className="flex flex-col space-y-4 pt-2 items-center justify-center pb-4">
                          <div className="flex items-center space-x-2">
                            <SelectableButton
                              text={
                                signTxStatus == 0
                                  ? "✏️ Sign Message"
                                  : signTxStatus == 1
                                  ? "🔏 Encrypting Vote"
                                  : signTxStatus == 2
                                  ? "⌛ Waiting"
                                  : "✅ Vote Encrypted"
                              }
                              isSelected={false}
                              click={async () => {
                                setSignTxStatus(1);
                                const input = {
                                  farcaster_id: fId,
                                  poll_id: pollId,
                                  vote,
                                };

                                const { gas, to, from, value, data } =
                                  await getSecretPathData({
                                    callerAddress: address as `0x${string}`,
                                    functionName: "vote",
                                    input,
                                    setSignTxStatus,
                                  });
                                console.log({ gas, to, from, value, data });

                                setTransaction({ gas, to, from, value, data });
                                setSignTxStatus(3);
                              }}
                              disabled={
                                signTxStatus != 0 ||
                                (proofOfHumanity && !worldVerified) ||
                                selectedOption == null
                              }
                            />
                          </div>
                          <div className="flex items-center space-x-2">
                            <SelectableButton
                              text={
                                sendTxStatus == 0
                                  ? "🖼️ Cast Vote"
                                  : sendTxStatus == 1
                                  ? "⌛ Tx Pending"
                                  : "✅ Vote Casted"
                              }
                              isSelected={false}
                              click={async () => {
                                setSendTxStatus(1);
                                if (chainId != baseSepolia.id)
                                  await switchChainAsync({
                                    chainId: baseSepolia.id,
                                  });
                                const txHash = await sendTransaction(config, {
                                  ...transaction,
                                });
                                setSendTxHash(txHash);
                                console.log({
                                  pollId,
                                  nullifier:
                                    worldcoin != null
                                      ? worldcoin.nullifier_hash
                                      : 123,
                                  vote: selectedOption || 0,
                                  isAnon: proofOfHumanity,
                                  tx: txHash,
                                  fid: fId.toString(),
                                });
                                const { message, response } = await vote({
                                  pollId,
                                  nullifier:
                                    worldcoin != null
                                      ? worldcoin.nullifier_hash
                                      : 123,
                                  vote: selectedOption || 0,
                                  isAnon: proofOfHumanity,
                                  tx: txHash,
                                  fid: fId.toString(),
                                });
                                console.log(response);
                                setSendTxStatus(2);
                              }}
                              disabled={signTxStatus != 3 || sendTxStatus != 0}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col pt-6 space-y-2">
                      <div className="flex justify-center space-x-2 items-center">
                        <p className="text-sm font-bold  text-center">
                          Your vote
                        </p>
                        <FontAwesomeIcon
                          icon={faArrowUpRightFromSquare}
                          onClick={() => {
                            window.open(
                              "https://sepolia.basescan.org/tx/" + sendTxHash,
                              "_blank",
                              "noopener,noreferrer"
                            );
                          }}
                          height={13}
                          width={13}
                          className="cursor-pointer"
                        />
                      </div>
                      <div className="flex justify-center items-center space-x-2">
                        <SelectableButton
                          isSelected={
                            selectedOption === userVote ||
                            (pollEnded && highestIndex == userVote)
                          }
                          text={`${poll.options[userVote]} ${
                            pollEnded
                              ? "( " + voteResults[userVote] + " Votes )"
                              : ""
                          }`}
                          disabled={fId == null}
                          click={() => {
                            window.open(
                              "https://sepolia.basescan.org/tx/" + sendTxHash,
                              "_blank",
                              "noopener,noreferrer"
                            );
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
