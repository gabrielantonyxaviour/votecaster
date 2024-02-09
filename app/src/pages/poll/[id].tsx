import React, { useEffect } from "react";

import Head from "next/head";
import { Metadata, ResolvingMetadata } from "next";
type Props = {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

const poll = {
  question: "Which programming language do you prefer?",
  options: [
    { key: 1, text: "JavaScript", percentOfTotal: 30 },
    { key: 2, text: "Python", percentOfTotal: 25 },
    { key: 3, text: "Java", percentOfTotal: 20 },
    { key: 4, text: "C++", percentOfTotal: 25 },
  ],
};

export async function generateMetadata(
  { params, searchParams }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  // read route params
  const id = params.id;
  // const poll = await getPoll(id);

  const fcMetadata: Record<string, string> = {
    "fc:frame": "vNext",
    "fc:frame:post_url": `${process.env["HOST"]}/api/vote?id=${id}`,
    "fc:frame:image": `${process.env["HOST"]}/api/image?id=${id}`,
    "og:image:": `${process.env["HOST"]}/api/image?id=${id}`,
    "og:title": poll.question,
  };
  poll.options
    .map((option) => option.text)
    .filter((o) => o !== "")
    .map((option, index) => {
      fcMetadata[`fc:frame:button:${index + 1}`] = option;
    });
  console.log(fcMetadata);
  return {
    title: poll.question,
    openGraph: {
      title: poll.question,
      images: [`/api/image?id=${id}`],
    },
    other: {
      ...fcMetadata,
    },
    metadataBase: new URL(process.env["HOST"] || ""),
  };
}

export default function PollPage() {
  return (
    <div>
      <p>
        {JSON.stringify({
          "fc:frame": "vNext",
          "fc:frame:post_url": `${process.env["HOST"]}/api/vote?id=2`,
          "fc:frame:image": `${process.env["HOST"]}/api/image?id=2`,
        })}
      </p>{" "}
    </div>
  );
}
