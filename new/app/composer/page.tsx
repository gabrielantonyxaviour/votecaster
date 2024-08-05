"use client";
import Head from "next/head";
import ComposerAction from "@/components/Composer";

export default function HomePage() {
  return (
    <>
      <Head>
        <title>priv.cast | Home</title>
      </Head>
      <main style={{ fontFamily: "Inter, sans-serif" }}>
        <div className="max-w-screen mx-auto max-h-screen ">
          <ComposerAction />
        </div>
      </main>
    </>
  );
}
