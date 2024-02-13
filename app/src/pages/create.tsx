import InputButton from "@/components/InputButton";
import Navbar from "@/components/Navbar";
import React, { useState } from "react";

export default function CreatePage() {
  const [poll, setPoll] = useState<{
    question: string;
    options: string[];
  }>({
    question: "",
    options: ["Option 1", "Option 2", "Option 3", "Option 4 "],
  });
  return (
    <div className="max-w-[1200px] mx-auto h-screen py-8">
      <Navbar />
      <div className="flex justify-between h-full w-full">
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
        <div className="flex flex-col justify-between w-[39%] h-full py-3">
          <div className="h-[65%] w-full bg-[#FBF6FF] rounded-xl"></div>
          <div className="h-[33%] w-full bg-[#FBF6FF] rounded-xl"></div>
        </div>
      </div>
    </div>
  );
}
