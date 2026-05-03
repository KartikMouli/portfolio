'use client';

import { ThemeProvider } from '@/context/theme/theme-provider';
import { Toaster } from '../ui/sonner';

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      {children}
      <Toaster richColors position="bottom-left" />
    </ThemeProvider>
  );
}
