import Head from "next/head";
import { Metadata, ResolvingMetadata } from "next";
import PollPageWrapper from "@/components/PollPage/PollPageWrapper";
import getPoll from "@/utils/supabase/getPoll";

type Props = {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
};
const polls = [
  {
    question: "Which programming language do you prefer?",
    options: [
      { key: 1, text: "Barcelona", percentOfTotal: 30 },
      { key: 2, text: "Real Madrid", percentOfTotal: 25 },
      { key: 3, text: "Atletico Madrid", percentOfTotal: 20 },
      { key: 4, text: "Girona", percentOfTotal: 25 },
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
  console.log(id);
  const { response } = await getPoll({ pollId: id });
  if (response == null || response == undefined || response.length == 0) {
    console.log("No poll found");

    return {
      title: "No poll found",
      openGraph: {
        title: "No poll found",
      },
    };
  } else {
    const fcMetadata: Record<string, string> = {
      "fc:frame": "vNext",
      "fc:frame:post_url": `${process.env["HOST"]}/api/vote?id=${id}`,
      "fc:frame:image": `${process.env["HOST"]}/api/image?id=${id}`,
      "fc:frame:button:1": "Vote",
      "fc:frame:button:1:action": "post_redirect",
      "fc:frame:button:2": "View Results",
    };

    return {
      title: response.question,
      openGraph: {
        title: response.question,
        images: [`/api/image?id=${id}`],
      },
      other: {
        ...fcMetadata,
      },
      metadataBase: new URL(process.env["HOST"] || ""),
    };
  }
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
    results: string;
  };
}) {
  return (
    process.env["HOST"] && (
      <PollPageWrapper
        id={params.id}
        result={JSON.parse(
          searchParams.results == "true" ? searchParams.results : "false"
        )}
      />
    )
  );
}
