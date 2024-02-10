import * as React from "react";
import "@/styles/globals.css";
import "@fortawesome/fontawesome-svg-core/styles.css";
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
