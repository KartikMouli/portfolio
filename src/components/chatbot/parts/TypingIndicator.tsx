export function TypingIndicator() {
  return (
    <div className="flex gap-1 items-center h-5 px-1">
      <div
        className="h-1.5 w-1.5 rounded-full bg-primary/70 animate-bounce"
        style={{ animationDelay: '0ms' }}
      />
      <div
        className="h-1.5 w-1.5 rounded-full bg-primary/70 animate-bounce"
        style={{ animationDelay: '150ms' }}
      />
      <div
        className="h-1.5 w-1.5 rounded-full bg-primary/70 animate-bounce"
        style={{ animationDelay: '300ms' }}
      />
    </div>
  );
}
