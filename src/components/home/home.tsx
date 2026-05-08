import { Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Projects from '@/components/project';
import {
  ArrowRightIcon,
  AtSign,
  CodeXml,
  GraduationCap,
  Globe,
  Mail,
  MapPin,
  Phone,
} from 'lucide-react';
import Timeline from '../timeline';
import {
  GitHubContributions,
  GitHubContributionsFallback,
} from '@/components/github-contributions';
import { getCachedContributions } from '@/lib/get-cached-contributions';
import SocialCards from '@/components/socials/social-cards';
import Certifications from '@/components/certifications';
import Contributions from '@/components/contributions';
import { CopyButton } from '@/components/copy-button';
import { Twemoji } from '@/components/twemoji';
import { InfoRow } from '@/components/info-row';
import { Separator } from '../ui/separator';
import { H1 } from '@/components/typography';
import { SectionHeading } from '@/components/home/section-heading';
import { SectionRail } from '@/components/home/section-rail';
import { TaglineWordFade } from '@/components/home/tagline-word-fade';
import { siteConfig } from '@/config/site';
import { GITHUB_USERNAME, SITE_HOSTNAME } from '@/lib/site';

/**
 * Sections wired into the right-edge `<SectionRail />`. Module-level
 * so the array reference is stable across renders — the rail's
 * `useActiveSection` hook re-subscribes whenever its `items` prop
 * identity changes.
 *
 * `id`s match the `id` attributes set on the corresponding sections
 * below; if you rename a section's id, update both.
 */
const HOME_SECTIONS = [
  { id: 'about', label: 'About' },
  { id: 'experience', label: 'Experience' },
  { id: 'projects', label: 'Projects' },
  { id: 'open-source', label: 'Open Source' },
  { id: 'certifications', label: 'Certifications' },
  { id: 'github', label: 'GitHub' },
];

export default function Home() {
  return (
    <div className="mt-8 flex flex-col gap-10">
      <SectionRail items={HOME_SECTIONS} />
      {/* ───── Hero ───── */}
      <section className="flex flex-col gap-6">
        {/* Avatar + name + tagline */}
        <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:gap-6">
          <Image
            className="size-32 shrink-0 rounded-full border-2 border-border md:size-40"
            src="/img/pfp-avatar.jpg"
            alt={siteConfig.author.name}
            width={160}
            height={160}
            priority
          />
          <div className="flex flex-col gap-1">
            <H1 className="text-3xl md:text-4xl">{siteConfig.author.name}</H1>
            <p className="font-mono text-sm text-muted-foreground">
              <TaglineWordFade text={siteConfig.author.tagline} />
            </p>
          </div>
        </div>

        <Separator />

        {/* Info grid: 2 columns on desktop, stacked on mobile */}
        <div className="grid grid-cols-1 gap-x-12 gap-y-2.5 sm:grid-cols-2">
          <div className="flex flex-col gap-2.5">
            <InfoRow icon={<CodeXml />}>
              <span className="flex items-center gap-1.5">
                {siteConfig.currentRole.title}
                <Link
                  href={siteConfig.currentRole.companyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-0.5 text-foreground hover:underline"
                >
                  <AtSign className="size-3.5" />
                  {siteConfig.currentRole.company}
                </Link>
              </span>
            </InfoRow>
            <InfoRow icon={<GraduationCap />}>
              <Link
                href="https://www.iitp.ac.in/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-foreground hover:underline"
              >
                {siteConfig.author.education}
              </Link>
            </InfoRow>
            <InfoRow icon={<MapPin />}>
              <Link
                href="https://www.google.com/maps/search/?api=1&query=Nashik,+Maharashtra,+India"
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground hover:underline"
              >
                <Twemoji>{siteConfig.author.location}</Twemoji>
              </Link>
            </InfoRow>
          </div>
          <div className="flex flex-col gap-2.5">
            <InfoRow icon={<Mail />} className="group">
              <span className="flex items-center gap-1">
                <Link
                  href={`mailto:${siteConfig.author.email}`}
                  className="text-foreground hover:underline"
                >
                  {siteConfig.author.email}
                </Link>
                <CopyButton
                  text={siteConfig.author.email}
                  variant="ghost"
                  size="icon"
                  className="size-6 opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100 [&_svg]:size-3.5"
                  aria-label="Copy email address"
                />
              </span>
            </InfoRow>
            <InfoRow icon={<Phone />} className="group">
              <span className="flex items-center gap-1">
                <Link
                  href={`tel:${siteConfig.author.phone.replace(/\s+/g, '')}`}
                  className="text-foreground hover:underline"
                >
                  {siteConfig.author.phone}
                </Link>
                <CopyButton
                  text={siteConfig.author.phone}
                  variant="ghost"
                  size="icon"
                  className="size-6 opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100 [&_svg]:size-3.5"
                  aria-label="Copy phone number"
                />
              </span>
            </InfoRow>
            <InfoRow icon={<Globe />}>
              <Link
                href={siteConfig.url}
                className="text-foreground hover:underline"
              >
                {SITE_HOSTNAME}
              </Link>
            </InfoRow>
          </div>
        </div>

        <Separator />

        {/* Social cards */}
        <SocialCards />
      </section>

      {/* ───── About ───── */}
      <section id="about" className="flex flex-col gap-4 scroll-mt-20">
        <SectionHeading>About</SectionHeading>
        <ul className="ml-5 list-disc space-y-2 text-sm text-muted-foreground marker:text-muted-foreground/60">
          <li>
            <Link
              href="https://www.iitp.ac.in/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-foreground hover:underline"
            >
              IIT Patna CSE &apos;24
            </Link>{' '}
            grad — full-stack development, AI platforms, and competitive
            programming.
          </li>
          <li>
            Off-keyboard: football, basketball, and movies — from action
            blockbusters to thought-provoking dramas.
          </li>
          <li>
            Based in{' '}
            <Link
              href="https://www.google.com/maps/search/?api=1&query=Nashik,+Maharashtra,+India"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-foreground hover:underline"
            >
              Nashik
            </Link>
            <Twemoji>{' 🇮🇳'}</Twemoji>; always exploring the open-source world.
          </li>
        </ul>
        {/* Sivers-style inline mention of the /now page — verbatim
            from his own home page (https://sive.rs/). Same voice as
            the bullets above, single muted line, no extra chrome. */}
        <p className="text-sm text-muted-foreground">
          What am I doing now? See my{' '}
          <Link
            href="/now"
            className="font-medium text-foreground hover:underline"
          >
            /now
          </Link>{' '}
          page.
        </p>
      </section>

      {/* ───── Education & Experience ───── */}
      <section id="experience" className="flex flex-col gap-6 scroll-mt-20">
        <SectionHeading>Education & Experience</SectionHeading>
        <Timeline />
      </section>

      {/* ───── Featured Projects ───── */}
      <section id="projects" className="flex flex-col gap-6 scroll-mt-20">
        <SectionHeading
          trailing={
            <Link
              href="/projects"
              className="flex items-center gap-2 hover:text-foreground"
            >
              <span>view more</span>
              <ArrowRightIcon className="size-5 cursor-pointer" />
            </Link>
          }
        >
          Featured projects
        </SectionHeading>
        <p className="text-sm text-muted-foreground">
          A selection of work I&apos;m proud of — full-stack across product and
          infra, from production AI tooling to side projects worth shipping.
        </p>
        <Projects limit={2} />
      </section>

      {/* ───── Open Source ───── */}
      {/* `<Contributions />` renders its own <section> internally; we
          wrap with an `id`-bearing div so the section-rail anchor works
          without leaking layout into the component. `scroll-mt-20`
          offsets for the sticky navbar when jumped to via #anchor. */}
      <div id="open-source" className="scroll-mt-20">
        <Contributions />
      </div>

      {/* ───── Certifications ───── */}
      <div id="certifications" className="scroll-mt-20">
        <Certifications />
      </div>

      {/* ───── GitHub Contributions ───── */}
      <section id="github" className="flex flex-col gap-4 scroll-mt-20">
        <SectionHeading>GitHub Contributions</SectionHeading>
        <Suspense fallback={<GitHubContributionsFallback />}>
          <GitHubContributions
            contributions={getCachedContributions(GITHUB_USERNAME)}
            githubProfileUrl={siteConfig.links.github}
          />
        </Suspense>
      </section>
    </div>
  );
}
