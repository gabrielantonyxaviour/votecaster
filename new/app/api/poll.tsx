import { fetchEntryById } from "@/utils/supabase";
import type { NextApiRequest, NextApiResponse } from "next";
import satori from "satori";
import fs from "fs";
import { NextResponse } from "next/server";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method == "GET") {
    const url = new URL(req.url || "");
    const params = url.searchParams;
    const pollId = params.get("pollId");

    if (pollId == null) {
      res.status(500).send("Error generating image");
      return;
    }
    const fontData = await fetch(`/monument.ttf`);
    const fontDataArrayBuffer = await fontData.arrayBuffer();
    const fetched = await fetchEntryById(parseInt(pollId));
    const image = await satori(
      <div
        style={{
          alignItems: "center",
          background: "white",
          backgroundSize: "100% 100%",
          display: "flex",
          flexDirection: "column",
          flexWrap: "nowrap",
          height: "100%",
          justifyContent: "center",
          textAlign: "center",
          width: "100%",
        }}
      >
        <div style={{ display: "flex" }}>
          <img
            style={{ zIndex: 1, width: "102%" }}
            src={`/frames/theme${fetched?.theme}.png`}
          />
        </div>
        <div
          style={{
            fontFamily: "fantasy",
            fontSize: "50px",
            position: "absolute",
            top: "210px",
            left: "200px",
            width: "800px",
            textWrap: "wrap",
            zIndex: 10,
            color: "black",
            justifyContent: "center",
            textAlign: "center",
          }}
        >
          {fetched?.question}
        </div>
        <div
          style={{
            fontFamily: "fantasy",
            fontSize: "30px",
            position: "absolute",
            top: "418px",
            left: "230px",
            width: "800px",
            textWrap: "wrap",
            zIndex: 10,
            color: "black",
          }}
        >
          {fetched?.op1}
        </div>
        <div
          style={{
            fontFamily: "fantasy",
            fontSize: "30px",
            position: "absolute",
            top: "418px",
            left: "670px",
            width: "800px",
            textWrap: "wrap",
            zIndex: 10,
            color: "black",
          }}
        >
          {fetched?.op2}
        </div>
        <div
          style={{
            fontFamily: "fantasy",
            fontSize: "30px",
            position: "absolute",
            top: "535px",
            left: "230px",
            width: "800px",
            textWrap: "wrap",
            zIndex: 10,
            color: "black",
          }}
        >
          {fetched?.op3}
        </div>
        <div
          style={{
            fontFamily: "fantasy",
            fontSize: "30px",
            position: "absolute",
            top: "535px",
            left: "670px",
            width: "800px",
            textWrap: "wrap",
            zIndex: 10,
            color: "black",
          }}
        >
          {fetched?.op4}
        </div>
      </div>,
      {
        width: 600,
        height: 400,
        fonts: [
          {
            name: "Monument",
            data: fontDataArrayBuffer,
            weight: 400,
            style: "normal",
          },
        ],
      }
    );
    console.log("IMAGE");
    console.log(image);
    return new NextResponse(image, {
      status: 200,
      headers: {
        "Content-Type": "image/svg+xml",
      },
    });
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
