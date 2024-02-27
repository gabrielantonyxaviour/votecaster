import Head from "next/head";
import { Metadata, ResolvingMetadata } from "next";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_KEY ?? "";
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function getPoll(pollId: string): Promise<any> {
  try {
    const { data: fetchedPoll, error: fetchError } = await supabase
      .from("polls_secret")
      .select("*")
      .eq("id", pollId);

    console.log(fetchedPoll);

    if (fetchError || fetchedPoll == null || fetchedPoll.length === 0) {
      return {
        message: "Poll does not exist",
        response: null,
      };
    } else {
      return {
        message: "Success",
        response: fetchedPoll[0],
      };
    }
  } catch (error) {
    console.error("Error getting poll:", error);
    return { message: "Internal Server Error", response: null };
  }
}

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

export default function PollPage({ params }: { params: { id: string } }) {
  const poll = getPoll(params.id);
  console.log(poll);
  return (
    process.env["HOST"] && (
      <div>
        <p>
          {JSON.stringify({
            "fc:frame": "vNext",
            "fc:frame:post_url": `${process.env["HOST"]}/api/vote?id=${params.id}`,
            "fc:frame:image": `${process.env["HOST"]}/api/image?id=${params.id}`,
            "og:image:": `${process.env["HOST"]}/api/image?id=${params.id}`,
            "og:title": polls[parseInt(params.id)].question,
            "fc:frame:button:1": "JavaScript",
            "fc:frame:button:2": "Python",
            "fc:frame:button:3": "Java",
            "fc:frame:button:4": "C++",
          })}
        </p>
      </div>
    )
  );
}
