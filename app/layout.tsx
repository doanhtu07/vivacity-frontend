import type { Metadata } from "next";

import { Inter } from "next/font/google";

import LoadBackground from "./components/LoadBackground";

import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Anh Tu Do",
  description: "Portfolio of Anh Tu Do",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <LoadBackground />

      <body className={inter.className}>{children}</body>
    </html>
  );
}
