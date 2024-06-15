"use client";
import Head from "next/head";
import Navbar from "../components/Navbar";
import Landing from "../components/Landing";

export default function HomePage() {
  return (
    <>
      <Head>
        <title>priv.cast | Home</title>
      </Head>
      <main style={{ fontFamily: "Inter, sans-serif" }}>
        <div className="max-w-[1200px] mx-auto h-screen py-8">
          <Navbar />
          <Landing />
        </div>
      </main>
    </>
  );
}
