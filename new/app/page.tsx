"use client";
import Head from "next/head";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();
  useEffect(() => {
    router.push("/create");
  }, []);
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
