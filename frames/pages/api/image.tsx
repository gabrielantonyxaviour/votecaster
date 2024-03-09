import type { NextApiRequest, NextApiResponse } from "next";
import satori from "satori";
import sharp from "sharp";
import { join } from "path";
import * as fs from "fs";
import getPoll from "@/app/helpers/getPoll";
import getVotes from "@/app/helpers/getVotes";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const fontFilePath = join(process.cwd(), "public", "Lato-Regular.ttf");
    let fontData = fs.readFileSync(fontFilePath);
    const pollId =
      req.query["id"] != undefined ? parseInt(req.query["id"] as string) : 0;
    const results =
      req.query["results"] != undefined
        ? (req.query["results"] as string)
        : "false";
    let { response: poll } = await getPoll({ pollId: pollId.toString() });

    let pollSvg;
    if (poll == null || poll == undefined || poll.length == 0) {
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
      if (results == "false") {
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
                    fontSize: 24,
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
                    <div
                      style={{ display: "flex", marginTop: 5, marginLeft: 20 }}
                    >
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
      } else {
        let { response: voteData } = await getVotes({
          pollId: pollId.toString(),
        });

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
                    fontSize: 14,
                    lineHeight: 1,
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
                    fontSize: 24,
                  }}
                >
                  {poll.question}
                </p>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    width: "85%",
                    height: 30,
                    marginTop: 5,
                    border: "2px solid black",
                    background:
                      voteData.votes[0] == voteData.maxVotes &&
                      voteData.maxVotes != 0
                        ? "#ffffff"
                        : "#450C63",
                    borderRadius: 5,
                    textAlign: "center",
                    color:
                      voteData.votes[0] == voteData.maxVotes &&
                      voteData.maxVotes != 0
                        ? "#000000"
                        : "#ffffff",
                    fontSize: 12,
                  }}
                >
                  <p>
                    {poll.option_a +
                      " (" +
                      Math.floor((voteData.votes[0] * 100) / voteData.total) +
                      "%) "}
                    {voteData.votes[0]} Vote(s)
                  </p>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    width: "85%",
                    height: 30,
                    marginTop: 5,
                    border: "2px solid black",
                    background:
                      voteData.votes[1] == voteData.maxVotes &&
                      voteData.maxVotes != 0
                        ? "#ffffff"
                        : "#450C63",
                    borderRadius: 5,

                    textAlign: "center",
                    color:
                      voteData.votes[1] == voteData.maxVotes &&
                      voteData.maxVotes != 0
                        ? "#000000"
                        : "#ffffff",
                    fontSize: 12,
                  }}
                >
                  <p>
                    {poll.option_b +
                      " (" +
                      Math.floor(
                        (voteData.votes[1] * 100) / voteData.total
                      ).toString() +
                      "%) "}
                    {voteData.votes[1].toString()} Vote(s)
                  </p>
                </div>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    width: "85%",
                    height: 30,
                    marginTop: 5,
                    border: "2px solid black",
                    background:
                      voteData.votes[2] == voteData.maxVotes &&
                      voteData.maxVotes != 0
                        ? "#ffffff"
                        : "#450C63",
                    borderRadius: 5,
                    textAlign: "center",
                    color:
                      voteData.votes[2] == voteData.maxVotes &&
                      voteData.maxVotes != 0
                        ? "#000000"
                        : "#ffffff",
                    fontSize: 12,
                  }}
                >
                  <p>
                    {poll.option_c +
                      " (" +
                      Math.floor(
                        (voteData.votes[2] * 100) / voteData.total
                      ).toString() +
                      "%) "}
                    {voteData.votes[2].toString()} Vote(s)
                  </p>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    width: "85%",
                    height: 30,
                    marginTop: 5,
                    border: "2px solid black",
                    background:
                      voteData.votes[3] == voteData.maxVotes &&
                      voteData.maxVotes != 0
                        ? "#ffffff"
                        : "#450C63",
                    borderRadius: 5,
                    textAlign: "center",
                    color:
                      voteData.votes[3] == voteData.maxVotes &&
                      voteData.maxVotes != 0
                        ? "#000000"
                        : "#ffffff",

                    fontSize: 12,
                  }}
                >
                  <p>
                    {poll.option_d +
                      " (" +
                      Math.floor(
                        (voteData.votes[3] * 100) / voteData.total
                      ).toString() +
                      "%) "}
                    {voteData.votes[3].toString()} Vote(s)
                  </p>
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
    }

    const pngBuffer = await sharp(Buffer.from(pollSvg))
      .toFormat("png")
      .toBuffer();

    res.setHeader("Content-Type", "image/png");
    res.setHeader("Cache-Control", "max-age=10");
    res.send(pngBuffer);
  } catch (e) {
    console.log("ERROR IN FRAMES IMAGE API:");
    console.log(e);
  }
}
