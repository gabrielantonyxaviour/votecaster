import { PRIV_CAST_ABI, PRIV_CAST_ADDRESS } from "@/utils/constants";
import { FrameTransactionResponse } from "@coinbase/onchainkit/frame";
import { NextRequest, NextResponse } from "next/server";
import { encodeFunctionData } from "viem";
import { baseSepolia } from "viem/chains";
import pinataSDK from "@pinata/sdk";
async function getResponse(req: NextRequest): Promise<NextResponse | Response> {
  console.log("POLL");
  console.log(process.env.POLL);
  console.log("VALIDITY");
  console.log(process.env.VALIDITY);

  const pinata = new pinataSDK(
    process.env.PINATA_API_KEY,
    process.env.PINATA_SECRET_API_KEY
  );

  const timestamp = Date.now();
  process.env.TIMESTAMP = JSON.stringify(timestamp);

  const body = JSON.parse(process.env.POLL || "{}");
  const options: any = {
    pinataMetadata: {
      name: "PRIV CAST POLL " + Math.floor(Math.random() * 10000001).toString(),
    },
    pinataOptions: {
      cidVersion: 1,
    },
  };
  const res = await pinata.pinJSONToIPFS(body, options);
  console.log(res);
  const data = encodeFunctionData({
    abi: PRIV_CAST_ABI,
    functionName: "createPoll",
    args: [res.IpfsHash, process.env.VALIDITY],
  });

  const txData: FrameTransactionResponse = {
    chainId: `eip155:${baseSepolia.id}`,
    method: "eth_sendTransaction",
    params: {
      abi: PRIV_CAST_ABI,
      to: PRIV_CAST_ADDRESS,
      data,
      value: "0",
    },
  };

  return NextResponse.json(txData);
}
export async function POST(req: NextRequest): Promise<Response> {
  return getResponse(req);
}
