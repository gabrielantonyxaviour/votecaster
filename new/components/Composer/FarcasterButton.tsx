import React, { useEffect, useState } from "react";
import { useQuery } from "@airstack/airstack-react";
import { Data, QueryResponse } from "@/utils/airstackInterface";
import Logo from "./Logo";
import Image from "next/image";

export default function FarcasterButton() {
  const [fetched, setFetched] = useState(false);
  const [profileImage, setProfileImage] = useState("");
  const [userId, setUserId] = useState("");
  const fid = process.env.FARCASTER_ID || "1"; // TODO: Use this fid to fetch the profile
  const {
    data,
    loading,
    error: queryError,
  }: QueryResponse = useQuery<Data>(
    `  query MyQuery {
  Socials(
    input: {filter: {dappName: {_eq: farcaster}, userId: {_eq: "${fid}"}}, blockchain: ethereum}
  ) {
    Social {
      profileImage
      profileHandle
    }
  }
}`,
    {},
    { cache: true }
  );
  useEffect(() => {
    console.log("HI");
    if (
      data != null &&
      (data as any).Socials != null &&
      (data as any).Socials.Social != null &&
      (data as any).Socials.Social.length > 0
    ) {
      setProfileImage((data as any).Socials.Social[0].profileImage);
      setUserId((data as any).Socials.Social[0].profileHandle);
      console.log(data);
      setFetched(true);
    } else {
    }
  }, [data, loading, queryError]);

  return (
    fetched && (
      <div className={`bg-[#4A0C63] rounded-sm my-auto`}>
        <div
          className={`bg-[#8A08BF] -translate-y-[2px] -translate-x-[2px] border-2 border-[#4A0C63]  px-3 py-1 flex space-x-2 cursor-default`}
        >
          <Image
            src={profileImage}
            width={25}
            height={25}
            alt="pfp"
            className="rounded-full"
          />
          <p className={`text-white text-xs font-semibold my-auto`}>{userId}</p>
        </div>
      </div>
    )
  );
}
