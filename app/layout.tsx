import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import GeneratedResumeInfoProvider from "../contexts/GeneratedResumeInfoContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Astro",
  description:
    "Leverage advanced AI technology to create a professional resume that truly reflects your skills and experience. Our platform simplifies the process so you can stand out in the competitive job market.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <GeneratedResumeInfoProvider>{children}</GeneratedResumeInfoProvider>
      </body>
    </html>
  );
}
