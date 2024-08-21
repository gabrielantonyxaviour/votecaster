import ComposerAction from "@/components/Composer";
import Head from "next/head";

export default function PollPage() {
  return (
    <>
      <Head>
        <title>Home</title>
      </Head>
      <main style={{ fontFamily: "Inter, sans-serif" }}>
        <div className="max-w-[800px] mx-auto h-screen ">
          <ComposerAction />
        </div>
      </main>
    </>
  );
}
