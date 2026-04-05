'use client';

import { Suspense } from 'react';
import { ThemeProvider } from '@/context/theme/theme-provider';
import { ChatProvider } from '../../context/chatbot/chat-context';
import Chatbot from '../chatbot';
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
      <ChatProvider>
        {children}
        <Toaster richColors position="bottom-left" />
        <Suspense fallback={null}>
          <Chatbot />
        </Suspense>
      </ChatProvider>
    </ThemeProvider>
  );
}
