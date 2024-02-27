"use client";
import React from "react";
export default function SelectableButton({
  text,
  isSelected,
  disabled,
  click,
}: {
  text: string;
  isSelected: boolean;
  disabled: boolean;
  click: () => void;
}) {
  return (
    <div
      className={`${
        disabled ? "bg-[#828282]" : "bg-[#630C0C]"
      } rounded-sm text-center`}
    >
      <div
        className={`${
          disabled
            ? "bg-[#545454] text-white"
            : isSelected
            ? "bg-white text-[#BF080A]"
            : "bg-[#BF0808] text-white"
        } -translate-y-1 -translate-x-1 rounded-sm border-2 ${
          disabled ? "border-[#545454]" : "border-[#4A0C63]"
        } cursor-pointer`}
        onClick={() => {
          console.log("clicked");
          click();
        }}
      >
        <p className=" text-sm font-semibold mx-4 my-2">{text}</p>
      </div>
    </div>
  );
}
