import React, { useEffect } from "react";
import { useQuery } from "@airstack/airstack-react";
import { Data, QueryResponse } from "@/utils/airstackInterface";
import { useAccount } from "wagmi";
import Image from "next/image";

export default function FarcasterButton() {
  const { address } = useAccount();
  const { data, loading, error }: QueryResponse = useQuery<Data>(
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
    { cache: false }
  );
  useEffect(() => {
    console.log(data);
  }, [data]);
  return (
    data != null &&
    (data as any).Socials != null &&
    (data as any).Socials.Social != null && (
      <div className="bg-[#4A0C63] rounded-lg mt-1" onClick={() => {}}>
        <div
          className="bg-[#8A08BF] -translate-y-1 translate-x-1 rounded-lg border-2 border-[#4A0C63]  px-4 py-2 flex space-x-2 cursor-default"
          onClick={() => {
            console.log("clicked");
            // click();
          }}
        >
          <Image
            src={(data as any).Socials.Social[0].profileImage}
            width={30}
            height={30}
            alt="pfp"
            className="rounded-full"
          />
          <p className="text-white text-sm font-semibold my-auto">
            {(data as any).Socials.Social[0].fnames[0]}
          </p>
        </div>
      </div>
    )
  );
}
