'use client';
import {
  createContext,
  ReactNode,
  useContext,
  useState,
  useRef,
  useEffect,
} from 'react';
import { useChatMessages } from '../../hooks/dify/use-chat-message';
import { audioToText, textToAudio, uploadFile } from '@/services/dify';
import { TransferMethod, type VisionFile } from '@/types/app';
import {
  validateFileUpload,
  validateRemoteUrl,
} from '@/lib/validation/chatbot';
import { toast } from 'sonner';
// @ts-expect-error - no type declarations available
import MicRecorder from 'mic-recorder-to-mp3';

interface ChatContextType {
  // Global Visibility (Trigger)
  isVisible: boolean;
  toggleChatbotVisibility: () => void;

  // UI State (Window)
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  showScrollButton: boolean;
  setShowScrollButton: (show: boolean) => void;

  // Dify Message State
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  messages: any[];
  isSending: boolean;
  isMessagesLoading: boolean;
  isParamsLoaded: boolean;
  apiError: boolean;
  suggestedQuestions: string[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  appParams: any;

  // Handlers
  sendMessage: (message: string, files?: VisionFile[]) => void;
  stopResponding: () => void;
  handleSendMessage: () => void;
  onFeedback: (id: string, rating: 'like' | 'dislike') => void;
  handleFaqClick: (question: string) => void;
  scrollToBottom: () => void;
  handleScroll: (target: HTMLElement) => void;

  // Input State
  input: string;
  setInput: (input: string) => void;

  // File Upload State
  visionFiles: VisionFile[];
  isUploading: boolean;
  urlInput: string;
  setUrlInput: (url: string) => void;
  isMediaPopoverOpen: boolean;
  setIsMediaPopoverOpen: (open: boolean) => void;
  handleFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  handleAddUrl: () => void;
  removeVisionFile: (index: number) => void;
  fileInputRef: React.RefObject<HTMLInputElement | null>;

  // Audio State
  isRecording: boolean;
  mediaRecorder: MediaRecorder | null;
  startRecording: () => Promise<void>;
  stopRecording: () => Promise<void>;

  // TTS State
  playingMessageId: string | null;
  playTTS: (id: string, text: string) => Promise<void>;

  // Message Actions
  copiedMessageId: string | null;
  handleCopy: (id: string, text: string) => void;

  // Refs
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
  scrollAreaRef: React.RefObject<HTMLDivElement | null>;
  isAutoScrollEnabledRef: React.MutableRefObject<boolean>;
  lastScrollTop: number;
  setLastScrollTop: (val: number) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const useChatbot = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChatbot must be used within a ChatProvider');
  }
  return context;
};

interface Props {
  children: ReactNode;
}

