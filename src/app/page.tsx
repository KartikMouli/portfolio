'use client'

import Image from "next/image";
import Link from "next/link";
import Socials from "@/components/Socials";
import ResumeButton from "@/components/ResumeButton";
import Projects from "@/components/Projects";
import { ArrowDown, ArrowRightIcon, MapPinHouseIcon } from "lucide-react";
import Skills from "@/components/Skills";
import { useEffect, useState } from "react";

export default function Home() {

  const scrollToTechnologies = () => {
    const section = document.getElementById('currtechnologies');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const [isFlipped, setIsFlipped] = useState(true);

  useEffect(() => {

    // Rotate back after 2 seconds
    const timer = setTimeout(() => setIsFlipped(false), 1500);

    // Cleanup timer on component unmount
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex flex-col gap-16 pb-16">

      {/* Hero Section */}
      <section className="min-h-screen pb-10 sm:pb-0 sm:min-h-0 md:pt-10 flex flex-col justify-center md:justify-start items-center text-center md:text-left md:px-0 gap-10">
        <div className="flex flex-col md:flex-row-reverse items-center md:justify-between gap-6 md:gap-8 w-full max-w-4xl mx-auto">
          <div className="avatar-container">
            <div className={`avatar front ${isFlipped ? 'flipped' : ''}`}>
              <Image
                className="rounded-lg w-36 h-36 md:w-44 md:h-40"
                src="/img/pfp.jpg"
                alt="Front Profile of Kartik"
                width={175}
                height={175}
                priority
              />
            </div>
            <div className={`avatar back ${isFlipped ? 'flipped' : ''}`}>
              <Image
                className="rounded-lg w-36 h-36 md:w-44 md:h-40"
                src="/img/pfp-avatar.jpg"
                alt="Back Profile of Kartik"
                width={175}
                height={175}
                priority
              />
            </div>

          </div>

          <div className="flex flex-col items-center md:items-start">
            <h1 className="text-3xl md:text-4xl font-extrabold text-gradient mb-2">Hey, I&apos;m Kartik <span className="waving-hand">👋</span></h1>
            <h2 className="text-lg md:text-xl mb-2  dark:text-gray-300">Full-Stack Developer & Competitive Programmer</h2>
            <div className="flex gap-2 items-center justify-center align-center mb-3 font-light dark:text-gray-300" >
              <MapPinHouseIcon width={16} height={16} /> <h3 className="text-md">Nashik, Maharashtra, 🇮🇳</h3>
            </div>
            <p className="dark:text-gray-200 text-sm md:text-base  leading-relaxed mb-5 md:mb-6">
              <span className="font-mono dark:text-white">IITP CSE&apos;24</span> | Exploring Web3 and advancing in Fullstack Development
            </p>
            <div className="flex flex-wrap justify-center md:justify-start gap-10 md:gap-5 mt-5">
              <ResumeButton />
              <Socials />
            </div>
          </div>

          {/* Arrow Down Button */}
          <div className="relative bottom-1 pb-8 mt-7 mb-6 md:hidden">
            <button onClick={scrollToTechnologies} aria-label="Scroll down to current technologies">
              <ArrowDown className="w-5 h-5 md:w-6 md:h-6 animate-bounce cursor-pointer" />
            </button>
          </div>

        </div>
      </section>


      {/* Current Tech Section */}
      <section id="currtechnologies" className="mb-4 pt-24 -mt-16 md:mb-0 md:pt-0 md:-mt-0">
        <div className="flex justify-between items-center border-b-2 dark:border-gray-700 pb-2 mb-8">
          <h2 className="text-3xl font-bold">
            Current technologies
          </h2>
          <Link href="/skills" className="link flex items-center gap-2 ">
            <span>Full skill overview</span>
            <ArrowRightIcon className="size-5 cursor-pointer animate-pulse" />

          </Link>
        </div>
        <Skills />
      </section>



      {/* Project Section */}

      <section className="flex flex-col gap-8">

        <div className="flex justify-between items-center border-b-2 dark:border-gray-700 pb-3">
          <h2 className="text-3xl font-bold ">Featured projects</h2>
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
