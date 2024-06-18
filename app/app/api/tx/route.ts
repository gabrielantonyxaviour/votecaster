import { getFrameHtmlResponse } from "@coinbase/onchainkit/frame";
import { NextRequest, NextResponse } from "next/server";

async function getResponse(req: NextRequest): Promise<NextResponse> {
  const production = process.env.NEXT_PUBLIC_PRODUCTION == "true";
  return new NextResponse(
    getFrameHtmlResponse({
      buttons: [
        {
          label: "Sign",
          action: "tx",
          target: `${
            production ? "https://privcast.com" : "http://localhost:3000"
          }/api/sign`,
          postUrl: `${
            production ? "https://privcast.com" : "http://localhost:3000"
          }/api/transaction-success`,
        },
      ],
      image: {
        src: `${
          production ? "https://privcast.com" : "http://localhost:3000"
        }/frames/theme0.png`,
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
