import type { Metadata } from "next";
import { Raleway } from "next/font/google";
import "./globals.css";

import Header from "@/components/Header";
import Footer from "@/components/Footer";

import { Analytics } from '@vercel/analytics/react';
import { ThemeProvider } from "@/components/theme-provider";
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
    google: "AY_tNfWVLsBZCnrbEeAyG93iDeRouDolzW8EonaejmQ", // Replace with Google site verification code
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
          <main className="flex-grow">
            {children}
            <Analytics />
          </main>
          <Toaster />
          <Footer />
        </ThemeProvider>

      </body>
    </html >
  );
}
