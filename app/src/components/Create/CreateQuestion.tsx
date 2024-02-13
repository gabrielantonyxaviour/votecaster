import React from "react";
import InputButton from "../InputButton";

export default function CreateQuestion({
  poll,
  setPoll,
}: {
  poll: { question: string; options: string[] };
  setPoll: React.Dispatch<
    React.SetStateAction<{ question: string; options: string[] }>
  >;
}) {
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
      </div>
    </div>
  );
}
