'use client';

import { Home } from 'lucide-react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-4xl mx-auto text-center">
        {/* 404 Display */}
        <div className="relative mb-8">
          <h1 className="text-8xl md:text-9xl font-bold bg-clip-text text-transparent bg-linear-to-r from-primary to-blue-600 dark:from-blue-400 dark:to-purple-400">
            404
          </h1>
        </div>

        {/* Content */}
        <div className="space-y-6">
          <h2 className="text-4xl font-bold">Page Not Found</h2>

          <p className="text-lg text-muted-foreground max-w-md mx-auto">
            Oops! Looks like you&apos;ve ventured into uncharted territory.
            Don&apos;t worry, even the best explorers get lost sometimes.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
            <Link href="/">
              <button className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium flex items-center gap-2 hover:opacity-90 transition-all">
                <Home className="w-4 h-4" />
                Return Home
              </button>
            </Link>

            <Link href="/contact">
              <button className="px-6 py-3 border border-input rounded-lg font-medium hover:bg-accent hover:text-accent-foreground transition-colors">
                Report This Issue
              </button>
            </Link>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute inset-0 bg-grid-primary/5 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />
        </div>
      </div>
    </div>
  );
}
