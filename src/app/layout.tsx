import type { Metadata } from "next";
import { Raleway } from "next/font/google";
import "./globals.css";

import Header from "@/components/Header";
import Footer from "@/components/Footer";

const raleway = Raleway({ subsets: ["latin"] });


export const metadata: Metadata = {
  title: "Kartik's Portfolio",
  description: "",
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
        <Header/>
          {children}
        <Footer/>
      </body>
    </html>
  );
}
