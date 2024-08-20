import { Poll } from "@/utils/types";
import PollPreview from "./PollPreview";
import SelectableButton from "../SelectableButton";
import HoverButton from "../HoverButton";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUpRightFromSquare } from "@fortawesome/free-solid-svg-icons";
import { simulateContract, writeContract } from "@wagmi/core";
import { config } from "@/utils/constants";
import getCreatePollSignData from "@/utils/write/helpers/getCreatePollSignData";
import { useAccount } from "wagmi";

export default function ChooseThemePage({
  poll,
  setStep,
  setProofOfHumanity,
}: {
  poll: Poll;
  setStep: (step: number) => void;
  setProofOfHumanity: (value: boolean) => void;
}) {
  const [worldcoinEnable, setWorldcoinEnable] = useState(false);
  const [signTxStatus, setSignTxStatus] = useState(0);
  const [sendTxStatus, setSendTxStatus] = useState(0);
  const [signTxHash, setSignTxHash] = useState("");
  const [sendTxHash, setSendTxHash] = useState("");
  const { address } = useAccount();
  return (
    <div className="h-full w-full flex flex-col justify-center ">
      <p className="text-center font-bold text-md ">POLL PREVIEW</p>
      <p className="text-center font-semibold text-xs  pb-4">
        Change theme of your poll according to your taste 😋
      </p>
      <div className="flex items-center pb-6">
        <div className="mx-auto ">
          <HoverButton text="👈" disabled={false} click={() => {}} />
        </div>

        <div className="w-[65%] h-[200px] relative border-2 border-[#450C63] mx-auto rounded-lg"></div>
        <div className="mx-auto">
          <HoverButton text="👉" disabled={false} click={() => {}} />
        </div>
      </div>
      <div className="grid grid-cols-2 px-4">
        <div>
          <p className="text-center font-semibold text-md ">
            PROOF OF HUMANITY
          </p>
          <p className="text-center font-semibold text-xs  pb-4">
            Verifies World ID on-chain on casting a vote 🤖
          </p>
          <div className="flex justify-center pb-4">
            <SelectableButton
              text={worldcoinEnable ? "✅ Enabled" : "❌ Disabled"}
              isSelected={worldcoinEnable}
              click={() => {
                setWorldcoinEnable(!worldcoinEnable);
                setProofOfHumanity(!worldcoinEnable);
              }}
              disabled={false}
            />
          </div>
        </div>
        <div>
          <p className="text-center font-semibold text-md pb-2">CONFIRMATION</p>
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
                  // setSignTxStatus(1);
                  const signData = await getCreatePollSignData({
                    callerAddress: address as `0x${string}`,
                    poll: poll,
                    validity: poll.duration,
                  });
                  console.log("SIGN DATA");
                  console.log(signData);
                  // TODO: Send transactoin
                  // const { request } = await simulateContract(config, {
                  //   abi:[],
                  //   address: '0x6b175474e89094c44da98b954eedeac495271d0f',
                  //   functionName: 'transferFrom',
                  //   args: [
                  //     '0xd2135CfB216b74109775236E36d4b433F1DF507B',
                  //     '0xA0Cf798816D4b9b9866b5330EEa46a18382f251e',
                  //     123n,
                  //   ],
                  // })
                  // const hash = await writeContract(config, request)
                }}
                disabled={signTxStatus != 0}
              />
              {signTxHash != "" && (
                <FontAwesomeIcon
                  icon={faArrowUpRightFromSquare}
                  onClick={() => {
                    // TODO: Redirect to transaction Hash
                  }}
                  className="cursor-pointer"
                />
              )}
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
                click={() => {
                  setSendTxStatus(1);
                  // TODO: Send Transaction
                }}
                disabled={signTxStatus != 2 || sendTxStatus != 0}
              />
              {sendTxHash != "" && (
                <FontAwesomeIcon
                  icon={faArrowUpRightFromSquare}
                  onClick={() => {
                    // TODO: Redirect to transaction Hash
                  }}
                  className="cursor-pointer"
                />
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="mx-auto pt-4">
        <SelectableButton
          text="Go Back"
          isSelected={false}
          click={() => {
            setStep(1);
          }}
          disabled={false}
        />
      </div>
    </div>
  );
}
