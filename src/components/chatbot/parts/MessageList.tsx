'use client';
import { useEffect } from 'react';
import { ScrollArea } from '../../ui/scroll-area';
import { Button } from '../../ui/button';
import { ChevronDown } from 'lucide-react';
import { useChatbot } from '../../../context/chatbot/chat-context';
import { ChatMessage } from './ChatMessage';
import { ChatWelcome } from './ChatWelcome';
import { SuggestedQuestions } from './SuggestedQuestions';

export function MessageList() {
  const {
    messages,
    isMessagesLoading,
    isSending,
    showScrollButton,
    scrollToBottom,
    handleScroll,
    scrollAreaRef,
    messagesEndRef,
    lastScrollTop,
  } = useChatbot();

  // Restore scroll position on mount and handle manual scroll listener
  useEffect(() => {
    const scrollArea = scrollAreaRef.current;
    if (!scrollArea) return;

    const viewport = scrollArea.querySelector(
      '[data-radix-scroll-area-viewport]'
    ) as HTMLElement;
    if (!viewport) return;

    // 1. Attach manual scroll listener
    const onManualScroll = () => {
      handleScroll(viewport);
    };
    viewport.addEventListener('scroll', onManualScroll);

    // 2. Restore scroll position
    if (lastScrollTop > 0) {
      viewport.scrollTop = lastScrollTop;
    } else if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'auto' });
    }

    return () => {
      viewport.removeEventListener('scroll', onManualScroll);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only once on mount

  return (
    <ScrollArea className="flex-1" ref={scrollAreaRef}>
      <div className="p-3 space-y-4 pb-2 min-h-full flex flex-col justify-end">
        {messages.length === 0 && isMessagesLoading ? (
          <div className="absolute inset-0 w-full h-full flex flex-col items-center justify-center text-center px-4 py-8 opacity-70 z-10 bg-background/50">
            <div className="h-5 w-5 rounded-full border-2 border-primary border-t-transparent animate-spin mb-4" />
            <p className="text-sm font-medium animate-pulse">
              Syncing history...
            </p>
          </div>
        ) : null}

        {messages.length === 0 && !isSending && !isMessagesLoading && (
          <ChatWelcome />
        )}

        {messages.map((message, index) => (
          <ChatMessage
            key={message.id || index}
            message={message}
            index={index}
          />
        ))}

        <SuggestedQuestions />

        <div ref={messagesEndRef} />
      </div>

      {showScrollButton && (
        <div className="absolute bottom-5 right-4 z-10">
          <Button
            size="icon"
            variant="secondary"
            className="h-7 w-7 rounded-full shadow-md bg-background/90 backdrop-blur"
            onClick={scrollToBottom}
          >
            <ChevronDown className="h-3.5 w-3.5" />
          </Button>
        </div>
      )}
    </ScrollArea>
  );
}
