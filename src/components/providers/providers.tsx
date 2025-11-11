'use client';

import { Suspense } from 'react';
import { ThemeProvider } from '@/context/theme/theme-provider';
import { ChatProvider } from '../../context/chatbot/chat-context';
import Chatbot from '../chatbot';
import { Toaster } from '../ui/sonner';
import { QueryProvider } from '../../context/query-provider';

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
      <QueryProvider>
        <ChatProvider>
          {children}
          <Toaster richColors />
          <Suspense fallback={null}>
            <Chatbot />
          </Suspense>
        </ChatProvider>
      </QueryProvider>
    </ThemeProvider>
  );
}
