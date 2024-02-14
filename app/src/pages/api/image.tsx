import axios from "axios";
import type { NextApiRequest, NextApiResponse } from "next";
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const pollId =
    req.query["id"] != undefined ? parseInt(req.query["id"] as string) : 0;
  console.log(pollId);
  const polls = [
    {
      question: "Which programming language do you prefer?",
      options: [
        { key: 1, text: "JavaScript", percentOfTotal: 30 },
        { key: 2, text: "Python", percentOfTotal: 25 },
        { key: 3, text: "Java", percentOfTotal: 20 },
        { key: 4, text: "C++", percentOfTotal: 25 },
      ],
    },
    {
      question: "Which team is gonna win the LaLiga 2024?",
      options: [
        { key: 1, text: "Barcelona", percentOfTotal: 30 },
        { key: 2, text: "Real Madrid", percentOfTotal: 25 },
        { key: 3, text: "Atletico Madrid", percentOfTotal: 20 },
        { key: 4, text: "Girona", percentOfTotal: 25 },
      ],
    },
  ];

  const pngBuffer = (
    await axios.get(process.env["IMG_HOST"] + "/api/image?id=1" || "")
  ).data;
  console.log(pngBuffer.data);
  // // Set the content type to PNG and send the response
  res.setHeader("Content-Type", "image/png");
  res.setHeader("Cache-Control", "max-age=10");
  res.send(pngBuffer);
}
