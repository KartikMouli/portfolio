"use client";

import { Bot, BotOff } from "lucide-react";
import { Button } from "../ui/button";
import { useChatbot } from "../../context/chatbot/chat-context";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function ChatToggle() {
  const { isVisible, toggleChatbot } = useChatbot();

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button size="icon" variant="ghost" onClick={toggleChatbot} className="hover:cursor-pointer">
            {isVisible ? <Bot className="size-5" /> : <BotOff className="size-5" />}
            <span className="sr-only">Chat Toggle</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent className="bg-popover border p-2 text-popover-foreground">
          <p>{isVisible ? "click to hide chatbot" : "click to show chatbot"}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}