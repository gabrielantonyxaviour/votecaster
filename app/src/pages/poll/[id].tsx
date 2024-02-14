import Head from "next/head";
import { Metadata, ResolvingMetadata } from "next";
import PollPageComponent from "@/components/PollPageComponent";

export default function PollPage() {
  return process.env["HOST"] && <PollPageComponent />;
}
