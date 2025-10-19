'use client';

import Link from 'next/link';
import { Separator } from '@/components/ui/separator';
import Socials from '../socials';

export default function Footer() {
  return (
    <footer className="flex flex-col items-center justify-center sm:flex-row-reverse sm:justify-between px-6 py-8 border-t border-border/40 mt-12">
      <div className="mb-6 sm:mb-0">
        <Socials />
      </div>

      <section className="flex flex-col items-center sm:items-start gap-3 text-sm text-muted-foreground/80">
        <div className="flex flex-wrap items-center justify-center gap-2">
          <span>&copy; {new Date().getFullYear()} </span>
          <span>
            <Link className="hover:text-foreground transition-colors" href="/">
              kartik-portfolio
            </Link>
          </span>
          <Separator orientation="vertical" className="h-4" />
          <span>
            <Link
              className="hover:text-foreground hover:cursor-pointer transition-colors"
              href="/privacy"
            >
              Privacy Policy
            </Link>
          </span>
        </div>
      </section>
    </footer>
  );
}
