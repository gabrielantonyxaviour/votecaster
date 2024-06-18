import { FrameTransactionResponse } from "@coinbase/onchainkit/frame";
import { NextRequest, NextResponse } from "next/server";
import { baseSepolia } from "viem/chains";
async function getResponse(req: NextRequest): Promise<NextResponse | Response> {
  const timestamp = Date.now();
  process.env.TIMESTAMP = JSON.stringify(timestamp);
  const txData: FrameTransactionResponse = {
    chainId: `eip155:${baseSepolia.id}`,
    method: "eth_personalSign",
    params: {
      abi: [],
      to: `0x0429A2Da7884CA14E53142988D5845952fE4DF6a`,
      data: "0x3f6f8421b793d5a2897c0c24a1e3f8b6e28478e6d02b2a14c759c9b70b27e6f4",
      value: "0",
    },
  };
  return NextResponse.json(txData);
}
export async function POST(req: NextRequest): Promise<Response> {
  return getResponse(req);
}
