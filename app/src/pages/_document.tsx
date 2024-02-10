import type { Metadata } from "next";
import { Html, Head, Main, NextScript } from "next/document";

export const metadata: Metadata = {
  title: "MarkaGames",
  description: "In Game Asset Marketplace for Starknet",
};

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta property="fc:frame" content="vNext" />
        <meta
          property="fc:frame:post_url"
          content="https://priv-cast.vercel.app/api/vote?id=2"
        />
        <meta
          property="fc:frame:image"
          content="https://priv-cast.vercel.app/api/image?id=2"
        />
        <meta property="og:image" content="https://your-host/api/image?id=2" />
        <meta property="og:title" content="Your Poll Question" />
        <meta property="fc:frame:button:1" content="JavaScript" />
        <meta property="fc:frame:button:2" content="Python" />
        <meta property="fc:frame:button:3" content="Java" />
        <meta property="fc:frame:button:4" content="C++" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Londrina+Solid:wght@300;400;900&family=PT+Sans&display=swap"
          rel="stylesheet"
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Tektur:wght@400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
