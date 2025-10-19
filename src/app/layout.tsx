import type { Metadata } from 'next';
import { Raleway } from 'next/font/google';
import './globals.css';
import Header from '@/components/layout-content/header';
import Footer from '@/components/layout-content/footer';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Analytics } from '@vercel/analytics/react';
import { Providers } from '@/components/providers/providers';

const raleway = Raleway({
  subsets: ['latin'],
  display: 'swap', // Ensures a fallback font is displayed until the font loads
});

export const metadata: Metadata = {
  title: "Kartik's Portfolio",
  description: "Showcasing Kartik's projects and skills.",
  openGraph: {
    title: "Kartik's Portfolio",
    description: 'Personal portfolio showcasing projects and skills.',
    url: 'https://kartikmoulidev.vercel.app',
    siteName: "Kartik's Portfolio",
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  },
  twitter: {
    card: 'summary_large_image',
    title: "Kartik's Portfolio",
    description: "Showcasing Kartik's projects and skills.",
  },
  verification: {
    google: process.env.GOOGLE_VERIFICATION_CODE,
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={`${raleway.className} mx-auto flex min-h-screen max-w-3xl flex-col pt-20 px-8 pb-16 antialiased`}
      >
        <Providers>
          <Header />
          <main className="grow">
            {children}
            <Analytics />
            <SpeedInsights />
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
