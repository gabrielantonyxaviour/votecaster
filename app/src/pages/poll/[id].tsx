import React, { useEffect, useState } from "react";

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

  const [pollId, setPollId] = useState(undefined as number | undefined);
  useEffect(() => {
    if (router.query.id != undefined) {
      setPollId(parseInt(router.query.id as string));
      console.log(router.query.id);

      const metaTags = [
        { property: "fc:frame", content: "vNext" },
        {
          property: "fc:frame:post_url",
          content: `${process.env.HOST}/api/vote?id=${parseInt(
            router.query.id as string
          )}`,
        },
        {
          property: "fc:frame:image",
          content: `${process.env.HOST}/api/image?id=${parseInt(
            router.query.id as string
          )}`,
        },
        {
          property: "og:image",
          content: `${process.env.HOST}/api/image?id=${parseInt(
            router.query.id as string
          )}`,
        },
        {
          property: "og:title",
          content: polls[parseInt(router.query.id as string)].question,
        },
        ...polls[parseInt(router.query.id as string)].options
          .map((option) => option.text)
          .filter((o) => o !== "")
          .map((option, index) => {
            return {
              property: `fc:frame:button:${index + 1}`,
              content: option,
            };
          }),
      ];
      metaTags.forEach((tag) => {
        const existingTag = document.querySelector(
          `meta[property="${tag.property}"]`
        );
        if (existingTag) {
          existingTag.setAttribute("content", tag.content);
        } else {
          const newTag = document.createElement("meta");
          newTag.setAttribute("property", tag.property);
          newTag.setAttribute("content", tag.content);
          document.head.appendChild(newTag);
        }
      });
      // Cleanup function to remove old meta tags (optional)
      return () => {
        metaTags.forEach((tag) => {
          const existingTag = document.querySelector(
            `meta[property="${tag.property}"]`
          );
          if (existingTag) {
            existingTag.remove();
          }
        });
      };
    }
  }, [router.query]);
  return (
    pollId != undefined &&
    process.env["HOST"] && (
      <div>
        <p>
          {JSON.stringify({
            "fc:frame": "vNext",
            "fc:frame:post_url": `${process.env["HOST"]}/api/vote?id=${pollId}`,
            "fc:frame:image": `${process.env["HOST"]}/api/image?id=${pollId}`,
            "og:image:": `${process.env["HOST"]}/api/image?id=${pollId}`,
            "og:title": polls[pollId].question,
            "fc:frame:button:1": "JavaScript",
            "fc:frame:button:2": "Python",
            "fc:frame:button:3": "Java",
            "fc:frame:button:4": "C++",
          })}
        </p>{" "}
      </div>
    )
  );
}
