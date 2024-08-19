import { Poll } from "@/utils/types";
import PollPreview from "./PollPreview";
import SelectableButton from "../SelectableButton";
import HoverButton from "../HoverButton";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUpRightFromSquare } from "@fortawesome/free-solid-svg-icons";

export default function ChooseThemePage({ poll }: { poll: Poll }) {
  const [worldcoinEnable, setWorldcoinEnable] = useState(false);
  const [signTxStatus, setSignTxStatus] = useState(0);
  const [sendTxStatus, setSendTxStatus] = useState(0);
  const [signTxHash, setSignTxHash] = useState("");
  const [sendTxHash, setSendTxHash] = useState("");
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
      <div className="grid grid-cols-2">
        <div>
          {" "}
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
              }}
              disabled={false}
            />
          </div>
        </div>
        <p>
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
                click={() => {
                  setSignTxStatus(1);
                }}
                disabled={signTxStatus != 0}
              />
              {signTxHash != "" && (
                <FontAwesomeIcon
                  icon={faArrowUpRightFromSquare}
                  onClick={() => {
                    // TODO: Send Transaction
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
                }}
                disabled={signTxStatus != 2 || sendTxStatus != 0}
              />
              {sendTxHash != "" && (
                <FontAwesomeIcon
                  icon={faArrowUpRightFromSquare}
                  onClick={() => {
                    // TODO: Send Transaction
                  }}
                  className="cursor-pointer"
                />
              )}
            </div>
          </div>
        </p>
      </div>
    </div>
  );
}
