import InputButton from "./InputButton";
import DurationDropdown from "./DurationDropdown";
import SelectableButton from "../SelectableButton";
import { useState } from "react";
interface Poll {
  question: string;
  options: string[];
  duration: number;
}

interface QuestionPageProps {
  poll: Poll;
  setPoll: (poll: Poll) => void;
  durationInput: string;
  setDurationInput: (i: string) => void;
  setStep: (step: number) => void;
}

export default function QuestionPage({
  poll,
  setPoll,
  setDurationInput,
  durationInput,
  setStep,
}: QuestionPageProps) {
  const timeframe = ["mins", "hours", "days"];
  const values = [60, 3600, 86400];
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  return (
    <>
      <textarea
        className="w-full h-[25%] text-3xl font-bold placeholder:text-[#DCAFFF] text-[#450C63] bg-transparent border-none focus:outline-none resize-none leading-tight"
        placeholder="ENTER YOUR QUESTION EX. WHICH TEAM IS WINNING LA LIGA?"
        onChange={(e) => {
          setPoll({ ...poll, question: e.target.value.toUpperCase() });
        }}
        value={poll.question}
      ></textarea>
      <div className="w-full">
        <div className="flex justify-between space-x-4">
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
        <div className="flex justify-between space-x-4 pt-4">
          <div className="flex-1">
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
      </div>
      <div className=" w-full pb-6">
        <p className="font-semibold text-[#450C63] text-lg">Duration</p>
        <div className="flex w-full space-x-4 mt-2">
          <div className="bg-[#4A0C63] rounded-sm">
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
                className="text-[#8A08BF] text-xs font-semibold mx-4 my-2 bg-transparent border-none focus:outline-none w-full"
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
          <div className="flex-1 flex justify-end">
            <SelectableButton
              text="Next"
              isSelected={false}
              disabled={poll.question.length == 0 || poll.duration == 0}
              click={() => {
                setStep(1);
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
}
