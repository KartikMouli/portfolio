'use client';

import { useEffect, useState } from 'react';
import { MoonIcon, SunIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { useThemeToggle } from '@/components/ui/skiper-ui/skiper26';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

/**
 * Theme toggle that pairs Lucide Sun/Moon glyphs with skiper-ui/skiper26's
 * `useThemeToggle` hook. The hook drives the View Transitions API ripple
 * (variant=circle, start=top-right so the reveal originates from the navbar
 * corner where this button lives); we keep full control of the visible
 * markup, which is why we bypass skiper's hardcoded `ThemeToggleButton`.
 *
 * Hydration-safe: returns a same-sized placeholder until mounted to prevent
 * a layout shift and a wrong-icon flash on the first paint.
 */
export default function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { isDark, toggleTheme } = useThemeToggle({
    variant: 'circle',
    start: 'top-right',
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="size-9" aria-hidden />;
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            type="button"
            size="icon"
            variant="ghost"
            onClick={toggleTheme}
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            className="hover:cursor-pointer"
          >
            {isDark ? (
              <SunIcon className="size-5 text-orange-300" />
            ) : (
              <MoonIcon className="size-5" />
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent className="bg-popover border mt-1 text-popover-foreground">
          <p>{isDark ? 'Light Mode' : 'Dark Mode'}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
