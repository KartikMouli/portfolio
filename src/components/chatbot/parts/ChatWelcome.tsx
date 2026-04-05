'use client';
import { Avatar, AvatarFallback } from '../../ui/avatar';
import { Bot } from 'lucide-react';

export function ChatWelcome() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center text-center px-4 py-8 opacity-70 animate-in fade-in zoom-in-95 duration-500">
      <Avatar className="h-12 w-12 mb-4 border-4 border-background shadow-md bg-secondary/30">
        <AvatarFallback className="bg-primary/20 text-primary">
          <Bot className="h-6 w-6" />
        </AvatarFallback>
      </Avatar>
      <h3 className="text-sm font-semibold mb-1 tracking-tight">
        How can I help you today?
      </h3>
      <p className="text-sm text-muted-foreground leading-relaxed px-5">
        Ask me anything about my experience, skills, or background.
      </p>
    </div>
  );
}
