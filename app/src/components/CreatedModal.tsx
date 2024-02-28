import useWindowSize from "@/hooks/useWindowSize";
import { faCopy, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import Confetti from "react-confetti";

export default function CreatedModal({
  pollId,
  close,
}: {
  pollId: string;
  close: () => void;
}) {
  const { width, height } = useWindowSize();
  return (
    <div
      className="fixed top-0 left-0 w-full h-full bg-black opacity-85 z-40"
      //   onClick={close}
    >
      <Confetti width={width} height={height} />

      <div className="fixed top-[50%] left-[50%] -translate-y-1/2 -translate-x-1/2 bg-[#630C0C] p-4 z-50  w-[28%] rounded-lg">
        <div className="flex justify-between mt-2">
          <p className="text-white font-bold text-2xl text-center my-auto">
            POLL CREATED! 🎉
          </p>
          <FontAwesomeIcon
            icon={faTimes}
            className="cursor-pointer my-auto"
            size="xl"
            onClick={close}
          />
        </div>

        <div className="w-[50%]  h-[2px] mt-2 bg-white"></div>

        <p className="mt-8 text-white font-semibold text-center">
          Paste this url in your cast to view as Farcaster Frames
        </p>
        <p className=" font-bold text-md text-center mt-2">
          {"https://priv-cast-secret.vercel.app/polls/" + pollId}
          <FontAwesomeIcon
            icon={faCopy}
            className="cursor-pointer ml-2"
            onClick={() => {
              navigator.clipboard.writeText(
                "https://priv-cast-secret.vercel.app/polls/" + pollId
              );
            }}
          />
        </p>
      </div>
    </div>
  );
}
