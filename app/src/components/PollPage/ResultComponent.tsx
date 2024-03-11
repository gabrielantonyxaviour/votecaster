"use client";

import React, { use, useEffect, useState } from "react";
import FarcasterButton from "../FarcasterButton";
import { ConnectKitButton } from "connectkit";
import getVotes from "@/utils/supabase/getVotes";
import LoaderButton from "../LoaderButton";
import SelectableButton from "../SelectableButton";
import connectSecretWallet from "@/utils/connectSecretWallet";
import { useAccount } from "wagmi";
import {
  secret_contract_address,
  secret_contract_hash,
} from "@/utils/constants";
export default function ResultComponent({ poll }: { poll: any }) {
  const [votesPercent, setVotesPercent] = useState([0, 0, 0, 0]);
  const [votes, setVotes] = useState([0, 0, 0, 0]);
  const [biggest, setBiggest] = useState(0);
  const [ready, setReady] = useState(false);
  const [timeLeft, setTimeLeft] = useState(-1);
  const [fetchedResults, setFetchedResults] = useState(false);
  const { address } = useAccount();
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
      } else {
        setVotesPercent([0, 0, 0, 0]);
        setVotes([0, 0, 0, 0]);
        setBiggest(1);
        setReady(true);
      }
    })();
  }, [poll.id]);

  useEffect(() => {
    (async function () {
      const connection = await connectSecretWallet(address as string);

      if (timeLeft === 0 && fetchedResults == false) {
        console.log("Querying resultts");
        try {
          const my_query =
            await connection?.secretjs.query.compute.queryContract({
              contract_address: secret_contract_address,
              code_hash: secret_contract_hash,
              query: { get_results: { poll_id: poll.id } },
            });
          console.log(my_query);
          setFetchedResults(true);
        } catch (e) {
          console.log(e);
        }
      } else if (timeLeft > 0) {
        try {
          const my_query =
            await connection?.secretjs.query.compute.queryContract({
              contract_address: secret_contract_address,
              code_hash: secret_contract_hash,
              query: { get_vote_count: { poll_id: poll.id } },
            });
          console.log(my_query);
        } catch (e) {
          console.log(e);
        }
      }
    })();
  }, [address, timeLeft]);
  useEffect(() => {
    const targetTimestamp =
      Math.floor(new Date(poll.created_at).getTime() / 1000) + poll.validity;

    const intervalId = setInterval(() => {
      const currentTime = Math.floor(Date.now() / 1000);

      if (currentTime > targetTimestamp) {
        setTimeLeft(0);
        clearInterval(intervalId);
      } else {
        const remaining = Math.max(0, targetTimestamp - currentTime);

        setTimeLeft(remaining);

        if (remaining === 0) {
          clearInterval(intervalId);
        }
      }
    }, 1000);

    return () => clearInterval(intervalId);
  }, [poll.validity]);
  return (
    <div className="max-w-[1200px] mx-auto h-screen py-8">
      <div className="flex justify-between pb-12 ">
        <p className="text-3xl font-bold text-[#FDE2C4]">PRIV.CAST</p>
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

              {timeLeft === 0 && fetchedResults == true ? (
                <div className="flex flex-col space-y-4">
                  <LoaderButton
                    name={poll.option_a}
                    percentage={votesPercent[0]}
                    remaining={100 - votesPercent[0]}
                    voteCount={votes[0]}
                    biggest={
                      biggest != 0 && biggest === votes[0] ? true : false
                    }
                  />
                  <LoaderButton
                    name={poll.option_b}
                    percentage={votesPercent[1]}
                    remaining={100 - votesPercent[1]}
                    voteCount={votes[1]}
                    biggest={
                      biggest != 0 && biggest === votes[1] ? true : false
                    }
                  />
                  <LoaderButton
                    name={poll.option_c}
                    percentage={votesPercent[2]}
                    remaining={100 - votesPercent[2]}
                    voteCount={votes[2]}
                    biggest={
                      biggest != 0 && biggest === votes[2] ? true : false
                    }
                  />
                  <LoaderButton
                    name={poll.option_d}
                    percentage={votesPercent[3]}
                    remaining={100 - votesPercent[3]}
                    voteCount={votes[3]}
                    biggest={
                      biggest != 0 && biggest === votes[3] ? true : false
                    }
                  />
                </div>
              ) : (
                <div className="pt-12">
                  <p className="text-[#BF080A] font-bold text-xl text-center">
                    POLL IS STILL ONGOING. RESULTS IN
                  </p>

                  <p className="text-[#BF080A] pt-4 text-2xl  text-center">
                    {Math.floor(timeLeft / 86400)} Days,{" "}
                    {Math.floor((timeLeft % 86400) / 3600) < 10 ? "0" : ""}
                    {Math.floor((timeLeft % 86400) / 3600)}:
                    {Math.floor((timeLeft % 3600) / 60) < 10 ? "0" : ""}
                    {Math.floor((timeLeft % 3600) / 60)}:
                    {timeLeft % 60 < 10 ? "0" : ""}
                    {timeLeft % 60}
                  </p>
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
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
