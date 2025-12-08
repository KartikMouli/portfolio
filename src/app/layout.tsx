import type { Metadata } from 'next';
import { Raleway } from 'next/font/google';
import './globals.css';
import Header from '@/components/layout-content/header';
import Footer from '@/components/layout-content/footer';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Analytics } from '@vercel/analytics/react';
import { Providers } from '@/components/providers/providers';
import { JsonLd } from '@/components/seo/json-ld';

const raleway = Raleway({
  subsets: ['latin'],
  display: 'swap', // Ensures a fallback font is displayed until the font loads
});

export const metadata: Metadata = {
  metadataBase: new URL('https://kartikmouli.in'),
  title: {
    default: 'Kartik Mouli | Software Developer Portfolio',
    template: '%s | Kartik Mouli',
  },
  description:
    'Software Developer portfolio of Kartik Mouli. Explore projects built with React, Next.js, TypeScript, and modern web technologies. Available for freelance and full-time opportunities.',
  keywords: [
    'Kartik Mouli',
    'Software Developer',
    'React Developer',
    'Next.js Developer',
    'TypeScript',
    'JavaScript',
    'Web Developer',
    'Frontend Developer',
    'Backend Developer',
    'Portfolio',
    'Software Engineer',
  ],
  authors: [{ name: 'Kartik Mouli', url: 'https://kartikmouli.in' }],
  creator: 'Kartik Mouli',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://kartikmouli.in',
    siteName: "Kartik Mouli's Portfolio",
    title: 'Kartik Mouli | Software Developer Portfolio',
    description:
      'Software Developer portfolio showcasing projects built with React, Next.js, TypeScript, and modern web technologies.',
    images: [
      {
        url: '/img/pfp-avatar.jpg',
        width: 1200,
        height: 630,
        alt: "Kartik Mouli's Portfolio",
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Kartik Mouli | Software Developer Portfolio',
    description:
      'Software Developer portfolio showcasing projects built with React, Next.js, and TypeScript.',
    images: ['/img/pfp-avatar.jpg'],
    creator: '@KartikMouli',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: process.env.GOOGLE_VERIFICATION_CODE,
  },
  alternates: {
    canonical: 'https://kartikmouli.in',
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <JsonLd />
      </head>
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
