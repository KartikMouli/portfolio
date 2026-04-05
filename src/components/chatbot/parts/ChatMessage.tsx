'use client';
import { Avatar, AvatarFallback, AvatarImage } from '../../ui/avatar';
import {
  Bot,
  User,
  ThumbsUp,
  ThumbsDown,
  Square,
  Volume2,
  Copy,
  Check,
} from 'lucide-react';
import { Button } from '../../ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '../../ui/tooltip';
import { cn } from '@/lib/utils';
import StreamdownMarkdown from '../../streamdown-markdown/streamdown-markdown';
import { useChatbot } from '../../../context/chatbot/chat-context';
import { TypingIndicator } from './TypingIndicator';

interface ChatMessageProps {
  message: {
    isAnswer: boolean;
    id: string;
    content: string;
    message_files?: { url: string }[];
    feedback?: { rating: string };
  };
  index: number;
}

export function ChatMessage({ message, index }: ChatMessageProps) {
  const {
    isSending,
    onFeedback,
    playTTS,
    playingMessageId,
    handleCopy,
    copiedMessageId,
    appParams,
    messages,
  } = useChatbot();

  const isTtsEnabled = appParams?.text_to_speech?.enabled;

  return (
    <div
      className={cn(
        'flex gap-2 group',
        !message.isAnswer ? 'justify-end' : 'justify-start'
      )}
    >
      {message.isAnswer && (
        <Avatar className="h-7 w-7 mt-0.5 shrink-0">
          <AvatarImage
            src="/img/pfp-avatar.jpg"
            alt="Kartik"
            className="object-cover"
          />
          <AvatarFallback className="bg-primary/20 text-primary">
            <Bot className="h-3 w-3" />
          </AvatarFallback>
        </Avatar>
      )}
      <div
        className={cn(
          'flex flex-col gap-1 max-w-[85%] group',
          !message.isAnswer && 'items-end'
        )}
      >
        <div className="flex flex-col relative">
          <div
            className={cn(
              'rounded-2xl px-3 py-2 text-sm font-sans shadow-sm transition-all',
              !message.isAnswer
                ? 'bg-zinc-200 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 rounded-tr-sm'
                : 'bg-background/40 backdrop-blur-md border border-border/50 text-foreground dark:bg-zinc-300 dark:border-none dark:text-zinc-950 rounded-tl-sm'
            )}
          >
            {message.message_files && message.message_files.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-2">
                {message.message_files.map(
                  (mf: { url: string }, mfIdx: number) => (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      key={mfIdx}
                      src={mf.url}
                      alt="attached"
                      loading="lazy"
                      className="w-40 h-40 object-cover rounded-md border"
                    />
                  )
                )}
              </div>
            )}
            {isSending &&
            message.isAnswer &&
            !message.content &&
            index === messages.length - 1 ? (
              <TypingIndicator />
            ) : (
              <StreamdownMarkdown content={message.content} />
            )}
          </div>
        </div>

        {!message.isAnswer && message.content && (
          <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => handleCopy(message.id, message.content)}
                >
                  {copiedMessageId === message.id ? (
                    <Check className="h-3 w-3 text-green-500" />
                  ) : (
                    <Copy className="h-3 w-3" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top" className="z-110">
                <p className="text-sm">Copy message</p>
              </TooltipContent>
            </Tooltip>
          </div>
        )}

        {/* Feedback Actions for Assistant */}
        {message.isAnswer && message.content && (
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn(
                    'h-6 w-6',
                    message.feedback?.rating === 'like' && 'text-green-500'
                  )}
                  onClick={() => onFeedback(message.id, 'like')}
                >
                  <ThumbsUp className="h-3 w-3" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top" className="z-110">
                <p className="text-sm">Good response</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn(
                    'h-6 w-6',
                    message.feedback?.rating === 'dislike' && 'text-red-500'
                  )}
                  onClick={() => onFeedback(message.id, 'dislike')}
                >
                  <ThumbsDown className="h-3 w-3" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top" className="z-110">
                <p className="text-sm">Poor response</p>
              </TooltipContent>
            </Tooltip>

            {isTtsEnabled && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className={cn(
                      'h-6 w-6',
                      playingMessageId === message.id &&
                        'text-primary animate-pulse'
                    )}
                    onClick={() => playTTS(message.id, message.content)}
                  >
                    {playingMessageId === message.id ? (
                      <Square className="h-3 w-3 fill-current" />
                    ) : (
                      <Volume2 className="h-3 w-3" />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top" className="z-110">
                  <p className="text-sm">
                    {playingMessageId === message.id ? 'Stop audio' : 'Listen'}
                  </p>
                </TooltipContent>
              </Tooltip>
            )}

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => handleCopy(message.id, message.content)}
                >
                  {copiedMessageId === message.id ? (
                    <Check className="h-3 w-3 text-green-500" />
                  ) : (
                    <Copy className="h-3 w-3" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top" className="z-110">
                <p className="text-sm">Copy message</p>
              </TooltipContent>
            </Tooltip>
          </div>
        )}
      </div>
      {!message.isAnswer && (
        <Avatar className="h-8 w-8 mt-0.5 shrink-0">
          <AvatarFallback className="bg-secondary">
            <User className="h-5 w-5" />
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  );
}
