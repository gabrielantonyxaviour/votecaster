import axios from "axios";
import type { NextApiRequest, NextApiResponse } from "next";
import FormData from "form-data";
import { Readable } from "stream";
const PINATA_JWT = process.env.PINATA_JWT;
const GATEWAY_KEY = process.env.GATEWAY_KEY;
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    console.log(req.body);
    const jsonString = JSON.stringify(req.body, null, 2);
    const formData = new FormData();

    formData.append("file", Readable.from(jsonString), {
      filename: "poll.json",
    });

    const pinataMetadata = JSON.stringify({
      name: "File name",
    });
    formData.append("pinataMetadata", pinataMetadata);

    const pinataOptions = JSON.stringify({
      cidVersion: 1,
    });
    formData.append("pinataOptions", pinataOptions);

    const response = await axios.post(
      "https://api.pinata.cloud/pinning/pinFileToIPFS",
      formData,
      {
        headers: {
          Authorization: `Bearer ${PINATA_JWT}`,
        },
      }
    );
    console.log(response.data);

    res.status(200).json({
      IpfsHash:
        "https://amethyst-impossible-ptarmigan-368.mypinata.cloud/ipfs/" +
        response.data.IpfsHash +
        "?pinataGatewayToken=" +
        GATEWAY_KEY,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
