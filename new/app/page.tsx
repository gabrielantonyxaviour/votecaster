"use client";
import Head from "next/head";

export default function HomePage() {
  return (
    <>
      <Head>
        <title>priv.cast | Home</title>
        <link rel="icon" href="/logo.png" />
      </Head>
      <main style={{ fontFamily: "Inter, sans-serif" }}>
        <div className="max-w-[1200px] mx-auto h-screen py-8"></div>
      </main>
    </>
  );
}
