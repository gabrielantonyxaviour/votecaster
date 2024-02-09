import type { NextApiRequest, NextApiResponse } from "next";
import satori from "satori";
import sharp from "sharp";
import { join } from "path";
import * as fs from "fs";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const fontFilePath = join(process.cwd(), "public", "Lato-Regular.ttf");
  console.log("fontFilePath", fontFilePath);
  let fontData = fs.readFileSync(fontFilePath);

  const pollData = {
    question: "Which programming language do you prefer?",
    cybil: true,
    options: [
      { key: 1, text: "JavaScript", percentOfTotal: 30 },
      { key: 2, text: "Python", percentOfTotal: 25 },
      { key: 3, text: "Java", percentOfTotal: 20 },
      { key: 4, text: "C++", percentOfTotal: 25 },
    ],
  };
  const showResults = false;
  // // Handle the request and send the response
  let imageUrl = "https://picsum.photos/400/200";
  const svg = await satori(
    <div
      style={{
        justifyContent: "flex-start",
        alignItems: "center",
        display: "flex",
        width: "100%",
        height: "100%",
        backgroundColor: "#450C63",
        padding: 50,
        lineHeight: 1.2,
        fontSize: 24,
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          padding: 20,
        }}
      >
        <h1>priv.cast</h1>
        <h2 style={{ textAlign: "center", color: "lightgray" }}>
          {pollData.question}
        </h2>
        {pollData.options.map((opt, index) => {
          return (
            <div
              key={opt.key}
              style={{
                backgroundColor: showResults ? "#007bff" : "",
                color: "#fff",
                padding: 10,
                marginBottom: 10,
                borderRadius: 4,
                width: `${showResults ? opt.percentOfTotal : 100}%`,
                whiteSpace: "nowrap",
                overflow: "visible",
              }}
            >
              {opt.text}
            </div>
          );
        })}
        {/*{showResults ? <h3 style={{color: "darkgray"}}>Total votes: {totalVotes}</h3> : ''}*/}
      </div>
    </div>,
    {
      width: 600,
      height: 400,
      fonts: [
        {
          data: fontData,
          name: "Lato-Regular",
          style: "normal",
          weight: 400,
        },
      ],
    }
  );

  const pngBuffer = await sharp(Buffer.from(svg)).toFormat("png").toBuffer();

  // // Set the content type to PNG and send the response
  res.setHeader("Content-Type", "image/png");
  res.setHeader("Cache-Control", "max-age=10");
  res.send(pngBuffer);
}
