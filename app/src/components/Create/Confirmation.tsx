import React, { useEffect } from "react";
import SelectableButton from "../SelectableButton";
import { faL } from "@fortawesome/free-solid-svg-icons";

export default function Confirmation({
  post,
  isEnabled,
  hasProfile,
  txHash,
  ipfsHash,
  status,
}: {
  post: () => void;
  isEnabled: boolean;
  isSigned: boolean;
  isPosted: boolean;
  hasProfile: boolean;
  status: string;
  txHash: string;
  ipfsHash: string;
}) {
  return (
    <div className="h-[50%] w-full  bg-[#FDE2C4] rounded-xl px-20 flex flex-col justify-center">
      <p className="text-center font-bold text-[#BF080A] text-2xl">
        CONFIRMATION
      </p>
      {!hasProfile && (
        <p className="font-semibold text-[#BF080A] text-md text-center px-4 pt-4">
          Connected Wallet does not have a farcaster account
        </p>
      )}
      {(status == "Uploading to IPFS..." ||
        status == "Initiating transaction...") && (
        <p className="font-semibold text-[#BF080A] text-md text-center px-4 pt-4">
          {status}
        </p>
      )}
      {ipfsHash == "" && (
        <div className="w-[60%] mx-auto pt-6">
          <SelectableButton
            text="📝 Post your poll"
            isSelected={false}
            disabled={!isEnabled}
            click={post}
          />
        </div>
      )}
      <div className="text-[#BF080A] text-sm font-normal text-center mt-4">
        {ipfsHash != "" && (
          <>
            <p className="font-semibold text-md">Uploaded to IPFS</p>
            <a href={ipfsHash} target="_blank">
              {ipfsHash.substring(0, 20) +
                "..." +
                ipfsHash.substring(ipfsHash.length - 20, ipfsHash.length)}
            </a>
          </>
        )}
        {txHash != "" && (
          <>
            <p className="font-semibold text-md mt-2">{status}</p>
            <a href={txHash} target="_blank">
              {txHash.substring(0, 20) +
                "..." +
                txHash.substring(txHash.length - 20, txHash.length)}
            </a>
          </>
        )}
      </div>
    </div>
  );
}
