import Image from 'next/image';
import Link from 'next/link';
import Socials from '@/components/socials';
import Projects from '@/components/project';
import { ArrowRightIcon, AtSign, MapPinHouseIcon } from 'lucide-react';
import ResumeButton from '@/components/resume-button';
import Timeline from '../timeline';
import { Separator } from '../ui/separator';
import { Badge } from '../ui/badge';
import { H1, H2 } from '@/components/typography';
import { siteConfig } from '@/config/site';

export default function Home() {
  return (
    <div className="flex flex-col gap-10 mt-8">
      {/* Hero Section */}
      <section className=" mt-4 flex flex-col justify-center items-center text-center md:text-left">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-8 md:gap-12 w-full max-w-4xl mx-auto px-4">
          <div className="avatar-container relative">
            <div className="relative w-32 h-32 md:w-40 md:h-40">
              {/* Profile Image */}
              <div className="absolute w-full h-full">
                <Image
                  className="rounded-full border-2 border-border"
                  src="/img/pfp-avatar.jpg"
                  alt="Profile Image"
                  width={175}
                  height={175}
                  priority
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center md:items-start gap-4">
            <div className="flex flex-col gap-2">
              <H1 className="text-3xl md:text-4xl">
                Hey, I&apos;m {siteConfig.author.name}
              </H1>
              <div className="mt-1 gap-2">
                <Badge variant="outline">{siteConfig.author.role}</Badge>
              </div>
            </div>

            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPinHouseIcon className="size-4" />
              <span className="text-sm">{siteConfig.author.location}</span>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-2 text-sm text-muted-foreground">
              <span className="font-mono">{siteConfig.author.education}</span>
              <Separator
                orientation="vertical"
                className="hidden md:block h-4"
              />
              <div className="flex items-center">
                <span>{siteConfig.currentRole.title}</span>
                <Link
                  href={siteConfig.currentRole.companyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-muted-foreground hover:text-foreground"
                >
                  <AtSign className="size-4 ml-1" />
                  {siteConfig.currentRole.company}
                </Link>
              </div>
            </div>

            <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-2">
              <ResumeButton />
              <Socials />
            </div>
          </div>
        </div>
      </section>

      {/* Education Section */}
      <section>
        <section className="mb-8">
          <div>
            <H2 className="mb-6">Education & Experience</H2>
            <Timeline />
          </div>
        </section>
      </section>

      {/* Project Section */}
      <section className="flex flex-col gap-8">
        <div className="flex justify-between items-center border-b-2 pb-3">
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
    </div>
  );
}
