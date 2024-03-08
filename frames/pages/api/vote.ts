import type { NextApiRequest, NextApiResponse } from "next";
import { Message, getSSLHubRpcClient } from "@farcaster/hub-nodejs";

const HUB_URL = process.env["HUB_URL"];
const client = HUB_URL ? getSSLHubRpcClient(HUB_URL) : undefined;
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    try {
      console.log("BODY");
      console.log(req.body);
      let validatedMessage: Message | undefined = undefined;
      try {
        const frameMessage: any = Message.decode(
          Buffer.from(req.body?.trustedData?.messageBytes || "", "hex")
        );

        console.log("FRAME MESSAGE");
        console.log(frameMessage);

        console.log("FRAME MESSAGE");
        console.log({
          frameMessage: frameMessage,
        });
        res.status(200).send({
          frameMessage: frameMessage,
        });
      } catch (e) {
        console.log("ERROR");
        console.log(e);
        res.status(400).send("Invalid message");
      }
    } catch (e) {
      res.status(500).send("Error processing vote");
    }
  }
}
