import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import GeneratedResumeInfoProvider from "../contexts/GeneratedResumeInfoContext";
import { Analytics } from "@vercel/analytics/react";
import Script from "next/script";
import { SessionProvider } from "next-auth/react";
import { auth } from "../auth";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Astro AI Resume Builder - Build Your Resume Instantly",
  description:
    "Create professional resumes and cover letters with AI-powered assistance. Fast, easy, and customizable.",
  applicationName: "Astro AI Resume Builder",
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "Astro AI Resume Builder",
    description: "Build your resume in seconds with AI.",
    url: process.env.NEXT_PUBLIC_SITE_URL,
    siteName: "Astro AI Resume Builder",
    images: [
      {
        url: `${process.env.NEXT_PUBLIC_SITE_URL}/assets/hero.png`,
        width: 1200,
        height: 630,
      },
    ],
    type: "website",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  // console.log(session)
  return (
    <SessionProvider session={session}>
      <html lang="en">
        <head>
          {/* Google Analytics */}
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=G-SZSYC3E625`}
            strategy="afterInteractive"
          />
          <Script id="google-analytics" strategy="afterInteractive">
            {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-SZSYC3E625');
          `}
          </Script>
        </head>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <GeneratedResumeInfoProvider>{children}</GeneratedResumeInfoProvider>
          <Analytics />
        </body>
      </html>
    </SessionProvider>
  );
}
