"use client";
import React from "react";
export default function InputButton({
  onChange,
  value,
}: {
  value: string;
  onChange: (e: string) => void;
}) {
  return (
    <div className="bg-[#630C0C] rounded-sm">
      <div className="bg-[#BF0808] -translate-y-1 -translate-x-1 rounded-sm border-2 border-[#4A0C63]">
        <input
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
          }}
          className="text-white text-md font-semibold mx-4 my-2 bg-transparent border-none focus:outline-none w-full"
        />
      </div>
    </div>
  );
}
