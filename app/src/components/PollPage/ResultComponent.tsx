"use client";

import React, { useEffect, useState } from "react";
import FarcasterButton from "../FarcasterButton";
import { ConnectKitButton } from "connectkit";
import getVotes from "@/utils/supabase/getVotes";
import LoaderButton from "../LoaderButton";
import SelectableButton from "../SelectableButton";
export default function ResultComponent({ poll }: { poll: any }) {
  const [votesPercent, setVotesPercent] = useState([0, 0, 0, 0]);
  const [votes, setVotes] = useState([0, 0, 0, 0]);
  const [biggest, setBiggest] = useState(0);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    (async function () {
      const { response: votesResponse } = await getVotes({ pollId: poll.id });
      console.log(votesResponse);
      if (votesResponse != null) {
        setVotesPercent([
          Math.floor((votesResponse.votes[0] / votesResponse.total) * 100),
          Math.floor((votesResponse.votes[1] / votesResponse.total) * 100),
          Math.floor((votesResponse.votes[2] / votesResponse.total) * 100),
          Math.floor((votesResponse.votes[3] / votesResponse.total) * 100),
        ]);
        setVotes(votesResponse.votes);
        setBiggest(votesResponse.maxVotes);
        setReady(true);
      }
    })();
  }, [poll.id]);
  return (
    <div className="max-w-[1200px] mx-auto h-screen py-8">
      <div className="flex justify-between pb-12 ">
        <p className="text-3xl font-bold ">PRIV.CAST</p>
        <div className="flex space-x-4 ">
          <FarcasterButton isInverted={true} />
          <ConnectKitButton theme="retro" />
        </div>
      </div>
      <div className="flex justify-between h-full">
        {ready && (
          <div className="w-[60%] h-full bg-[#FDE2C4]">
            <div className="flex flex-col h-full p-12">
              <p className="text-[#BF080A] font-bold text-5xl pb-8">
                {poll.question}
              </p>
              <div className="flex flex-col space-y-4">
                <LoaderButton
                  name={poll.option_a}
                  percentage={votesPercent[0]}
                  remaining={100 - votesPercent[0]}
                  voteCount={votes[0]}
                  biggest={biggest != 0 && biggest === votes[0] ? true : false}
                />
                <LoaderButton
                  name={poll.option_b}
                  percentage={votesPercent[1]}
                  remaining={100 - votesPercent[1]}
                  voteCount={votes[1]}
                  biggest={biggest != 0 && biggest === votes[1] ? true : false}
                />
                <LoaderButton
                  name={poll.option_c}
                  percentage={votesPercent[2]}
                  remaining={100 - votesPercent[2]}
                  voteCount={votes[2]}
                  biggest={biggest != 0 && biggest === votes[2] ? true : false}
                />
                <LoaderButton
                  name={poll.option_d}
                  percentage={votesPercent[3]}
                  remaining={100 - votesPercent[3]}
                  voteCount={votes[3]}
                  biggest={biggest != 0 && biggest === votes[3] ? true : false}
                />
              </div>
              <div className="flex justify-center pt-20">
                <SelectableButton
                  isSelected={true}
                  disabled={false}
                  text={"Vote on Poll 🗳️"}
                  click={() => {
                    window.location.href = "/polls/" + poll.id;
                  }}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
