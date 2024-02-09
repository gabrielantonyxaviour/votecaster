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
        <meta property="fc:frame:image" content="https://picsum.photos/200" />
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
