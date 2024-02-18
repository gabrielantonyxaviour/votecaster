import axios from "axios";
import type { NextApiRequest, NextApiResponse } from "next";
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const pollId =
    req.query["id"] != undefined ? parseInt(req.query["id"] as string) : 0;

  const pngBuffer = await axios.get(
    process.env["IMG_HOST"] + "/api/image?id=" + pollId || "",
    { responseType: "arraybuffer" }
  );
  console.log(pngBuffer);
  // // Set the content type to PNG and send the response
  res.setHeader("Content-Type", "image/png");
  res.setHeader("Cache-Control", "max-age=10");
  res.send(pngBuffer.data);
}
