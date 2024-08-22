"use client";
import ComposerAction from "@/components/Composer";
import Poll from "@/components/Poll";
import Head from "next/head";

export default function PollPage({ params }: { params: { id: string } }) {
  return (
    <>
      <Head>
        <title>priv.cast | Poll {params.id}</title>
        <link rel="icon" href="/logo.png" />
      </Head>
      <main style={{ fontFamily: "Inter, sans-serif" }}>
        <div className="max-w-[800px] mx-auto h-screen ">
          <Poll pollId={params.id as string} />
        </div>
      </main>
    </>
  );
}
