import ComposerAction from "@/components/Composer";
import Poll from "@/components/Poll";
import Head from "next/head";

export default function PollPage() {
  return (
    <>
      <Head>
        <title>Home</title>
      </Head>
      <main style={{ fontFamily: "Inter, sans-serif" }}>
        <div className="max-w-[800px] mx-auto h-screen ">
          <Poll />
        </div>
      </main>
    </>
  );
}
