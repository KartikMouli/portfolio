'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Message } from '../data/chatbot';
import { sendChatMessage } from '@/actions/chat';

export function useChatMessages() {
  const queryClient = useQueryClient();

  // Query for messages
  const { data: messages = [] } = useQuery<Message[]>({
    queryKey: ['chatMessages'],
    queryFn: async () => [],
    initialData: [],
  });

  // Mutation for sending messages
  const { mutate: sendMessage, isPending: isSending } = useMutation({
    mutationFn: async (message: string) => {
      const result = await sendChatMessage(message);

      if (result.error) {
        throw new Error(result.error);
      }

      return result.response!;
    },
    onMutate: (newMessage) => {
      const currentMessages =
        (queryClient.getQueryData(['chatMessages']) as Message[]) || [];
      queryClient.setQueryData(
        ['chatMessages'],
        [...currentMessages, { role: 'user', content: newMessage }]
      );
    },
    onSuccess: (response) => {
      const currentMessages =
        (queryClient.getQueryData(['chatMessages']) as Message[]) || [];
      queryClient.setQueryData(
        ['chatMessages'],
        [...currentMessages, { role: 'assistant', content: response }]
      );
    },
    onError: (error) => {
      console.error('Chat Error:', error);
      const currentMessages =
        (queryClient.getQueryData(['chatMessages']) as Message[]) || [];
      queryClient.setQueryData(
        ['chatMessages'],
        [
          ...currentMessages,
          {
            role: 'assistant',
            content: 'Sorry, I encountered an error. Please try again.',
          },
        ]
      );
    },
  });

  return {
    messages,
    sendMessage,
    isSending,
  };
}
