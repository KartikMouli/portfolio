import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Message } from '../data/chatbot';
import axios from 'axios';

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
      try {
        const response = await axios.post('/api/chat', { message });
        return response.data.response;
      } catch (error) {
        console.error('Chat API Error:', error);
        throw error;
      }
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
