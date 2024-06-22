import {
  FrameRequest,
  getFrameHtmlResponse,
  getFrameMessage,
} from "@coinbase/onchainkit/frame";
import { NextRequest, NextResponse } from "next/server";
import { constrainedMemory } from "process";
async function getResponse(req: NextRequest): Promise<NextResponse> {
  const body: FrameRequest = await req.json();
  console.log("body");
  console.log(body);
  const frameMessage = await getFrameMessage(body);
  const production = process.env.NEXT_PUBLIC_PRODUCTION == "true";
  console.log("frameMessage");
  console.log(frameMessage);
  return new NextResponse(
    getFrameHtmlResponse({
      buttons: [
        {
          label: "Vote success",
        },
      ],
      image: {
        src: `${
          production ? "https://privcast.com" : "http://localhost:3000"
        }/frames/voteSuccess.png`,
      },
    })
  );
}

export async function GET(req: NextRequest): Promise<Response> {
  return getResponse(req);
}
export async function POST(req: NextRequest): Promise<Response> {
  return getResponse(req);
}
export const dynamic = "force-dynamic";
