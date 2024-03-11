import { Metadata, ResolvingMetadata } from "next";
import PollPageWrapper from "@/components/PollPage/PollPageWrapper";
import getPoll from "@/utils/supabase/getPoll";

type Props = {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

export async function generateMetadata(
  { params, searchParams }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const id = params.id;
  const { response } = await getPoll({ pollId: id });
  if (response == null || response.length == 0 || response == undefined) {
    console.log("No poll found");
  }
  const fcMetadata: Record<string, string> = {
    "fc:frame": "vNext",
    "fc:frame:post_url": `${process.env["HOST"]}/api/vote?id=${id}`,
    "fc:frame:image": `${process.env["HOST"]}/api/image?id=${id}`,
    "fc:frame:button:1": "Vote",
    "fc:frame:button:1:action": "post_redirect",
    "fc:frame:button:2": "View Results",
  };

  return {
    title: response == null ? "NOT FOUND" : response.question,
    openGraph: {
      title: response == null ? "NIL" : response.question,
      images: [`/api/image?id=${id}`],
    },
    other: {
      ...fcMetadata,
    },
    metadataBase: new URL(process.env["HOST"] || ""),
  };
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
