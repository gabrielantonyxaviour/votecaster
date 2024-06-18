import { FrameTransactionResponse } from "@coinbase/onchainkit/frame";
import { NextRequest, NextResponse } from "next/server";

async function getResponse(req: NextRequest): Promise<NextResponse | Response> {
  const timestamp = Date.now();
  process.env.TIMESTAMP = JSON.stringify(timestamp);
  const txData: FrameTransactionResponse = {
    chainId: "eip155:11155111",
    method: "eth_personalSign",
    params: {
      abi: [],
      to: `0x89c27f76EEF3e09D798FB06a66Dd461d7d21f111`,
      value: "Hello",
    },
  };
  return NextResponse.json(txData);
}
export async function POST(req: NextRequest): Promise<Response> {
  return getResponse(req);
}
