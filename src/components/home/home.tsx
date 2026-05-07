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
  BadgeCheck,
} from 'lucide-react';
import Timeline from '../timeline';
import {
  GitHubContributions,
  GitHubContributionsFallback,
} from '@/components/github-contributions';
import { getCachedContributions } from '@/lib/get-cached-contributions';
import SocialCards from '@/components/socials/social-cards';
import { Separator } from '../ui/separator';
import { H1, H2 } from '@/components/typography';
import { siteConfig } from '@/config/site';

// Pull GitHub username from siteConfig.links.github (last path segment).
const GITHUB_USERNAME = siteConfig.links.github
  .replace(/\/+$/, '')
  .split('/')
  .pop()!;

const SITE_HOSTNAME = siteConfig.url
  .replace(/^https?:\/\//, '')
  .replace(/\/$/, '');

/** A single icon + value row in the hero info grid. */
function InfoRow({
  icon,
  children,
}: {
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-2.5 text-sm text-muted-foreground">
      <span className="text-muted-foreground/70 [&_svg]:size-4">{icon}</span>
      <span className="min-w-0 truncate">{children}</span>
    </div>
  );
}

export default function Home() {
  return (
    <div className="mt-8 flex flex-col gap-10">
      {/* ───── Hero ───── */}
      <section className="flex flex-col gap-6">
        {/* Avatar + name + tagline */}
        <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:gap-6">
          <Image
            className="size-24 shrink-0 rounded-full border-2 border-border md:size-28"
            src="/img/pfp-avatar.jpg"
            alt={siteConfig.author.name}
            width={112}
            height={112}
            priority
          />
          <div className="flex flex-col gap-1">
            <H1 className="flex items-center gap-2 text-3xl md:text-4xl">
              {siteConfig.author.name}
              <BadgeCheck
                aria-label="Verified"
                className="size-5 text-sky-500 md:size-6"
              />
            </H1>
            <p className="font-mono text-sm text-muted-foreground">
              {siteConfig.author.tagline}
            </p>
          </div>
        </div>

        <Separator />

        {/* Info grid: 2 columns on desktop, stacked on mobile */}
        <div className="grid grid-cols-1 gap-x-12 gap-y-2.5 sm:grid-cols-2">
          <div className="flex flex-col gap-2.5">
            <InfoRow icon={<CodeXml />}>
              {siteConfig.currentRole.title}{' '}
              <Link
                href={siteConfig.currentRole.companyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-foreground hover:underline"
              >
                <AtSign className="size-3.5" />
                {siteConfig.currentRole.company}
              </Link>
            </InfoRow>
            <InfoRow icon={<GraduationCap />}>
              <span className="font-mono">{siteConfig.author.education}</span>
            </InfoRow>
            <InfoRow icon={<MapPin />}>{siteConfig.author.location}</InfoRow>
          </div>
          <div className="flex flex-col gap-2.5">
            <InfoRow icon={<Mail />}>
              <Link
                href={`mailto:${siteConfig.author.email}`}
                className="text-foreground hover:underline"
              >
                {siteConfig.author.email}
              </Link>
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

      {/* ───── Education & Experience ───── */}
      <section>
        <H2 className="mb-6">Education & Experience</H2>
        <Timeline />
      </section>

      {/* ───── Featured Projects ───── */}
      <section className="flex flex-col gap-8">
        <div className="flex items-center justify-between border-b-2 pb-3">
          <H2 className="border-b-0 pb-0">Featured projects</H2>
          <Link
            href="/projects"
            className="flex items-center gap-2 hover:text-foreground"
          >
            <span>view more</span>
            <ArrowRightIcon className="size-5 cursor-pointer" />
          </Link>
        </div>
        <Projects limit={2} />
      </section>

      {/* ───── GitHub Contributions ───── */}
      <section className="flex flex-col gap-4">
        <H2 className="border-b-2 pb-3">GitHub Contributions</H2>
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
