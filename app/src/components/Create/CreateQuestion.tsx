import React, { useCallback, useState } from "react";
import InputButton from "../InputButton";
import { useAccount } from "wagmi";
import DurationDropdown from "../DurationDropdown";

export default function CreateQuestion({
  poll,
  setPoll,
}: {
  poll: { question: string; options: string[]; duration: number };
  setPoll: React.Dispatch<
    React.SetStateAction<{
      question: string;
      options: string[];
      duration: number;
    }>
  >;
}) {
  const timeframe = ["minutes", "hours", "days", "months"];
  const values = [60, 3600, 86400, 2592000];
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [durationInput, setDurationInput] = useState("");
  return (
    <div className="py-3  h-full w-[60%]">
      <div className=" h-full bg-[#FDE2C4] rounded-xl py-12 px-12">
        <textarea
          className="w-[90%] h-[45%] text-5xl font-bold placeholder:text-[#D87070] text-[#BF080A] bg-transparent border-none focus:outline-none resize-none leading-tight"
          placeholder="ENTER YOUR QUESTION EX. WHICH TEAM IS WINNING LA LIGA?"
          onChange={(e) => {
            setPoll({ ...poll, question: e.target.value.toUpperCase() });
          }}
          value={poll.question}
        ></textarea>
        <div className="flex justify-between space-x-8 pt-4">
          <div className="flex-1">
            <InputButton
              value={poll.options[0]}
              onChange={(change: string) => {
                setPoll({
                  ...poll,
                  options: [
                    change,
                    poll.options[1],
                    poll.options[2],
                    poll.options[3],
                  ],
                });
              }}
            />
          </div>

          <div className="flex-1">
            <InputButton
              value={poll.options[1]}
              onChange={(change: string) => {
                setPoll({
                  ...poll,
                  options: [
                    poll.options[0],
                    change,
                    poll.options[2],
                    poll.options[3],
                  ],
                });
              }}
            />
          </div>
        </div>
        <div className="flex justify-between space-x-8 pt-6">
          <div className="flex-1">
            {
              <InputButton
                value={poll.options[2]}
                onChange={(change: string) => {
                  setPoll({
                    ...poll,
                    options: [
                      poll.options[0],
                      poll.options[1],
                      change,
                      poll.options[3],
                    ],
                  });
                }}
              />
            }
          </div>

          <div className="flex-1">
            <InputButton
              value={poll.options[3]}
              onChange={(change: string) => {
                setPoll({
                  ...poll,
                  options: [
                    poll.options[0],
                    poll.options[1],
                    poll.options[2],
                    change,
                  ],
                });
              }}
            />
          </div>
        </div>
        <p className="pt-8 pb-4 font-bold text-[#BF080A] text-2xl">Duration</p>
        <div className="flex w-full space-x-4">
          <div className="bg-[#630C0C] rounded-sm">
            <div className="bg-white -translate-y-1 -translate-x-1 rounded-sm border-2 border-[#4A0C63]">
              <input
                value={durationInput}
                onChange={(e) => {
                  const textInput = e.target.value;
                  const filteredValue = textInput.replace(/[^0-9]/g, "");
                  setDurationInput(filteredValue);
                  setPoll({
                    ...poll,
                    duration: parseInt(filteredValue) * values[selectedIndex],
                  });
                }}
                className="text-[#BF0808] text-md font-semibold mx-4 my-2 bg-transparent border-none focus:outline-none w-full"
              />
            </div>
          </div>
          <DurationDropdown
            selectedOption={timeframe[selectedIndex]}
            options={timeframe}
            setOption={(option: string) => {
              if (option === "minutes") setSelectedIndex(0);
              if (option === "hours") setSelectedIndex(1);
              if (option === "days") setSelectedIndex(2);
              if (option === "months") setSelectedIndex(3);
            }}
          />
        </div>

        <div className="flex justify-center "></div>
      </div>
    </div>
  );
}
