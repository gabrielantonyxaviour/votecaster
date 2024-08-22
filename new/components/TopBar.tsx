"use client";
import React, { useEffect, useState } from "react";
import Logo from "@/components/Common/Logo";
import FarcasterButton from "@/components/Common/FarcasterButton";
import { useAccount } from "wagmi";
import { ConnectKitButton } from "connectkit";
import { useQuery } from "@airstack/airstack-react";
import { Data, QueryResponse } from "@/utils/airstackInterface";
import Link from "next/link";
import { usePathname } from "next/navigation";
export default function TopBar({
  fName,
  setFName,
  setFid,
  isComposer,
}: {
  isComposer: boolean;
  fName: string;
  setFName: (name: string) => void;
  setFid: (id: number) => void;
}) {
  const { address, status } = useAccount();
  const [fetched, setFetched] = useState(false);
  const [profileImage, setProfileImage] = useState("");
  const fid = process.env.FARCASTER_ID || "1"; // TODO: Use this fid to fetch the profile
  const {
    data,
    loading,
    error: queryError,
  }: QueryResponse = useQuery<Data>(
    isComposer
      ? `  query MyQuery {
  Socials(
    input: {filter: {dappName: {_eq: farcaster}, userId: {_eq: "${fid}"}}, blockchain: ethereum}
  ) {
    Social {
      profileImage
      profileHandle
      userId
    }
  }
}`
      : ` query MyQuery {
  Socials(
    input: {blockchain: ethereum, filter: {dappName: {_eq: farcaster}, identity: {_eq: "${address}"}}}
  ) {
    Social {
      profileImage
      profileHandle
      userId
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
      setFName((data as any).Socials.Social[0].profileHandle);
      console.log(data);
      setFid((data as any).Socials.Social[0].userId);
      setFetched(true);
    } else {
      console.log("No profile found");
      console.log(data);
    }
  }, [data, loading, queryError]);
  return (
    <div className="flex justify-between w-full px-6">
      <Logo />
      {usePathname() != "/composer" && (
        <div className="flex space-x-4 my-auto">
          <Link
            href={"/composer"}
            className={
              usePathname() == "/composer"
                ? "underline text-xs lg:text-sm font-normal"
                : " text-xs lg:text-sm font-normal"
            }
          >
            Create
          </Link>
          <Link
            href={"/polls"}
            className={
              usePathname() == "/polls"
                ? "underline text-xs lg:text-sm font-normal"
                : " text-xs lg:text-sm font-normal"
            }
          >
            Polls
          </Link>
        </div>
      )}
      <div className="flex items-end space-x-4">
        <FarcasterButton
          fetched={fetched}
          profileImage={profileImage}
          userId={fName}
        />
        {status == "connected" && <ConnectKitButton theme="retro" />}
      </div>
    </div>
  );
}
