import Head from "next/head";
import { Metadata, ResolvingMetadata } from "next";
import PollPageWrapper from "@/components/PollPage/PollPageWrapper";

async function getPoll(id: string): Promise<any> {}

type Props = {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
};
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
export async function generateMetadata(
  { params, searchParams }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const id = params.id;
  const poll = polls[parseInt(id)];

  const fcMetadata: Record<string, string> = {
    "fc:frame": "vNext",
    "fc:frame:post_url": `${process.env["HOST"]}/api/vote?id=${id}`,
    "fc:frame:image": `${process.env["HOST"]}/api/image?id=${id}`,
  };

  poll.options
    .filter((o) => o.text !== "")
    .map((option, index) => {
      fcMetadata[`fc:frame:button:${index + 1}`] = option.text;
    });

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
function getMeta(poll: any) {
  // This didn't work for some reason
  return (
    <Head>
      <meta property="og:image" content="" key="test"></meta>
      <meta property="og:title" content="My page title" key="title" />
    </Head>
  );
}

export default function PollPage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: {
    result: string;
  };
}) {
  return (
    process.env["HOST"] && (
      <PollPageWrapper
        id={params.id}
        result={JSON.parse(
          searchParams.result == "true" ? searchParams.result : "false"
        )}
      />
    )
  );
}
