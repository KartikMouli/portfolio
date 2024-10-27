import Image from "next/image";
import Link from "next/link";
import Socials from "@/components/Socials";
import ResumeButton from "@/components/ui/ResumeButton";
import Projects from "@/components/Projects";
import { ArrowDown, ArrowRightIcon } from "lucide-react";
import Skills from "@/components/Skills";

export default function Home() {
  return (
    <div className="flex flex-col gap-16 pb-16 text-white">

      {/* Hero Section */}
      <section className="min-h-screen md:pt-20 flex flex-col justify-center md:justify-start items-center  text-center md:text-left px-4 md:px-0 gap-10">
        <div className="flex flex-col md:flex-row-reverse items-center md:justify-between gap-6 md:gap-8 w-full max-w-4xl mx-auto">
          <Image
            className="rounded-lg shadow-lg w-36 h-36 md:w-44 md:h-44" // Adjust image size responsively
            src="/img/pfp.jpg"
            alt="pfp of Kartik"
            width={175}
            height={175}
            priority
          />

          <div className="flex flex-col items-center md:items-start">
            <h1 className="text-3xl md:text-4xl font-extrabold text-gradient mb-2">Kartik Mouli</h1>
            <h2 className="text-lg md:text-xl text-gray-300 mb-2">Full Stack Developer</h2>
            <h3 className="text-sm text-gray-400 mb-3">
              <span className="text-gray-300">⚲</span> Maharashtra, <span className="text-xs">IN 🇮🇳</span>
            </h3>
            <p className="text-gray-200 text-sm md:text-base leading-relaxed mb-5 md:mb-6">
              IITP CSE &apos;24 | Exploring Web3 and advancing in Fullstack Development
            </p>
            <div className="flex flex-wrap justify-center md:justify-start gap-10 md:gap-5 mt-5">
              <ResumeButton />
              <Socials />
            </div>
          </div>
        </div>

        {/* Scroll Down Icon */}
        <div className="flex justify-center pb-8 mt-8 md:mt-16">
          <Link href="#technologies" scroll={true} >
            <ArrowDown className="w-5 h-5 md:w-6 md:h-6 animate-bounce text-gray-300" />
          </Link>
        </div>
      </section>


      {/* Skills Section */}
      <section id="technologies" className="mb-4 pt-24 -mt-16">
        <div className="flex justify-between items-center border-b-2 border-gray-700 pb-2 mb-8">
          <h2 className="text-3xl font-bold text-gray-100 ">
            Current technologies
          </h2>
          <Link href="/skills" className="link flex items-center gap-2 font-light hover:scale-105">
            <ArrowRightIcon className="size-5" />
            <span>Full skill overview</span>
          </Link>
        </div>
        <Skills />
      </section>



      {/* Project Section */}

      <section className="flex flex-col gap-8">

        <div className="flex justify-between items-center border-b-2 border-gray-700 pb-3">
          <h2 className="text-3xl font-bold  text-gray-100 ">Featured projects</h2>
          <Link href="/projects" className="link flex items-center gap-2 font-light hover:scale-105">
            <ArrowRightIcon className="size-5 " />
            <span>view more</span>
          </Link>
        </div>

        <Projects limit={2} />
      </section>
    </div>
  );
}
