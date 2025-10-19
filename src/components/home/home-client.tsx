'use client';

import Image from "next/image";
import Link from "next/link";
import Socials from "@/components/socials";
import Projects from "@/components/project/projects";
import { ArrowRightIcon, AtSign, MapPinHouseIcon } from "lucide-react";
import Skills from "@/components/skill";
import ResumeButton from "@/components/resume-button/resume-button";
import Timeline from "../about/timeline";

export default function HomeClient() {

  return (
    <div
      className="flex flex-col gap-10 mt-8"
    >
      {/* Hero Section */}
      <section className=" mt-4 flex flex-col justify-center items-center text-center md:text-left">
        <div
          className="flex flex-col md:flex-row items-center md:items-start gap-8 md:gap-12 w-full max-w-4xl mx-auto px-4"
        >
          <div
            className="avatar-container relative"
          >
            <div
              className="relative w-32 h-32 md:w-40 md:h-40"
            >
              {/* Profile Image */}
              <div
                className="absolute w-full h-full"
              >
                <Image
                  className="rounded-full border-2 border-gray-300 dark:border-gray-700"
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
            <div
              className="flex flex-col gap-2"
            >
              <h1 className="text-3xl md:text-4xl font-bold text-gradient">
                Hey, I&apos;m Kartik Mouli
              </h1>
              <div className="mt-1 gap-2">
                <span className="text-sm px-2 py-1 rounded-full border border-gray-300 dark:border-gray-700 text-muted-foreground">
                  Full-Stack Developer
                </span>
              </div>
            </div>

            <div
              className="flex items-center gap-2 text-muted-foreground"
            >
              <MapPinHouseIcon className="size-4" />
              <span className="text-sm">Nashik, Maharashtra, 🇮🇳</span>
            </div>

            <div
              className="flex flex-col md:flex-row items-center gap-2 text-sm text-muted-foreground"
            >
              <span className="font-mono">IITP CSE&apos;24</span>
              <span className="hidden md:block">|</span>
              <div className="flex items-center">
                <span>Full Stack Developer Intern</span>
                <Link
                  href="https://unizoy.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-muted-foreground hover:text-foreground transition-colors duration-200"
                >
                  <AtSign className="size-4 ml-1" />Unizoy
                </Link>
              </div>
            </div>

            <div
              className="flex flex-wrap justify-center md:justify-start gap-4 mt-2"
            >
              <ResumeButton />
              <Socials />
            </div>
          </div>
        </div>
      </section>

      {/* Current Tech Section */}
      <section>
        <div
          className="flex justify-between items-center border-b-2 pb-2 mb-8"
        >
          <h2 className="text-2xl font-bold">Current technologies</h2>
          <Link href="/skills" className="link flex items-center gap-2 ">
            <span>Full skill overview</span>
            <ArrowRightIcon className="size-5 cursor-pointer animate-pulse" />
          </Link>
        </div>
        <section
          className="skills-section"
        >
          <Skills />
        </section>
      </section>


      {/* Education Section */}
      <section>
        <section
          className="mb-8"
        >
          <div>
            <h2 className="text-2xl font-bold mb-6 border-b-2 pb-2">Education & Experience</h2>
            <Timeline />
          </div>
        </section>
      </section>


      {/* Project Section */}
      <section className="flex flex-col gap-8">
        <div
          className="flex justify-between items-center border-b-2 pb-3"
        >
          <h2 className="text-2xl font-bold">Featured projects</h2>
          <Link href="/projects" className="link flex items-center gap-2">
            <span>view more</span>
            <ArrowRightIcon className="size-5 cursor-pointer animate-pulse" />
          </Link>
        </div>
        <Projects limit={2} />
      </section>
    </div>
  );
} 