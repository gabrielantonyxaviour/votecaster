import React, { useEffect } from "react";
import SelectableButton from "../SelectableButton";

export default function Confirmation({
  sign,
  post,
  isEnabled,
  isSigned,
  isPosted,
  hasProfile,
}: {
  sign: () => void;
  post: () => void;
  isEnabled: boolean;
  isSigned: boolean;
  isPosted: boolean;
  hasProfile: boolean;
}) {
  return (
    <div className="h-[33%] w-full bg-[#FBF6FF] rounded-xl px-20 py-8">
      <p className="text-center font-bold text-[#450C63] text-2xl">
        CONFIRMATION
      </p>
      {!hasProfile && (
        <p className="font-semibold text-[#450C63] text-md text-center px-4 pt-4">
          Connected Wallet does not have a farcaster account
        </p>
      )}

      <div className="w-[60%] mx-auto pt-6">
        <SelectableButton
          text="📝 Post your poll"
          isSelected={false}
          disabled={!isEnabled}
          click={sign}
        />
      </div>
    </div>
  );
}
