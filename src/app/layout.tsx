import type { Metadata } from "next";
import { Raleway } from "next/font/google";
import "./globals.css";

import Header from "@/components/Header";
import Footer from "@/components/Footer";

import { Analytics } from '@vercel/analytics/react';

const raleway = Raleway({
  subsets: ["latin"],
  display: 'swap', // Ensures a fallback font is displayed until the font loads
});


export const metadata: Metadata = {
  title: "Kartik's Portfolio",
  description: "Personal portfolio showcasing projects and skills.",
  keywords: "Kartik, Portfolio, Web Development, Software Engineering, Projects"
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${raleway.className} mx-auto flex min-h-screen max-w-3xl flex-col px-8 pb-16 antialiased`}
      >
        <Header />
        <main className="flex-grow">
          {children}
          <Analytics />
        </main>
        <Footer />
      </body>
    </html>
  );
}
