import type { NextApiRequest, NextApiResponse } from "next";
import satori from "satori";
import sharp from "sharp";
import { join } from "path";
import * as fs from "fs";
import { createClient } from "@supabase/supabase-js";
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_KEY ?? "";
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const fontFilePath = join(process.cwd(), "public", "Lato-Regular.ttf");
  let fontData = fs.readFileSync(fontFilePath);
  const pollId =
    req.query["id"] != undefined ? parseInt(req.query["id"] as string) : 0;
  console.log(pollId);
  let poll = [];
  try {
    const { data: fetchedPoll, error: fetchError } = await supabase
      .from("polls")
      .select("*")
      .eq("id", pollId);

    console.log(fetchedPoll);

    if (fetchError || fetchedPoll == null || fetchedPoll.length == 0) {
    } else {
      poll = fetchedPoll[0];
    }
  } catch (error) {
    console.error("Error getting poll:", error);
  }

  let pollSvg;
  if (poll.length == 0) {
    pollSvg = await satori(
      <div
        style={{
          display: "flex",
          width: "100%",
          height: "100%",
          backgroundColor: "#450C63",
          paddingLeft: 50,
          paddingRight: 50,
          fontSize: 24,
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            flex: 1,
          }}
        >
          <div
            style={{
              flex: 1,
              width: "80%",
              backgroundColor: "#FBF6FF",
              margin: "auto",
              marginTop: 70,
              display: "flex",
              flexDirection: "column",
              padding: 20,
              borderTopLeftRadius: 10,
              borderTopRightRadius: 10,
            }}
          >
            <p
              style={{
                color: "#450C63",
                textTransform: "uppercase",
                fontWeight: "bold",
                marginTop: 60,
                marginBottom: 25,
                fontSize: 30,
              }}
            >
              Poll does not exist :/
            </p>

            <div
              style={{
                flex: 1,
                display: "flex",
                justifyContent: "center",
                width: "100%",
              }}
            >
              <p
                style={{
                  color: "#9508BF",
                  fontSize: 15,
                  marginTop: 10,
                  marginBottom: 20,
                  textAlign: "end",
                  marginLeft: "auto",
                }}
              >
                Create anonymous polls on&nbsp;
                <span style={{ color: "#450C63" }}>priv.cast</span>
              </p>
            </div>
          </div>
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
  } else {
    pollSvg = await satori(
      <div
        style={{
          display: "flex",
          width: "100%",
          height: "100%",
          backgroundColor: "#450C63",
          paddingLeft: 50,
          paddingRight: 50,
          fontSize: 24,
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            flex: 1,
          }}
        >
          <div
            style={{
              flex: 1,
              width: "80%",
              backgroundColor: "#FBF6FF",
              margin: "auto",
              marginTop: 70,
              display: "flex",
              flexDirection: "column",
              padding: 20,
              borderTopLeftRadius: 10,
              borderTopRightRadius: 10,
            }}
          >
            <p
              style={{
                color: "#9508BF",
                fontSize: 18,
                lineHeight: 1,
                marginTop: 5,
                marginBottom: 5,
              }}
            >
              @{poll.farcaster_username} asks
            </p>
            <p
              style={{
                color: "#450C63",
                textTransform: "uppercase",
                fontWeight: "bold",
                marginTop: 5,
                marginBottom: 5,
                fontSize: 30,
              }}
            >
              {poll.question}
            </p>

            <div
              style={{
                display: "flex",
                marginTop: 12,
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  width: "35%",
                  height: 40,
                  margin: "auto",
                  background: "#450C63",
                  borderRadius: 5,
                  textAlign: "center",
                  color: "#ffffff",
                  fontSize: 14,
                }}
              >
                <p>{poll.option_a}</p>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  width: "35%",
                  height: 40,
                  margin: "auto",
                  background: "#450C63",
                  borderRadius: 5,
                  textAlign: "center",
                  color: "#ffffff",
                  fontSize: 14,
                }}
              >
                <p>{poll.option_b}</p>
              </div>
            </div>
            <div
              style={{
                display: "flex",
                marginTop: 5,
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  width: "35%",
                  height: 40,
                  margin: "auto",
                  background: "#450C63",
                  borderRadius: 5,
                  textAlign: "center",
                  color: "#ffffff",
                  fontSize: 14,
                }}
              >
                <p>{poll.option_c}</p>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  width: "35%",
                  height: 40,
                  margin: "auto",
                  background: "#450C63",
                  borderRadius: 5,
                  textAlign: "center",
                  color: "#ffffff",
                  fontSize: 14,
                }}
              >
                <p>{poll.option_d}</p>
              </div>
            </div>
            <div
              style={{
                flex: 1,
                display: "flex",
                justifyContent: "center",
                width: "100%",
              }}
            >
              <p
                style={{
                  color: "#9508BF",
                  fontSize: 15,
                  marginTop: 10,
                  marginBottom: 20,
                  textAlign: "end",
                  marginLeft: "auto",
                }}
              >
                Create anonymous polls on&nbsp;
                <span style={{ color: "#450C63" }}>priv.cast</span>
              </p>
            </div>
            <div
              style={{
                display: "flex",
                marginBottom: 30,
              }}
            >
              <div style={{ display: "flex", marginTop: 5 }}>
                <div
                  style={{
                    display: "flex",
                    borderRadius: "100%",
                    height: 12,
                    width: 12,
                    backgroundColor: "#450C63",
                    marginTop: "auto",
                    marginBottom: "auto",
                  }}
                ></div>
                <p
                  style={{
                    fontSize: 12,
                    marginTop: 0,
                    marginBottom: 0,
                    marginLeft: 5,
                    color: "#450C63",
                  }}
                >
                  Anonymous
                </p>
              </div>
              {poll.is_anon && (
                <div style={{ display: "flex", marginTop: 5, marginLeft: 20 }}>
                  <div
                    style={{
                      display: "flex",
                      borderRadius: "100%",
                      height: 12,
                      width: 12,
                      backgroundColor: "#450C63",
                      marginTop: "auto",
                      marginBottom: "auto",
                    }}
                  ></div>

                  <p
                    style={{
                      fontSize: 12,
                      marginTop: 0,
                      marginBottom: 0,
                      marginLeft: 5,
                      color: "#450C63",
                    }}
                  >
                    Sybil Resistant
                  </p>
                </div>
              )}
            </div>
          </div>
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
  }

  // // Handle the request and send the response

  const pngBuffer = await sharp(Buffer.from(pollSvg))
    .toFormat("png")
    .toBuffer();

  // // Set the content type to PNG and send the response
  res.setHeader("Content-Type", "image/png");
  res.setHeader("Cache-Control", "max-age=10");
  res.send(pngBuffer);
}
