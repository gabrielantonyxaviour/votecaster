"use client";
import Head from "next/head";
import Navbar from "@/components/WebPage/Navbar";
import Landing from "@/components/WebPage/Landing";

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
