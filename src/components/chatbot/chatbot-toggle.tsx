"use client";


import { Bot, BotOff } from "lucide-react";
import { Button } from "../ui/button";
import { useChatbot } from "./chat-context";


export default function ChatToggle() {
  const { isVisible, toggleChatbot } = useChatbot();

  return (
    <Button size="icon" variant="ghost" onClick={toggleChatbot}>
      {isVisible ? <Bot className="size-5" /> : <BotOff className="size-5" />}
      <span className="sr-only">Chat Toggle</span>
    </Button>
  );
}