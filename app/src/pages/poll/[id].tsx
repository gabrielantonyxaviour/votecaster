import React, { useEffect } from "react";

import Head from "next/head";
import { Metadata, ResolvingMetadata } from "next";
import { useRouter } from "next/router";

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

export default function PollPage() {
  const router = useRouter();
  const id = parseInt(
    router.query.id != undefined ? (router.query.id as string) : "0"
  );
  return (
    process.env["HOST"] && (
      <>
        <Head>
          <meta property="fc:frame" content="vNext" />
          <meta
            property="fc:frame:post_url"
            content={`https://priv-cast.vercel.app/api/vote?id=${id}`}
          />
          <meta
            property="fc:frame:image"
            content={`https://priv-cast.vercel.app/api/image?id=${id}`}
          />
          <meta
            property="og:image"
            content={`https://priv-cast.vercel.app/api/image?id=${id}`}
          />
          <meta property="og:title" content={polls[id].question} />
          {polls[id].options
            .map((option) => option.text)
            .filter((o) => o !== "")
            .map((option, index) => {
              return (
                <meta
                  key={index}
                  property={`fc:frame:button:${index + 1}`}
                  content={option}
                />
              );
            })}
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" />
          <link
            href="https://fonts.googleapis.com/css2?family=Londrina+Solid:wght@300;400;900&family=PT+Sans&display=swap"
            rel="stylesheet"
          />
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" />
          <link
            href="https://fonts.googleapis.com/css2?family=Tektur:wght@400;500;600;700;800;900&display=swap"
            rel="stylesheet"
          />
        </Head>
        <div>
          <p>
            {JSON.stringify({
              "fc:frame": "vNext",
              "fc:frame:post_url": `${process.env["HOST"]}/api/vote?id=${id}`,
              "fc:frame:image": `${process.env["HOST"]}/api/image?id=${id}`,
              "og:image:": `${process.env["HOST"]}/api/image?id=${id}`,
              "og:title": polls[id].question,
              "fc:frame:button:1": "JavaScript",
              "fc:frame:button:2": "Python",
              "fc:frame:button:3": "Java",
              "fc:frame:button:4": "C++",
            })}
          </p>{" "}
        </div>
      </>
    )
  );
}
