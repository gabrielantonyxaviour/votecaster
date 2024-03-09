import axios from "axios";
import type { NextApiRequest, NextApiResponse } from "next";
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const pollId =
      req.query["id"] != undefined ? parseInt(req.query["id"] as string) : 0;
    const results =
      req.query["results"] != undefined
        ? (req.query["results"] as string)
        : "false";
    console.log(
      process.env["IMG_HOST"] +
        "/api/image?id=" +
        pollId +
        "&results=" +
        results
    );
    const pngBuffer = await axios.get(
      process.env["IMG_HOST"] +
        "/api/image?id=" +
        pollId +
        "&results=" +
        results,
      { responseType: "arraybuffer" }
    );
    console.log(pngBuffer);
    // // Set the content type to PNG and send the response
    res.setHeader("Content-Type", "image/png");
    res.setHeader("Cache-Control", "max-age=10");
    res.send(pngBuffer.data);
  } catch (e) {
    console.log(e);
  }
}
