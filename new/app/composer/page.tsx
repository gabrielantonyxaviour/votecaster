"use client";
import Head from "next/head";
import Landing from "@/components/Composer/Landing";

export default function HomePage() {
  return (
    <>
      <Head>
        <title>priv.cast | Home</title>
      </Head>
      <main style={{ fontFamily: "Inter, sans-serif" }}>
        <div className="max-w-screen mx-auto max-h-screen ">
          <Landing />
        </div>
      </main>
    </>
  );
}
