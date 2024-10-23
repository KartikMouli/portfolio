import Image from "next/image";
import Link from "next/link";
import Socials from "@/components/Socials";
import ResumeButton from "@/components/ui/ResumeButton";
import Projects from "@/components/Projects";
import { ArrowRightIcon } from "lucide-react";
import Skills from "@/components/Skills";

export default function Home() {
  return (
    <div className="flex flex-col gap-16 pb-16 text-white">

      {/* Hero Section */}
      <section className="flex flex-col mt-8 gap-8 md:flex-row-reverse md:items-center md:justify-between">
        <Image
          className="rounded-lg shadow-lg"
          src="/img/pfp.jpg"
          alt="pfp of Kartik"
          width={175}
          height={175}
          priority
        />
        <div className="flex flex-col ">
          <h1 className="title text-4xl mb-2 font-extrabold text-gradient">
            Kartik Mouli
          </h1>
          <h2 className="text-xl text-gray-300 mb-4">Full Stack Web Developer</h2>
          <h3 className="text-lg text-gray-400 mb-4">📍 Nashik, Maharashtra, India</h3>
          <p className="text-gray-200 text-sm leading-relaxed">
          IITP CSE &apos;24 | Exploring Web3 and advancing in Fullstack Development
          </p>

          <section className="mt-8 flex items-center gap-6">
            <ResumeButton />
            <Socials />
          </section>
        </div>
      </section>

      {/* Skills Section */}
      <section className="mb-4">
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
