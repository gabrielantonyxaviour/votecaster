import axios from "axios";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    try {
      const pollId = req.query["id"];
      const results = req.query["results"] === "true";
      if (!pollId) {
        return res.status(400).send("Missing poll ID");
      }

      console.log("IMAGE HOST: ", process.env.IMG_HOST);
      const IMG_HOST = process.env.IMG_HOST || "";

      let buttonId = 0;
      buttonId = req.body?.untrustedData?.buttonIndex || 0;

      if (buttonId === 1) {
        return res
          .status(302)
          .setHeader("Location", `${process.env["HOST"]}/polls/${pollId}`)
          .send("Redirecting to vote poll: " + pollId);
      }

      const imageUrl = `${process.env["HOST"]}/api/image?id=${pollId}&results=${
        results ? "false" : "true"
      }`;
      let button2Text;
      if (results) {
        button2Text = "View Results";
      } else {
        button2Text = "Hide Results";
      }

      // Return an HTML response
      res.setHeader("Content-Type", "text/html");
      res.status(200).send(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Vote Recorded</title>
          <meta property="og:title" content="Vote Recorded">
          <meta property="og:image" content="${imageUrl}">
          <meta name="fc:frame" content="vNext">
          <meta name="fc:frame:image" content="${imageUrl}">
          <meta name="fc:frame:post_url" content="${
            process.env["HOST"]
          }/api/vote?id=${pollId}?results=${results ? "false" : "true"}">
          <meta name="fc:frame:button:1" content="Vote">
          <meta name="fc:frame:button:1:action" content="post_redirect">
          <meta name="fc:frame:button:2" content="${button2Text}">
        </head>
        <body>
          <p>Hello from priv.cast</p>
        </body>
      </html>
    `);
    } catch (error) {
      console.error(error);
      res.status(500).send("Error generating image");
    }
  } else {
    // Handle any non-POST requests
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
