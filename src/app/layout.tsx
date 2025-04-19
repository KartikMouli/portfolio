import type { Metadata } from "next";
import { Raleway } from "next/font/google";
import "./globals.css";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Chatbot from "@/components/chatbot/Chatbot";

import { SpeedInsights } from "@vercel/speed-insights/next"
import { Analytics } from '@vercel/analytics/react';
import { ThemeProvider } from "@/components/theme/theme-provider";
import { Toaster } from "@/components/ui/toaster"



const raleway = Raleway({
  subsets: ["latin"],
  display: 'swap', // Ensures a fallback font is displayed until the font loads
});


export const metadata: Metadata = {
  title: "Kartik's Portfolio", 
  description: "Showcasing Kartik's projects and skills.", 
  openGraph: {
    title: "Kartik's Portfolio",
    description: "Personal portfolio showcasing projects and skills.",
    url: "https://kartikmoulidev.vercel.app", 
    siteName: "Kartik's Portfolio",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
  twitter: {
    card: "summary_large_image",
    title: "Kartik's Portfolio",
    description: "Showcasing Kartik's projects and skills.",
  },
  verification: {
    google: "AY_tNfWVLsBZCnrbEeAyG93iDeRouDolzW8EonaejmQ", 
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
        className={`${raleway.className} mx-auto flex min-h-screen max-w-3xl flex-col px-8 pb-16 antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Header />
          <main className="grow">
            {children}
            <Analytics endpoint="https://kartikmoulidev.vercel.app/_vercel/insights" />
            <SpeedInsights/>
          </main>
          <Toaster />
          <Chatbot />
          <Footer />
        </ThemeProvider>

      </body>
    </html >
  );
}
