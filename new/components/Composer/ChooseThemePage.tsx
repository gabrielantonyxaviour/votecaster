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
import { useAccount, useSwitchChain } from "wagmi";
import createPollSupabase from "@/utils/supabase/createPoll";
import createPoll from "@/utils/write/createPoll";
import {
  concat,
  createWalletClient,
  custom,
  hexToBigInt,
  recoverPublicKey,
} from "viem";
import { baseSepolia } from "viem/chains";
import { sendTransaction } from "@wagmi/core";

interface Transaction {
  gas: bigint;
  to: `0x${string}`;
  account: `0x${string}`;
  value: bigint;
  data: `0x${string}`;
}

export default function ChooseThemePage({
  poll,
  setStep,
  setProofOfHumanity,
  setPollId,
}: {
  poll: Poll;
  setStep: (step: number) => void;
  setProofOfHumanity: (value: boolean) => void;
  setPollId: (pollId: string) => void;
}) {
  const [worldcoinEnable, setWorldcoinEnable] = useState(false);
  const [signTxStatus, setSignTxStatus] = useState(0);
  const [sendTxStatus, setSendTxStatus] = useState(0);
  const [sendTxHash, setSendTxHash] = useState("");
  const { address, chainId } = useAccount();
  const { switchChainAsync } = useSwitchChain();
  const [transaction, setTransaction] = useState<Transaction>({
    account: "0x",
    data: "0x",
    gas: BigInt(0),
    to: "0x",
    value: BigInt(0),
  });
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
                  setSignTxStatus(1);

                  const {
                    ciphertext,
                    nonce,
                    payloadHash,
                    signData,
                    userPublicKeyBytes,
                  } = await getCreatePollSignData({
                    callerAddress: address as `0x${string}`,
                    poll: poll,
                    validity: poll.duration,
                  });
                  const params = [address as `0x${string}`, signData];
                  const client = createWalletClient({
                    account: address as `0x${string}`,
                    chain: baseSepolia,
                    transport: custom(window.ethereum),
                  });

                  const payloadSignature = await client.signMessage({
                    message: concat(params),
                  });
                  const user_pubkey = await recoverPublicKey({
                    hash: payloadHash,
                    signature: payloadSignature,
                  });
                  console.log(user_pubkey);
                  const { gas, to, from, value, data } = await createPoll({
                    nonce,
                    payloadHash,
                    ciphertext,
                    signature: signData,
                    userAddress: address as `0x${string}`,
                    userPublicKey: user_pubkey,
                    userPublicKeyBytes,
                  });
                  console.log({ gas, to, from, value, data });

                  setTransaction({
                    to,
                    account: address as `0x${string}`,
                    value: hexToBigInt(value),
                    data,
                    gas: hexToBigInt(gas),
                  });
                  setSignTxStatus(2);
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
                  const txHash = await sendTransaction(config, {
                    ...transaction,
                  });
                  setSendTxHash(txHash);
                  // TODO: Create poll in the backend and set the poll id
                  setStep(3);
                }}
                disabled={signTxStatus != 2 || sendTxStatus != 0}
              />
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
