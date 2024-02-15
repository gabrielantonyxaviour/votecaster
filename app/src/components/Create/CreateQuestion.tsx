import React, { useCallback, useState } from "react";
import InputButton from "../InputButton";
import { useAccount } from "wagmi";
import DurationDropdown from "../DurationDropdown";

export default function CreateQuestion({
  poll,
  setPoll,
}: {
  poll: { question: string; options: string[] };
  setPoll: React.Dispatch<
    React.SetStateAction<{ question: string; options: string[] }>
  >;
}) {
  const { address } = useAccount();
  const options = ["minutes", "hours", "days", "months"];
  const [selectedOption, setSelectedOption] = useState(options[0]);
  const [durationInput, setDurationInput] = useState("");
  const [calculatedDuration, setCalculatedDuration] = useState(0);
  return (
    <div className="py-3  h-full w-[60%]">
      <div className=" h-full bg-[#FBF6FF] rounded-xl py-12 px-12">
        <textarea
          className="w-[90%] h-[45%] text-5xl font-bold placeholder:text-[#DCAFFF] text-[#450C63] bg-transparent border-none focus:outline-none resize-none leading-tight"
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
        <p className="pt-8 pb-4 font-bold text-[#450C63] text-2xl">Duration</p>
        <div className="flex w-full space-x-4">
          <div className="bg-[#4A0C63] rounded-sm">
            <div className="bg-white -translate-y-1 -translate-x-1 rounded-sm border-2 border-[#4A0C63]">
              <input
                value={durationInput}
                onChange={(e) => {
                  if (parseInt(e.target.value) > 0 || e.target.value === "")
                    setDurationInput(e.target.value);
                }}
                className="text-[#8A08BF] text-md font-semibold mx-4 my-2 bg-transparent border-none focus:outline-none w-full"
              />
            </div>
          </div>
          <DurationDropdown
            selectedOption={selectedOption}
            options={options}
            setOption={(option: string) => {
              setSelectedOption(option);
            }}
          />
        </div>

        <div className="flex justify-center "></div>
      </div>
    </div>
  );
}
