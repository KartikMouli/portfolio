'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowUpRight,
  AtSign,
  Briefcase,
  Command as CommandIcon,
  Copy,
  ExternalLink,
  FileText,
  Globe,
  Home,
  Linkedin,
  Mail,
  Moon,
  Phone,
  Search,
  Sun,
  Twitter,
} from 'lucide-react';
import { FaGithub } from 'react-icons/fa';
import { SiLeetcode } from 'react-icons/si';
import { useTheme } from 'next-themes';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from '@/components/ui/command';
import { siteConfig } from '@/config/site';

/**
 * Cmd+K command palette + keyboard nav (`g h`, `g p`, `g b`, `g c`).
 *
 * Three shortcut surfaces, all hosted by this component:
 *  - **Open palette**: ⌘K / Ctrl+K (or `/` from anywhere outside an input)
 *  - **In-palette ⌘ shortcuts**: ⌘H / ⌘P / ⌘B / ⌘C → visible in the
 *    item rows so users learn them
 *  - **Vim-style "g <key>"**: pressed with palette closed; `g` arms a
 *    1-second window during which the next keystroke routes
 *
 * The trigger button is exported as `CommandMenuTrigger` so it can sit
 * inside the navbar; the dialog itself mounts here so the keyboard
 * listeners attach once at the layout level.
 */

type Action = {
  id: string;
  label: string;
  icon: React.ReactNode;
  /** Either a path (router.push) or a function (custom action). */
  perform: () => void;
  shortcut?: string;
  /** Hint for the right-side icon. */
  external?: boolean;
};

const PENDING_G_MS = 1000;

