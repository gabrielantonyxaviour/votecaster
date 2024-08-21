"use client";

import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import TopBar from "../TopBar";
import styles from "@/styles/spinner.module.css";
import { ConnectKitButton } from "connectkit";
import Link from "next/link";
import HoverButton from "../Common/HoverButton";
import preloadImages from "@/utils/preloadImages";

export default function ViewPollsPage({
  pollUris,
}: {
  pollUris: string[] | null;
}) {
  const { status, address } = useAccount();
  const [fName, setFName] = useState("");
  const [loadedImages, setLoadedImages] = useState<HTMLImageElement[]>([]);

  useEffect(() => {
    if (pollUris != null && loadedImages.length != pollUris.length) {
      preloadImages(pollUris).then((images) => {
        setLoadedImages(images);
      });
    }
  }, [pollUris, loadedImages]);

  useEffect(() => {
    console.log(loadedImages);
    console.log(pollUris);
  }, [loadedImages, pollUris]);
  return (
    <div className="px-3 min-h-screen flex flex-col">
      <div className="w-full bg-[#FBF6FF] text-[#450C63] flex-1 flex flex-col h-full justify-start items-center  pt-6">
        <TopBar setFName={setFName} fName={fName} />
        {status == "connected" ? (
          <>
            <p className="pt-12 pb-6 font-bold text-xl">Your Polls</p>

            {loadedImages.length == 0 ? (
              pollUris == null || pollUris.length > 0 ? (
                <div className="flex-1 flex items-center">
                  <div className={`${styles.spinner} `}></div>
                </div>
              ) : (
                <div className="flex-1 flex flex-col justify-center items-center space-y-4">
                  <p className="text-center text-md ">No Polls Found 😢</p>
                  <Link href="/composer">
                    <HoverButton
                      text="Create Polls 🚀"
                      disabled={false}
                      click={() => {}}
                    />
                  </Link>
                </div>
              )
            ) : (
              <div className="grid grid-cols-2 gap-8 w-full mx-auto">
                {loadedImages.map((uri, i) => (
                  <Link
                    href={`/polls/${i}`}
                    key={i}
                    className={`relative mx-auto rounded-lg w-[65%] aspect-[1.91/1] hover:border-[1px] cursor-pointer transform transition-transform duration-300 hover:scale-110 hover:border-[#450C63] `}
                  >
                    <div className="relative w-full h-full">
                      <img
                        src={loadedImages[i].src}
                        alt="poll image"
                        className="absolute inset-0 object-cover rounded-lg w-full h-full"
                        onError={(e) => {
                          console.log("Error loading image");
                          console.log(e);
                        }}
                      />
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="flex-1 flex items-center">
            <ConnectKitButton theme="retro" />
          </div>
        )}
      </div>
    </div>
  );
}
