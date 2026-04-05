'use client';
import { Button } from '../../ui/button';
import { useChatbot } from '../../../context/chatbot/chat-context';

export function SuggestedQuestions() {
  const { messages, suggestedQuestions, isSending, handleFaqClick } =
    useChatbot();

  if (
    !messages ||
    messages.length === 0 ||
    !suggestedQuestions ||
    suggestedQuestions.length === 0
  ) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-2 pt-2 animate-in fade-in slide-in-from-bottom-3 duration-500 ease-out">
      {suggestedQuestions.map((question, index) => (
        <Button
          key={index}
          variant="outline"
          size="sm"
          className="text-sm h-auto py-1.5 px-3 rounded-full transition-all shadow-sm border-primary/20 cursor-pointer"
          onClick={() => handleFaqClick(question)}
          disabled={isSending}
        >
          <span>{question}</span>
        </Button>
      ))}
    </div>
  );
}
