'use client';

import { AssistantRuntimeProvider } from '@assistant-ui/react';
import {
  AssistantChatTransport,
  useChatRuntime,
} from '@assistant-ui/react-ai-sdk';

/**
 * Wraps children with the assistant-ui runtime, transporting messages
 * over our `/api/chat` Route Handler. Pattern straight from the
 * assistant-modal docs — no customizations.
 *
 * Must be a client component: `useChatRuntime` owns state + hooks.
 * `AssistantChatTransport` defaults to `/api/chat` already, but we set
 * it explicitly so the relationship is greppable from this file.
 */
export function ChatRuntimeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const runtime = useChatRuntime({
    transport: new AssistantChatTransport({ api: '/api/chat' }),
  });

  return (
    <AssistantRuntimeProvider runtime={runtime}>
      {children}
    </AssistantRuntimeProvider>
  );
}
