'use client';

import { BotIcon, ChevronDownIcon, XIcon } from 'lucide-react';

import { type FC, forwardRef } from 'react';
import { AssistantModalPrimitive } from '@assistant-ui/react';

import { Thread } from '@/components/assistant-ui/thread';
import { TooltipIconButton } from '@/components/assistant-ui/tooltip-icon-button';

export const AssistantModal: FC = () => {
  return (
    <AssistantModalPrimitive.Root>
      <AssistantModalPrimitive.Anchor className="aui-root aui-modal-anchor fixed end-4 bottom-4 size-11">
        <AssistantModalPrimitive.Trigger asChild>
          <AssistantModalButton />
        </AssistantModalPrimitive.Trigger>
      </AssistantModalPrimitive.Anchor>
      {/* Selectors changed from `>.aui-thread-root` (direct child) to
          `_.aui-thread-root` (descendant) because we now wrap Thread in
          a flex-column container so the header can sit alongside it.
          The bg-inherit chain still resolves through the wrapper since
          its background is unset (transparent → inherits popover). */}
      <AssistantModalPrimitive.Content
        sideOffset={16}
        className="aui-root aui-modal-content data-[state=closed]:fade-out-0 data-[state=closed]:slide-out-to-bottom-1/2 data-[state=closed]:slide-out-to-right-1/2 data-[state=closed]:zoom-out data-[state=open]:fade-in-0 data-[state=open]:slide-in-from-bottom-1/2 data-[state=open]:slide-in-from-right-1/2 data-[state=open]:zoom-in z-50 h-125 w-100 overflow-clip overscroll-contain rounded-xl border bg-popover p-0 text-popover-foreground shadow-md outline-none data-[state=closed]:animate-out data-[state=open]:animate-in [&_.aui-thread-root]:bg-inherit [&_.aui-thread-root_.aui-thread-viewport-footer]:bg-inherit"
      >
        <div className="flex h-full flex-col">
          <ChatHeader />
          {/* `flex-1 min-h-0` is the canonical fix for a flex child that
              owns its own internal scroll: without `min-h-0` the
              child's intrinsic content height blocks the flex shrink,
              and Thread's viewport stops scrolling once messages
              overflow. With it, Thread fills exactly the remaining
              height after the header. */}
          <div className="flex-1 min-h-0">
            <Thread />
          </div>
        </div>
      </AssistantModalPrimitive.Content>
    </AssistantModalPrimitive.Root>
  );
};

/**
 * Branded modal header — bot icon + label + close.
 *
 * The close button is another `<AssistantModalPrimitive.Trigger>`. It
 * shares the open/close state with the FAB at the bottom-right (Radix
 * Popover.Trigger semantics: any number of Triggers under the same Root
 * all toggle the same state), so clicking it closes the modal exactly
 * like clicking the FAB does.
 */
const ChatHeader: FC = () => (
  <div
    data-slot="aui_modal-header"
    className="aui-modal-header flex shrink-0 items-center justify-between gap-2 border-b px-3 py-2"
  >
    <div className="flex items-center gap-2">
      <BotIcon className="size-4 text-muted-foreground" aria-hidden="true" />
      <span className="text-sm font-medium">Kartik&apos;s assistant</span>
    </div>
    <AssistantModalPrimitive.Trigger asChild>
      <TooltipIconButton
        tooltip="Close"
        side="left"
        className="-me-1 size-7"
        aria-label="Close assistant"
      >
        <XIcon className="size-4" />
      </TooltipIconButton>
    </AssistantModalPrimitive.Trigger>
  </div>
);

type AssistantModalButtonProps = { 'data-state'?: 'open' | 'closed' };

const AssistantModalButton = forwardRef<
  HTMLButtonElement,
  AssistantModalButtonProps
>(({ 'data-state': state, ...rest }, ref) => {
  const tooltip = state === 'open' ? 'Close Assistant' : 'Open Assistant';

  return (
    <TooltipIconButton
      variant="default"
      tooltip={tooltip}
      side="left"
      {...rest}
      className="aui-modal-button size-full rounded-full shadow transition-transform hover:scale-110 active:scale-90"
      ref={ref}
    >
      <BotIcon
        data-state={state}
        className="aui-modal-button-closed-icon absolute size-6 transition-all data-[state=closed]:rotate-0 data-[state=open]:rotate-90 data-[state=closed]:scale-100 data-[state=open]:scale-0"
      />

      <ChevronDownIcon
        data-state={state}
        className="aui-modal-button-open-icon absolute size-6 transition-all data-[state=closed]:-rotate-90 data-[state=open]:rotate-0 data-[state=closed]:scale-0 data-[state=open]:scale-100"
      />
      <span className="aui-sr-only sr-only">{tooltip}</span>
    </TooltipIconButton>
  );
});

AssistantModalButton.displayName = 'AssistantModalButton';
