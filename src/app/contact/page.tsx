import type { Metadata } from 'next';
import Link from 'next/link';
import { CheckCircle2, Clock, Mail, MapPin } from 'lucide-react';
import { FaGithub, FaLinkedin } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';

import ContactForm from '@/components/contact/contact-form';
import { CopyButton } from '@/components/copy-button';
import { Twemoji } from '@/components/twemoji';
import { H1, H2, Lead, Muted } from '@/components/typography';
import { siteConfig } from '@/config/site';

export const metadata: Metadata = {
  title: 'Contact',
  description: `Get in touch with ${siteConfig.author.name} — open to full-time roles and collaboration opportunities.`,
  alternates: { canonical: `${siteConfig.url}/contact` },
};

const ALT_CHANNELS = [
  {
    label: 'Email',
    icon: <Mail className="size-4" />,
    value: siteConfig.author.email,
    href: `mailto:${siteConfig.author.email}`,
    copyable: true,
  },
  {
    label: 'LinkedIn',
    icon: <FaLinkedin className="size-4" />,
    value: 'in/kartik-mouli',
    href: siteConfig.links.linkedin,
    external: true,
  },
  {
    label: 'GitHub',
    icon: <FaGithub className="size-4" />,
    value: '@KartikMouli',
    href: siteConfig.links.github,
    external: true,
  },
  {
    label: 'X / Twitter',
    icon: <FaXTwitter className="size-4" />,
    value: siteConfig.author.twitterHandle,
    href: siteConfig.links.twitter,
    external: true,
  },
] as const;

const CHECKLIST = [
  'A short note on what you’re working on',
  'Timeline / urgency, if any',
  'Links — repo, design doc, deploy preview',
  'How you’d like to chat — async, sync, or hybrid',
];

function Contact() {
  return (
    <div className="flex flex-col gap-10 pb-16">
      {/* Header */}
      <header className="flex flex-col gap-3">
        <H1>Get in touch</H1>
        <Lead className="max-w-2xl text-base">
          Full-time roles, OSS collaborations, or just a hello — all welcome.
          The fastest way to reach me is the form below; if you prefer something
          else, the alternatives are on the left.
        </Lead>
      </header>

      {/* Two-column body */}
      <div className="grid gap-8 md:grid-cols-[minmax(0,1fr)_minmax(0,1.5fr)] md:gap-12">
        {/* Left column — info */}
        <aside className="flex flex-col gap-8">
          {/* Alt channels */}
          <section className="flex flex-col gap-3">
            <H2 className="border-b-0 pb-0 text-base font-medium">
              Alternatives
            </H2>
            <ul className="flex flex-col gap-2">
              {ALT_CHANNELS.map((c) => (
                <li
                  key={c.label}
                  className="group flex items-center gap-2 rounded-md border bg-card/50 px-3 py-2 transition-colors hover:border-foreground/40"
                >
                  <span className="flex size-7 shrink-0 items-center justify-center rounded-md border border-muted-foreground/15 bg-muted text-muted-foreground">
                    {c.icon}
                  </span>
                  <div className="flex min-w-0 flex-1 flex-col">
                    <span className="text-xs text-muted-foreground">
                      {c.label}
                    </span>
                    <Link
                      href={c.href}
                      {...('external' in c && c.external
                        ? { target: '_blank', rel: 'noopener noreferrer' }
                        : {})}
                      className="truncate text-sm font-medium text-foreground hover:underline"
                    >
                      {c.value}
                    </Link>
                  </div>
                  {'copyable' in c && c.copyable && (
                    <CopyButton
                      text={c.value}
                      variant="ghost"
                      size="icon"
                      className="size-7 opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100 [&_svg]:size-3.5"
                      aria-label={`Copy ${c.label}`}
                    />
                  )}
                </li>
              ))}
            </ul>
          </section>

          {/* Response time */}
          <section className="flex flex-col gap-2 rounded-md border bg-card/50 p-3">
            <div className="flex items-center gap-2 text-sm font-medium text-foreground">
              <Clock className="size-4" />
              <span>Response time</span>
            </div>
            <Muted className="text-xs">
              I typically reply within{' '}
              <strong className="text-foreground">24–48 hours</strong> on
              weekdays. Recruiters and hiring managers — feel free to{' '}
              <Link
                href={siteConfig.links.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-foreground hover:underline"
              >
                ping me on LinkedIn
              </Link>{' '}
              if it&apos;s urgent.
            </Muted>
          </section>

          {/* Location */}
          <section className="flex flex-col gap-2 rounded-md border bg-card/50 p-3">
            <div className="flex items-center gap-2 text-sm font-medium text-foreground">
              <MapPin className="size-4" />
              <span>Where I am</span>
            </div>
            <Muted className="text-xs">
              Based in{' '}
              <Link
                href="https://www.google.com/maps/search/?api=1&query=Nashik,+Maharashtra,+India"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-foreground hover:underline"
              >
                Nashik, Maharashtra
              </Link>
              <Twemoji>{' 🇮🇳'}</Twemoji> · IST (UTC+5:30) · open to remote and
              on-site work.
            </Muted>
          </section>
        </aside>

        {/* Right column — form */}
        <div className="flex flex-col gap-6">
          <ContactForm />

          {/* What to include */}
          <section className="flex flex-col gap-3 rounded-md border border-dashed p-4">
            <p className="text-sm font-medium text-foreground">
              For faster turnaround, include:
            </p>
            <ul className="flex flex-col gap-2">
              {CHECKLIST.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-2 text-xs text-muted-foreground"
                >
                  <CheckCircle2
                    aria-hidden="true"
                    className="mt-0.5 size-3.5 shrink-0 text-muted-foreground/60"
                  />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}

export default Contact;