export function ChatProvider({ children }: Props) {
  // Visibility
  const [isVisible, setIsVisible] = useState(true);
  const toggleChatbotVisibility = () => setIsVisible(!isVisible);

  // Chat Window State
  const [isOpen, setIsOpen] = useState(false);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [lastScrollTop, setLastScrollTop] = useState(0);
  const [input, setInput] = useState('');

  // Dify Messages
  const {
    messages,
    sendMessage: difySendMessage,
    isSending,
    stopResponding,
    handleFeedback,
    suggestedQuestions,
    appParams,
    isParamsLoaded,
    isMessagesLoading,
    apiError,
  } = useChatMessages();

  // Refs
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isAutoScrollEnabledRef = useRef(true);

  // File Upload State
  const [visionFiles, setVisionFiles] = useState<VisionFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const [isMediaPopoverOpen, setIsMediaPopoverOpen] = useState(false);

  // Audio Recording State
  const [isRecording, setIsRecording] = useState(false);
  const recorderRef = useRef<MicRecorder | null>(null);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
    null
  );

  // TTS State
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);
  const [playingMessageId, setPlayingMessageId] = useState<string | null>(null);
  const hasStreamedRef = useRef(false);

  // Message Actions State
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);

  // Feature Flags
  // const _isFileUploadEnabled = appParams?.file_upload?.enabled;
  const isTtsEnabled = appParams?.text_to_speech?.enabled;

  // Handlers
  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedMessageId(id);
    toast.success('Message copied');
    setTimeout(() => setCopiedMessageId(null), 2000);
  };

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleScroll = (target: HTMLElement) => {
    if (!target) return;

    const isAtBottom =
      target.scrollHeight - target.scrollTop <= target.clientHeight + 100;
    setShowScrollButton(!isAtBottom);
    setLastScrollTop(target.scrollTop);

    // If user scrolled up, disable auto-scroll
    if (!isAtBottom) {
      isAutoScrollEnabledRef.current = false;
    } else {
      isAutoScrollEnabledRef.current = true;
    }
  };

  const handleSendMessage = () => {
    if (!input.trim() || isSending) return;
    const userMessage = input.trim();
    setInput('');
    const filesToAttached = [...visionFiles];
    setVisionFiles([]);
    isAutoScrollEnabledRef.current = true;
    difySendMessage(userMessage, filesToAttached);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !appParams) return;

    const validation = validateFileUpload(
      file,
      appParams.file_upload,
      visionFiles.length
    );
    if (!validation.success) {
      toast.error(validation.error || 'File validation failed');
      return;
    }

    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append('file', file);

      const fileResponse = await uploadFile(formData);
      const objectUrl = URL.createObjectURL(file);

      setVisionFiles((prev) => [
        ...prev,
        {
          id: fileResponse.id,
          type: 'image',
          transfer_method: TransferMethod.local_file,
          url: objectUrl,
          upload_file_id: fileResponse.id,
        },
      ]);
    } catch (_error) {
      toast.error('Failed to upload file');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleAddUrl = () => {
    if (!urlInput.trim() || !appParams) return;

    const validation = validateRemoteUrl(
      urlInput.trim(),
      appParams.file_upload,
      visionFiles.length
    );
    if (!validation.success) {
      toast.error(validation.error || 'URL validation failed');
      return;
    }

    setVisionFiles((prev) => [
      ...prev,
      {
        type: 'image',
        transfer_method: TransferMethod.remote_url,
        url: urlInput.trim(),
        upload_file_id: '',
      },
    ]);
    setUrlInput('');
  };

  const removeVisionFile = (index: number) => {
    setVisionFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const startRecording = async () => {
    try {
      const recorder = new MicRecorder({ bitRate: 128 });
      recorderRef.current = recorder;
      await recorder.start();

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const vizRecorder = new MediaRecorder(stream);
      vizRecorder.start();
      setMediaRecorder(vizRecorder);

      setIsRecording(true);
    } catch (_error) {
      toast.error('Microphone access denied or unavailable.');
    }
  };

  const stopRecording = async () => {
    const recorder = recorderRef.current;
    if (!recorder) return;

    if (mediaRecorder) {
      mediaRecorder.stop();
      mediaRecorder.stream.getTracks().forEach((t) => t.stop());
      setMediaRecorder(null);
    }

    try {
      setIsRecording(false);
      setIsUploading(true);
      const [, blob] = await recorder.stop().getMp3();
      const mp3File = new File([blob], 'recording.mp3', { type: 'audio/mp3' });
      const formData = new FormData();
      formData.append('file', mp3File);
      const result = await audioToText(formData);
      if (result && result.text) {
        setInput((prev) => (prev ? prev + ' ' + result.text : result.text));
      }
    } catch (_error) {
      toast.error('Failed to transcribe audio.');
    } finally {
      setIsUploading(false);
      recorderRef.current = null;
    }
  };

  const playTTS = async (id: string, text: string) => {
    if (playingMessageId === id && audioPlayerRef.current) {
      audioPlayerRef.current.pause();
      setPlayingMessageId(null);
      return;
    }

    try {
      setPlayingMessageId(id);
      const voice = appParams?.text_to_speech?.voice || 'english';
      const audioBlob = await textToAudio(text, id, voice);
      const audioUrl = URL.createObjectURL(audioBlob);

      if (audioPlayerRef.current) {
        audioPlayerRef.current.pause();
      }

      const audio = new Audio(audioUrl);
      audioPlayerRef.current = audio;
      audio.onended = () => setPlayingMessageId(null);
      audio.onerror = () => {
        toast.error('Failed to play audio.');
        setPlayingMessageId(null);
      };
      await audio.play();
    } catch (_e) {
      toast.error('Failed to fetch audio.');
      setPlayingMessageId(null);
    }
  };

  const handleFaqClick = (question: string) => {
    difySendMessage(question);
  };

  const onFeedback = (id: string, rating: 'like' | 'dislike') => {
    handleFeedback(id, { rating });
  };

  // Auto-scroll logic refined
  useEffect(() => {
    if (messagesEndRef.current && isOpen) {
      // If sending, only auto-scroll if enabled (user didn't override by scrolling up)
      if (isSending && isAutoScrollEnabledRef.current) {
        // Use scrollIntoView on the element itself rather than finding the viewport here
        // as it's the standard way and usually works within Radix scroll area
        messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [messages, isSending, isOpen]);

  // TTS Auto-play logic moved here
  useEffect(() => {
    if (isSending) {
      hasStreamedRef.current = true;
    }
  }, [isSending]);

  useEffect(() => {
    if (isTtsEnabled && appParams?.text_to_speech?.autoPlay === 'enabled') {
      const lastMessage = messages[messages.length - 1];
      if (
        lastMessage &&
        lastMessage.isAnswer &&
        lastMessage.content &&
        !isSending &&
        hasStreamedRef.current
      ) {
        hasStreamedRef.current = false;
        playTTS(lastMessage.id, lastMessage.content);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages.length, isSending, isTtsEnabled, appParams]);

  const value: ChatContextType = {
    isVisible,
    toggleChatbotVisibility,
    isOpen,
    setIsOpen,
    showScrollButton,
    setShowScrollButton,
    messages,
    isSending,
    isMessagesLoading,
    isParamsLoaded,
    apiError,
    suggestedQuestions,
    appParams,
    sendMessage: difySendMessage,
    stopResponding,
    handleSendMessage,
    onFeedback,
    handleFaqClick,
    scrollToBottom,
    handleScroll,
    input,
    setInput,
    visionFiles,
    isUploading,
    urlInput,
    setUrlInput,
    isMediaPopoverOpen,
    setIsMediaPopoverOpen,
    handleFileUpload,
    handleAddUrl,
    removeVisionFile,
    fileInputRef,
    isRecording,
    mediaRecorder,
    startRecording,
    stopRecording,
    playingMessageId,
    playTTS,
    copiedMessageId,
    handleCopy,
    messagesEndRef,
    scrollAreaRef,
    isAutoScrollEnabledRef,
    lastScrollTop,
    setLastScrollTop,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}
