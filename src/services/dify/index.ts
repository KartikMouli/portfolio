import type {
  IOnCompleted,
  IOnData,
  IOnError,
  IOnFile,
  IOnMessageEnd,
  IOnMessageReplace,
  IOnNodeFinished,
  IOnNodeStarted,
  IOnThought,
  IOnWorkflowFinished,
  IOnWorkflowStarted,
} from './base';
import { get, post, ssePost } from './base';
import type { Feedbacktype } from '@/types/app';

export const sendChatMessage = async (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  body: Record<string, any>,
  {
    onData,
    onCompleted,
    onThought,
    onFile,
    onError,
    getAbortController,
    onMessageEnd,
    onMessageReplace,
    onWorkflowStarted,
    onNodeStarted,
    onNodeFinished,
    onWorkflowFinished,
  }: {
    onData: IOnData;
    onCompleted: IOnCompleted;
    onFile: IOnFile;
    onThought: IOnThought;
    onMessageEnd: IOnMessageEnd;
    onMessageReplace: IOnMessageReplace;
    onError: IOnError;
    getAbortController?: (abortController: AbortController) => void;
    onWorkflowStarted: IOnWorkflowStarted;
    onNodeStarted: IOnNodeStarted;
    onNodeFinished: IOnNodeFinished;
    onWorkflowFinished: IOnWorkflowFinished;
  }
) => {
  return ssePost(
    'chat-messages',
    {
      body: {
        ...body,
        response_mode: 'streaming',
      },
    },
    {
      onData,
      onCompleted,
      onThought,
      onFile,
      onError,
      getAbortController,
      onMessageEnd,
      onMessageReplace,
      onNodeStarted,
      onWorkflowStarted,
      onWorkflowFinished,
      onNodeFinished,
    }
  );
};

export const fetchConversations = async () => {
  return get('conversations', { params: { limit: 100, first_id: '' } });
};

export const fetchChatList = async (conversationId: string) => {
  return get('messages', {
    params: { conversation_id: conversationId, limit: 20, last_id: '' },
  });
};

// init value. wait for server update
export const fetchAppParams = async () => {
  return get('parameters');
};

export const updateFeedback = async ({
  url,
  body,
}: {
  url: string;
  body: Feedbacktype;
}) => {
  return post(url, { body });
};

export const generationConversationName = async (id: string) => {
  return post(`conversations/${id}/name`, { body: { auto_generate: true } });
};

export const fetchSuggestedQuestions = async (messageId: string) => {
  return get(`messages/${messageId}/suggested`);
};

export const stopChatMessage = async (taskId: string) => {
  return post(`chat-messages/${taskId}/stop`);
};

export const audioToText = async (formData: FormData) => {
  return post<{ text: string }>('audio-to-text', { body: formData });
};

export const textToAudio = async (
  text: string,
  messageId: string,
  voice?: string
) => {
  return post<Blob>('text-to-audio', {
    body: { text, message_id: messageId, voice },
  });
};

export interface FileUploadResponse {
  id: string;
  name: string;
  size: number;
  extension: string;
  mime_type: string;
  created_by: string;
  created_at: number;
}

export const uploadFile = async (formData: FormData) => {
  return post<FileUploadResponse>('file-upload', { body: formData });
};
