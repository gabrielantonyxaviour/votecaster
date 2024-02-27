import React, { useEffect, useState } from "react";
import { useQuery } from "@airstack/airstack-react";
import { Data, QueryResponse } from "@/utils/airstackInterface";
import { useAccount } from "wagmi";
import Image from "next/image";

export default function FarcasterButton({
  isInverted,
}: {
  isInverted: boolean;
}) {
  const { address } = useAccount();
  const [hasProfile, setHasProfile] = useState(false);
  const [profileImage, setProfileImage] = useState("");
  const [userId, setUserId] = useState("");
  const {
    data,
    loading,
    error: queryError,
  }: QueryResponse = useQuery<Data>(
    `  query MyQuery {
  Socials(
    input: {blockchain: ethereum, filter: {dappName: {_eq: farcaster}, identity: {_eq: "${address}"}}}
  ) {
    Social {
      profileImage
      fnames
      userId
    }
  }
}`,
    {},
    { cache: true }
  );
  useEffect(() => {
    if (
      data != null &&
      (data as any).Socials != null &&
      (data as any).Socials.Social != null &&
      (data as any).Socials.Social.length > 0
    ) {
      setHasProfile(true);
      setProfileImage((data as any).Socials.Social[0].profileImage);
      setUserId((data as any).Socials.Social[0].fnames[0]);
      console.log(data);
    } else {
      setHasProfile(false);
    }
  }, [data, loading, queryError]);
  return (
    hasProfile && (
      <div
        className={`${
          isInverted ? "bg-black" : "bg-[#630C0C]"
        } rounded-lg mt-1`}
        onClick={() => {}}
      >
        <div
          className={`${
            isInverted ? "bg-white" : "bg-[#BF0808]"
          } -translate-y-1 translate-x-1 rounded-lg border-2 border-[#630C0C]  px-4 py-2 flex space-x-2 cursor-default`}
          onClick={() => {
            console.log("clicked");
            // click();
          }}
        >
          <Image
            src={profileImage}
            width={30}
            height={30}
            alt="pfp"
            className="rounded-full"
          />
          <p
            className={`${
              isInverted ? "text-black" : "text-white"
            } text-sm font-semibold my-auto`}
          >
            {userId}
          </p>
        </div>
      </div>
    )
  );
}
