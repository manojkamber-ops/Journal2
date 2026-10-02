import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Iran Journal of Computer Science | Indexed in Scopus — ISSN 2520-8438",
  description:
    "Iran Journal of Computer Science (IJCS) — a quarterly, peer-reviewed, open-access journal covering AI, computer vision, networks & security, software engineering, and data science. Indexed in: Scopus (2018–2026). ISSN 2520-8438, eISSN 2520-8446.",
  keywords: [
    "Iran Journal of Computer Science", "IJCS", "computer science journal", "Scopus indexed journal",
    "Indexed in Scopus", "open access", "ISSN 2520-8438", "machine learning", "computer vision",
    "network security", "software engineering", "data science",
  ],
  authors: [{ name: "IJCS Editorial Office" }],
  openGraph: {
    title: "Iran Journal of Computer Science",
    description:
      "Quarterly peer-reviewed open-access computer science journal. Indexed in: Scopus (2018–2026).",
    siteName: "Iran Journal of Computer Science",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
