import React from "react";
import SelectableButton from "../SelectableButton";

export default function ChooseFeatures({
  isSybil,
  setIsSybil,
}: {
  isSybil: boolean;
  setIsSybil: (value: boolean) => void;
}) {
  return (
    <div className="h-[65%] w-full bg-[#FDE2C4] rounded-xl px-20 pt-12 pb-6">
      <p className="text-center font-bold text-[#BF080A] text-2xl">
        CHOOSE FEATURES
      </p>
      <div className="mx-auto">
        <div className="w-[60%] mx-auto pt-10">
          <SelectableButton
            isSelected={true}
            disabled={false}
            text="✅ Private voting"
            click={() => {}}
          />
        </div>
        <p className="text-[#BF080A] text-sm text-center pt-2">
          Voters generate a proof to vote without revealing their identity with
          100% intractability.
        </p>
        <div className="w-[60%] mx-auto pt-6">
          <SelectableButton
            isSelected={isSybil}
            disabled={false}
            text={(isSybil ? "✅ " : "❌ ") + "Sybil Resistant"}
            click={() => setIsSybil(!isSybil)}
          />
        </div>
        <p className="text-[#BF080A] text-sm text-center pt-2">
          Voters should prove their AADHAR identity by producing a proof which
          will be verified before a vote is cast.
        </p>
      </div>
    </div>
  );
}
