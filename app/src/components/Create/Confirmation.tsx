import React from "react";
import SelectableButton from "../SelectableButton";

export default function Confirmation({
  sign,
  post,
  isEnabled,
  isSigned,
  isPosted,
}: {
  sign: () => void;
  post: () => void;
  isEnabled: boolean;
  isSigned: boolean;
  isPosted: boolean;
}) {
  return (
    <div className="h-[33%] w-full bg-[#FBF6FF] rounded-xl px-20 py-8">
      <p className="text-center font-bold text-[#450C63] text-2xl">
        CONFIRMATION
      </p>
      <div className="w-[60%] mx-auto py-4">
        <SelectableButton
          text="✍️ Sign Approval"
          isSelected={isSigned}
          disabled={!isEnabled}
          click={sign}
        />
      </div>
      <div className="w-[60%] mx-auto">
        <SelectableButton
          text="📝 Post your poll"
          isSelected={isPosted}
          disabled={!isSigned}
          click={sign}
        />
      </div>
    </div>
  );
}
