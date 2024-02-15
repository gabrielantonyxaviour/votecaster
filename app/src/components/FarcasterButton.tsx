import React from "react";
import { useQuery } from "@airstack/airstack-react";
import { Data, QueryResponse } from "@/utils/airstackInterface";
import { useAccount } from "wagmi";

export default function FarcasterButton() {
  const { address } = useAccount();
  const {
    data: fidData,
    loading,
    error,
  }: QueryResponse = useQuery<Data>(
    `  query MyQuery {
  Socials(
    input: {blockchain: ethereum, filter: {dappName: {_eq: farcaster}, identity: {_eq: "${address}"}}}
  ) {
    Social {
      userId

    }
  }
}`,
    {},
    { cache: false }
  );
  return <div></div>;
}
