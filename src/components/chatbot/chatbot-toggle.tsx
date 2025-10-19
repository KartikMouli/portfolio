'use client';

import { Bot, BotOff } from 'lucide-react';
import { Button } from '../ui/button';
import { useChatbot } from '../../context/chatbot/chat-context';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

export default function ChatToggle() {
  const { isVisible, toggleChatbot } = useChatbot();

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            size="icon"
            variant="link"
            onClick={toggleChatbot}
            className="hover:cursor-pointer relative z-[60]"
          >
            {isVisible ? (
              <Bot className="size-5" />
            ) : (
              <BotOff className="size-5" />
            )}
            <span className="sr-only">Chat Toggle</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent className="bg-popover rounded-md border mt-1 text-popover-foreground">
          {isVisible ? 'Hide Chatbot' : 'Show Chatbot'}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
