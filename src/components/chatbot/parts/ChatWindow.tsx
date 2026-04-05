'use client';
import { Card, CardContent } from '../../ui/card';
import { Bot, Loader2 } from 'lucide-react';
import { useChatbot } from '../../../context/chatbot/chat-context';
import { ChatHeader } from './ChatHeader';
import { MessageList } from './MessageList';
import { ChatInput } from './ChatInput';

export function ChatWindow() {
  const { isParamsLoaded, apiError, isOpen } = useChatbot();

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-[72px] right-4 z-100 max-w-[calc(100vw-2rem)] w-[450px]">
      <Card className="bg-background/90 backdrop-blur-md border shadow-2xl overflow-hidden flex flex-col max-h-[calc(100vh-120px)] h-[700px]">
        <ChatHeader />
        <CardContent className="p-0 flex-1 flex flex-col overflow-hidden relative">
          <div className="flex flex-col flex-1 overflow-hidden">
            {!isParamsLoaded ? (
              <div className="flex flex-col flex-1 items-center justify-center text-center p-8 opacity-70">
                <Loader2 className="h-5 w-5 animate-spin mb-4 text-primary" />
                <p className="text-sm font-medium">
                  Connecting to Assistant...
                </p>
              </div>
            ) : apiError ? (
              <div className="flex flex-col flex-1 items-center justify-center text-center p-8 opacity-70">
                <Bot className="h-9 w-9 text-destructive mb-3 opacity-80" />
                <h3 className="text-sm font-medium mb-1">
                  Chatbot Unavailable
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  We are having trouble connecting to the AI assistant right
                  now. Please try again later.
                </p>
              </div>
            ) : (
              <>
                <MessageList />
                <ChatInput />
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
