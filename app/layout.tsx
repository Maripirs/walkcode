import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "walkcode — LeetCode pattern practice",
  description: "Small, steady LeetCode pattern reps for walks.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
