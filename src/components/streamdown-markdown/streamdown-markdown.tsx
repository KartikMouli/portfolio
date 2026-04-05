'use client';
import { Streamdown } from 'streamdown';
import 'katex/dist/katex.min.css';

interface StreamdownMarkdownProps {
  content: string;
  className?: string;
}

export function StreamdownMarkdown({
  content,
  className = '',
}: StreamdownMarkdownProps) {
  return (
    <div
      className={`streamdown-markdown prose prose-sm max-w-full text-inherit text-pretty font-sans prose-p:leading-relaxed prose-p:text-inherit prose-headings:text-inherit prose-strong:text-inherit prose-li:text-inherit prose-code:text-inherit prose-pre:p-0 ${className}`}
    >
      <Streamdown>{content}</Streamdown>
    </div>
  );
}

export default StreamdownMarkdown;
