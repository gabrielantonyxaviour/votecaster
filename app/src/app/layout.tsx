import * as React from "react";
import "@fortawesome/fontawesome-svg-core/styles.css";
import "@/styles/globals.css";
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
