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
    <div className="bg-[#4A0C63] rounded-sm" onClick={click}>
      <div
        className="bg-[#8A08BF] -translate-y-1 -translate-x-1 rounded-sm border-2 border-[#4A0C63] cursor-pointer"
        onClick={() => {
          console.log("clicked");
          click();
        }}
      >
        <p className="text-white text-sm font-semibold mx-4 my-2">{text}</p>
      </div>
    </div>
  );
}
