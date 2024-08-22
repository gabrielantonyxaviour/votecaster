"use client";
import ViewPollsPage from "@/components/ViewPolls";
import getPollsByCreator from "@/utils/supabase/getPollsByCreator";
import Head from "next/head";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";

export default function PollsPage() {
  const [pollUris, setPollUris] = useState<string[] | null>(null);
  const { address } = useAccount();
  useEffect(() => {
    console.log(address);
    if (address != undefined) {
      console.log("Fetching polls");
      (async function () {
        const { response: res } = await getPollsByCreator({ creator: address });
        console.log(res);
        if (res != null) {
          let temp = [];
          res.forEach(async (poll: any) => {
            const response = await fetch(
              `/api/visualize/${encodeURIComponent(
                poll.question
              )}/a/${encodeURIComponent(poll.option_a)}/b/${encodeURIComponent(
                poll.option_b
              )}/c/${encodeURIComponent(poll.option_c)}/d/${encodeURIComponent(
                poll.option_d
              )}/theme/${poll.theme}`
            ); // Get the HTML text from the response
            const html = await response.text();
            const regex =
              /<meta\s+property="fc:frame:image"\s+content="([^"]*)"/;
            const match = html.match(regex);
            if (match) {
              const metaTagContent = match[1];
              if (process.env.NEXT_PUBLIC_PRODUCTION == "true") {
                temp.push(metaTagContent);
              } else {
                const metaRegex = /\/api\/visualize\/.*/;
                const metaMatch = metaTagContent.match(metaRegex);
                if (metaMatch) {
                  temp.push(metaMatch[0]);
                } else {
                  console.log("No match found");
                }
              }
              setPollUris(temp);
            } else {
              console.log("Meta tag not found");
            }
          });
        }
      })();
    }
  }, [address]);
  useEffect(() => {
    console.log(pollUris);
  }, [pollUris]);
  return (
    <>
      <Head>
        <title>Your Polls</title>
        <link rel="icon" href="/logo.png" type="image/png" />
      </Head>
      <main style={{ fontFamily: "Inter, sans-serif" }}>
        <div className="max-w-[800px] mx-auto h-screen ">
          <ViewPollsPage pollUris={pollUris} />
        </div>
      </main>
    </>
  );
}
