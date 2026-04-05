'use client';
import { Button } from '../../ui/button';
import { Textarea } from '../../ui/textarea';
import { Square, Mic, ArrowUp, XCircle } from 'lucide-react';
import { useChatbot } from '../../../context/chatbot/chat-context';
import { cn } from '@/lib/utils';
import AudioVisualizer from '../../audio-visualizer/audio-visualizer';
import { MediaPopover } from './MediaPopover';
import Image from 'next/image';

export function ChatInput() {
  const {
    input,
    setInput,
    isSending,
    isUploading,
    handleSendMessage,
    stopResponding,
    isRecording,
    startRecording,
    stopRecording,
    mediaRecorder,
    appParams,
    visionFiles,
    removeVisionFile,
  } = useChatbot();

  const isSttEnabled = appParams?.speech_to_text?.enabled;

  return (
    <div className="p-3 border-t bg-background/80 backdrop-blur-sm z-10 flex flex-col gap-3">
      {visionFiles.length > 0 && (
        <div className="flex gap-2 flex-wrap pb-1">
          {visionFiles.map((vf, idx) => (
            <div key={idx} className="relative group">
              <Image
                src={vf.url}
                alt="upload preview"
                className="h-12 w-12 object-cover rounded-md border"
              />
              <button
                onClick={() => removeVisionFile(idx)}
                className="absolute -top-2 -right-2 bg-background border rounded-full text-foreground opacity-0 group-hover:opacity-100 transition-opacity p-0.5 shadow-sm"
              >
                <XCircle className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}

      <div
        className={cn(
          'flex gap-2 items-end transition-all rounded-2xl border bg-background p-1 focus-within:ring-1 focus-within:ring-primary shadow-sm',
          isSending
            ? 'border-primary/50 shadow-[0_0_10px_rgba(var(--primary),0.2)]'
            : ''
        )}
      >
        <MediaPopover />

        {isSttEnabled && (
          <Button
            size="icon"
            variant={isRecording ? 'destructive' : 'ghost'}
            className={cn(
              'h-7 w-7 rounded-full mb-1 shrink-0 transition-all',
              isRecording &&
                'animate-pulse shadow-[0_0_15px_rgba(var(--destructive),0.5)]'
            )}
            onClick={() => (isRecording ? stopRecording() : startRecording())}
            disabled={isUploading || isSending}
          >
            {isRecording ? (
              <Square className="h-3 w-3 fill-current" />
            ) : (
              <Mic className="h-3.5 w-3.5" />
            )}
          </Button>
        )}

        {isRecording && mediaRecorder ? (
          <div className="flex-1 flex items-center justify-center px-3 h-9">
            <AudioVisualizer
              mediaRecorder={mediaRecorder}
              barColor="hsl(var(--primary))"
            />
          </div>
        ) : (
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message..."
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            className="min-h-9 max-h-32 border-0 focus-visible:ring-0 shadow-none bg-transparent resize-none py-2 px-3 text-sm leading-relaxed"
            disabled={isSending || isUploading}
            rows={1}
          />
        )}

        {isSending ? (
          <Button
            onClick={stopResponding}
            size="icon"
            variant="secondary"
            className="h-7 w-7 shrink-0 rounded-full mb-1 mr-0.5 animate-pulse"
          >
            <Square className="h-3 w-3 fill-current" />
          </Button>
        ) : (
          <Button
            onClick={handleSendMessage}
            disabled={!input.trim() || isUploading}
            size="icon"
            className={cn(
              'h-8 w-8 shrink-0 rounded-full mb-0.5 mr-0.5 transition-all duration-200',
              input.trim() && !isUploading
                ? 'bg-primary text-primary-foreground shadow-md hover:bg-primary/90'
                : 'bg-secondary text-secondary-foreground opacity-50'
            )}
          >
            <ArrowUp className="h-4 w-4" strokeWidth={2.5} />
          </Button>
        )}
      </div>
    </div>
  );
}
