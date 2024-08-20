import { Poll } from "@/utils/types";
import Image from "next/image";
import styles from "@/styles/spinner.module.css";
import Confetti from "react-confetti";
import { useEffect, useState } from "react";
import HoverButton from "@/components/HoverButton";
export default function PollCreatedPage({
  pollId,
  pollImage,
  sendTxHash,
}: {
  pollId: string;
  pollImage: string;
  sendTxHash: string;
}) {
  const [isConfettiVisible, setConfettiVisible] = useState(false);

  useEffect(() => {
    setConfettiVisible(true);
    setTimeout(() => setConfettiVisible(false), 10000);
  }, []);
  return (
    <div className="h-full w-full flex flex-col justify-center space-y-8">
      {isConfettiVisible && <Confetti />}
      <p className="text-center font-bold text-md ">
        POLL CREATED SUCCESSFULLY! 🎉
      </p>
      <div className="relative border-2 border-[#450C63] mx-auto rounded-lg flex items-center justify-center w-full max-w-[70%] aspect-[1.91/1]">
        {pollImage ? (
          <div className="relative w-full h-full">
            <Image
              src={pollImage}
              layout="fill"
              objectFit="cover"
              alt=""
              className="rounded-lg"
            />
          </div>
        ) : (
          <div className={styles.spinner}></div>
        )}
      </div>
      <p className=" font-bold text-md text-center">
        {"https://privcast.com/api/poll/" + pollId}
      </p>
      <div className="flex justify-center">
        <HoverButton
          text="Cast on Warpcast 🚀"
          disabled={false}
          click={() => {
            // TODO: Redirect to Warpcast
          }}
        />
      </div>
    </div>
  );
}
