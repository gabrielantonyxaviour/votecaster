import React, { useState } from "react";
import Button from "@/components/Button";

import Image from "next/image";
import { useRouter } from "next/navigation";
import Logo from "./Logo";
import TopBar from "./TopBar";
import InputButton from "../Composer/InputButton";

export default function Landing() {
  const [error, setError] = useState(false);
  const [poll, setPoll] = useState({
    question: "",
    options: ["Option 1", "Option 2", "Option 3", "Option 4"],
    duration: 0,
  });
  const router = useRouter();
  return (
    <div className="px-3 h-screen">
      <div className="w-full bg-[#FBF6FF] text-[#450C63] px-6 pt-6 h-full  ">
        <div className="flex flex-col h-full justify-between items-center ">
          <TopBar />
          <textarea
            className="w-full h-[30%] text-3xl font-bold placeholder:text-[#DCAFFF] text-[#450C63] bg-transparent border-none focus:outline-none resize-none leading-tight"
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

          {/* <div className="flex">
            <Button
              text="Connect Wallet"
              click={() => {
                router.push("/polls");
              }}
            />
          </div> */}
        </div>
      </div>
    </div>
  );
}
