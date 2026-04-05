'use client';
import { Button } from '../../ui/button';
import { Avatar, AvatarFallback } from '../../ui/avatar';
import { Bot, X } from 'lucide-react';
import { CardHeader, CardTitle } from '../../ui/card';
import { useChatbot } from '../../../context/chatbot/chat-context';

export function ChatHeader() {
  const { setIsOpen } = useChatbot();

  return (
    <CardHeader className="p-4 pb-3 border-b bg-muted/30">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-primary/20 text-primary">
              <Bot className="h-4 w-4" />
            </AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-base font-medium">
              Kartik&apos;s AI Assistant
            </CardTitle>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => setIsOpen(false)}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </CardHeader>
  );
}
