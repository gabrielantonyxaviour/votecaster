import {
  FrameTransactionResponse,
  FrameRequest,
  getFrameMessage,
} from "@coinbase/onchainkit/frame";
import { NextRequest, NextResponse } from "next/server";
import { toHex } from "viem";

async function getResponse(req: NextRequest): Promise<NextResponse | Response> {
  const body: FrameRequest = await req.json();

  const txData: FrameTransactionResponse = {
    method: "eth_personalSign",
    chainId: "eip155:84532",
    params: {
      abi: [],
      to: "0x5A6B842891032d702517a4E52ec38eE561063539",
      data: toHex("Sign this message"),
      value: "0",
    },
  };

  return NextResponse.json(txData);
}
export async function POST(req: NextRequest): Promise<Response> {
  return getResponse(req);
}
