'use client';
import { Button } from '../../ui/button';
import { Bot, X } from 'lucide-react';
import { useChatbot } from '../../../context/chatbot/chat-context';

export function ChatTrigger() {
  const { isVisible, isOpen, setIsOpen } = useChatbot();

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 right-4 z-100 flex items-center">
      <Button
        size="icon"
        className="rounded-full w-11 h-11 bg-primary text-primary-foreground shadow-lg hover:bg-primary/90 hover:scale-105 hover:shadow-xl transition-all duration-200 hover:cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="h-6 w-6" /> : <Bot className="h-6 w-6" />}
      </Button>
    </div>
  );
}
