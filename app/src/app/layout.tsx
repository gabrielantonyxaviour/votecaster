import "@/styles/globals.css";
import "@fortawesome/fontawesome-svg-core/styles.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <body>{children}</body>;
}