export function CommandMenu() {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const { setTheme, resolvedTheme } = useTheme();

  // ⌘K / Ctrl+K + `/` global open + Vim-style `g <key>` nav.
  useEffect(() => {
    let pendingG = false;
    let pendingGTimer: ReturnType<typeof setTimeout> | undefined;

    const inEditableField = (target: EventTarget | null) => {
      if (!(target instanceof HTMLElement)) return false;
      const tag = target.tagName;
      return (
        tag === 'INPUT' ||
        tag === 'TEXTAREA' ||
        tag === 'SELECT' ||
        target.isContentEditable
      );
    };

    const onKeyDown = (e: KeyboardEvent) => {
      // ⌘K / Ctrl+K — open palette from anywhere.
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((prev) => !prev);
        return;
      }

      // `/` — open palette when not typing in a field. Standard search-focus
      // pattern (GitHub, Vercel, chanhdai.com).
      if (e.key === '/' && !inEditableField(e.target) && !open) {
        e.preventDefault();
        setOpen(true);
        return;
      }

      // Vim-style `g <key>`: don't fire while palette open or while typing.
      if (open || inEditableField(e.target) || e.metaKey || e.ctrlKey) return;

      if (pendingG) {
        pendingG = false;
        if (pendingGTimer) clearTimeout(pendingGTimer);
        const route = G_ROUTES[e.key];
        if (route) {
          e.preventDefault();
          router.push(route);
        }
        return;
      }

      if (e.key === 'g') {
        pendingG = true;
        pendingGTimer = setTimeout(() => {
          pendingG = false;
        }, PENDING_G_MS);
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      if (pendingGTimer) clearTimeout(pendingGTimer);
    };
  }, [open, router]);

  const run = (fn: () => void) => {
    setOpen(false);
    // defer to next tick so the dialog can finish closing before navigating —
    // avoids an annoying flash where the route changes underneath the dialog
    setTimeout(fn, 0);
  };

  const copy = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(`${label} copied`);
    } catch {
      toast.error('Copy failed');
    }
  };

  const navigation: Action[] = [
    {
      id: 'home',
      label: 'Home',
      icon: <Home />,
      shortcut: 'g h',
      perform: () => router.push('/'),
    },
    {
      id: 'projects',
      label: 'Projects',
      icon: <Briefcase />,
      shortcut: 'g p',
      perform: () => router.push('/projects'),
    },
    {
      id: 'blog',
      label: 'Blog',
      icon: <FileText />,
      shortcut: 'g b',
      perform: () => router.push('/blog'),
    },
    {
      id: 'contact',
      label: 'Contact',
      icon: <AtSign />,
      shortcut: 'g c',
      perform: () => router.push('/contact'),
    },
  ];

  const socials: Action[] = [
    {
      id: 'github',
      label: 'GitHub',
      icon: <FaGithub />,
      external: true,
      perform: () => window.open(siteConfig.links.github, '_blank'),
    },
    {
      id: 'linkedin',
      label: 'LinkedIn',
      icon: <Linkedin />,
      external: true,
      perform: () => window.open(siteConfig.links.linkedin, '_blank'),
    },
    {
      id: 'twitter',
      label: 'X / Twitter',
      icon: <Twitter />,
      external: true,
      perform: () => window.open(siteConfig.links.twitter, '_blank'),
    },
    {
      id: 'leetcode',
      label: 'LeetCode',
      icon: <SiLeetcode />,
      external: true,
      perform: () => window.open(siteConfig.links.leetcode, '_blank'),
    },
    {
      id: 'resume',
      label: 'Resume (open in new tab)',
      icon: <ExternalLink />,
      external: true,
      perform: () => window.open(siteConfig.links.resume, '_blank'),
    },
  ];

  const contact: Action[] = [
    {
      id: 'copy-email',
      label: `Copy email — ${siteConfig.author.email}`,
      icon: <Mail />,
      perform: () => copy(siteConfig.author.email, 'Email'),
    },
    {
      id: 'copy-phone',
      label: `Copy phone — ${siteConfig.author.phone}`,
      icon: <Phone />,
      perform: () => copy(siteConfig.author.phone, 'Phone'),
    },
    {
      id: 'copy-url',
      label: `Copy site URL`,
      icon: <Globe />,
      perform: () => copy(siteConfig.url, 'URL'),
    },
    {
      id: 'mail-to',
      label: 'Compose email',
      icon: <Mail />,
      perform: () =>
        window.location.assign(`mailto:${siteConfig.author.email}`),
    },
  ];

  const themeActions: Action[] = [
    {
      id: 'theme-light',
      label: 'Switch to Light',
      icon: <Sun />,
      perform: () => setTheme('light'),
    },
    {
      id: 'theme-dark',
      label: 'Switch to Dark',
      icon: <Moon />,
      perform: () => setTheme('dark'),
    },
  ].filter((a) => a.id !== `theme-${resolvedTheme}`);

  return (
    <CommandDialog
      open={open}
      onOpenChange={setOpen}
      title="Command palette"
      description="Search routes, copy contact info, or jump to a social profile"
    >
      <CommandInput placeholder="Search…" />
      <CommandList>
        <CommandEmpty>No results.</CommandEmpty>
        <CommandGroup heading="Navigation">
          {navigation.map((action) => (
            <CommandItem key={action.id} onSelect={() => run(action.perform)}>
              {action.icon}
              <span>{action.label}</span>
              {action.shortcut && (
                <CommandShortcut>{action.shortcut}</CommandShortcut>
              )}
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Contact">
          {contact.map((action) => (
            <CommandItem key={action.id} onSelect={() => run(action.perform)}>
              {action.icon}
              <span>{action.label}</span>
              {action.id.startsWith('copy-') && (
                <CommandShortcut>
                  <Copy className="size-3" />
                </CommandShortcut>
              )}
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Profiles">
          {socials.map((action) => (
            <CommandItem key={action.id} onSelect={() => run(action.perform)}>
              {action.icon}
              <span>{action.label}</span>
              {action.external && (
                <CommandShortcut>
                  <ArrowUpRight className="size-3" />
                </CommandShortcut>
              )}
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Theme">
          {themeActions.map((action) => (
            <CommandItem key={action.id} onSelect={() => run(action.perform)}>
              {action.icon}
              <span>{action.label}</span>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}

/**
 * Trigger pill rendered in the navbar. Shows ⌘K hint on desktop,
 * shrinks to an icon on mobile. Clicking dispatches the same global
 * `keydown` the listener watches — keeps a single source of truth for
 * "what opens the palette."
 */
export function CommandMenuTrigger({ className }: { className?: string }) {
  return (
    <Button
      variant="outline"
      size="sm"
      aria-label="Open command palette (⌘K)"
      className={className}
      onClick={() => {
        const ev = new KeyboardEvent('keydown', {
          key: 'k',
          metaKey: true,
          ctrlKey: true,
          bubbles: true,
        });
        document.dispatchEvent(ev);
      }}
    >
      <Search className="size-4" />
      <span className="hidden text-muted-foreground sm:inline">Search…</span>
      <kbd className="hidden items-center gap-0.5 rounded border bg-muted px-1.5 font-mono text-[10px] text-muted-foreground sm:inline-flex">
        <CommandIcon className="size-3" />K
      </kbd>
    </Button>
  );
}

/** Routes targeted by `g <key>` shortcuts. */
const G_ROUTES: Record<string, string> = {
  h: '/',
  p: '/projects',
  b: '/blog',
  c: '/contact',
};
