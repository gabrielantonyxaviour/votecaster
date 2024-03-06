import type { NextApiRequest, NextApiResponse } from "next";
// import {Poll, POLL_EXPIRY} from "@/app/types";
import { Message } from "@farcaster/hub-nodejs";

// const HUB_URL = process.env["HUB_URL"];
// const client = HUB_URL ? getSSLHubRpcClient(HUB_URL) : undefined;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    // Process the vote
    // For example, let's assume you receive an option in the body
    try {
      // let validatedMessage: Message | undefined = undefined;
      console.log("BODY");
      console.log(req.body);
      try {
        const frameMessage = Message.decode(
          Buffer.from(req.body?.trustedData?.messageBytes || "", "hex")
        );
        console.log("FRAME MESSAGE");
        console.log(frameMessage);
        res.status(200).send(frameMessage);
      } catch (e) {
        res.status(400).send("Invalid message");
      }
    } catch (e) {
      res.status(500).send("Error processing vote");
    }
  }
}
