// import { PRIV_CAST_ABI, PRIV_CAST_ADDRESS } from "@/utils/constants";
import {
  baseSepoliaPublicClientAddress,
  publicClientAbi,
} from "@/utils/constants";
import { FrameTransactionResponse } from "@coinbase/onchainkit/frame";
import { NextRequest, NextResponse } from "next/server";
async function getResponse(req: NextRequest): Promise<NextResponse | Response> {
  const txData = {
    method: "eth_signTypedData_v4",
    params: {
      domain: {
        name: "Ether Mail",
        version: "1",
        chainId: 1,
        verifyingContract: "0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC",
      },
      types: {
        Person: [
          { name: "name", type: "string" },
          { name: "wallet", type: "address" },
        ],
        Mail: [
          { name: "from", type: "Person" },
          { name: "to", type: "Person" },
          { name: "contents", type: "string" },
        ],
      },
      primaryType: "Mail",
      message: {
        from: {
          name: "Cow",
          wallet: "0xCD2a3d9F938E13CD947Ec05AbC7FE734Df8DD826",
        },
        to: {
          name: "Bob",
          wallet: "0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB",
        },
        contents: "Hello, Bob!",
      },
    },
  };

  return NextResponse.json(txData);
}
export async function POST(req: NextRequest): Promise<Response> {
  return getResponse(req);
}
