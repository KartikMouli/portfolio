'use client';
import { Button } from '../../ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '../../ui/popover';
import {
  Paperclip,
  Loader2,
  X,
  ImageIcon,
  ArrowRight,
  Upload,
} from 'lucide-react';
import { Input } from '../../ui/input';
import { Separator } from '../../ui/separator';
import { useChatbot } from '../../../context/chatbot/chat-context';
import { cn } from '@/lib/utils';

export function MediaPopover() {
  const {
    appParams,
    fileInputRef,
    handleFileUpload,
    isMediaPopoverOpen,
    setIsMediaPopoverOpen,
    isUploading,
    isSending,
    urlInput,
    setUrlInput,
    handleAddUrl,
  } = useChatbot();

  const isFileUploadEnabled = appParams?.file_upload?.enabled;

  if (!isFileUploadEnabled) return null;

  return (
    <div className="relative">
      <Input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        className="hidden"
        accept={
          appParams?.file_upload?.allowed_file_extensions
            ?.map((ext: string) => ext.toLowerCase())
            .join(',') || 'image/*'
        }
      />
      <Popover
        modal={false}
        open={isMediaPopoverOpen}
        onOpenChange={setIsMediaPopoverOpen}
      >
        <PopoverTrigger asChild>
          <Button
            size="icon"
            variant="ghost"
            className={cn(
              'h-7 w-7 rounded-full mb-1 ml-0.5 shrink-0 transition-all',
              isMediaPopoverOpen && 'rotate-45 bg-secondary'
            )}
            disabled={isUploading || isSending}
            aria-label={
              isMediaPopoverOpen ? 'Close media options' : 'Attach files'
            }
          >
            {isUploading ? (
              <Loader2 className="absolute inset-0 m-auto h-3.5 w-3.5 animate-spin text-primary" />
            ) : (
              <Paperclip
                className={cn(
                  'h-3.5 w-3.5 transition-all',
                  isMediaPopoverOpen && 'text-primary'
                )}
              />
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent
          side="top"
          align="start"
          sideOffset={12}
          className="w-80 p-0 overflow-hidden z-110 shadow-2xl border-primary/20 animate-in fade-in zoom-in-95 duration-200"
        >
          <div className="bg-background flex flex-col p-4 space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between mb-1">
                <label className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground ml-1">
                  Paste Image URL
                </label>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-5 w-5 rounded-md hover:bg-secondary shrink-0"
                  onClick={() => setIsMediaPopoverOpen(false)}
                  aria-label="Close media popover"
                >
                  <X className="h-3 w-3 text-muted-foreground" />
                </Button>
              </div>
              <div className="relative flex items-center">
                <div className="absolute left-2.5 text-muted-foreground">
                  <ImageIcon className="h-3 w-3" />
                </div>
                <Input
                  type="text"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  className="py-2 pl-8 pr-10"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddUrl();
                      setIsMediaPopoverOpen(false);
                    }
                  }}
                />
                <Button
                  size="icon"
                  variant="ghost"
                  className="absolute right-1 h-7 w-7 hover:cursor-pointer"
                  onClick={() => {
                    handleAddUrl();
                    setIsMediaPopoverOpen(false);
                  }}
                  aria-label="Add image URL"
                >
                  <ArrowRight className="h-3 w-3" />
                </Button>
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator className="w-full" />
              </div>
              <div className="relative flex justify-center text-[10px] uppercase">
                <span className="bg-background px-2 text-muted-foreground font-semibold">
                  or
                </span>
              </div>
            </div>

            <Button
              variant="outline"
              className="w-full h-10 border-dashed border-2 hover:border-primary hover:bg-primary/5 transition-all text-sm font-medium"
              onClick={() => {
                fileInputRef.current?.click();
                setIsMediaPopoverOpen(false);
              }}
            >
              <Upload className="h-3.5 w-3.5 mr-2" />
              Upload Image
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
