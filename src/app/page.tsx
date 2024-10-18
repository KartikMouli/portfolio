import Image from "next/image";
import { ArrowDownRight, FileDown } from "lucide-react";
import Link from "next/link";
import Socials from "@/components/Socials";
import ResumeButton from "@/components/ResumeButton";


const TED_BIRTH_YEAR = 2002

export default function Home() {
  return (
    <div className="mt-8 flex flex-col gap-16 pb-16">
      <section className="flex flex-col items-start gap-8 md:flex-row-reverse md:items-center md:justify-between">
        <Image
          className="rounded-lg"
          src="/pfp.jpg"
          alt="pfp of Kartik"
          width={175}
          height={175}
          priority
        />
        <div className="flex flex-col">
          <h1 className="title text-4xl mb-2">Kartik Mouli</h1>
          <h2 className="text-xl text-gray-400 mb-4">Full Stack Web Developer</h2>
          <h3 className="text-lg text-gray-400 mb-4">📍 Nashik, Maharashtra, India IN</h3>
          <p className="text-gray-300 text-sm">
            Building Real Products For Real Clients, Not Just More Projects
          </p>

          <section className="mt-8 flex items-center gap-8">
            <ResumeButton/>
            <Socials />
          </section>
        </div>
      </section>
    </div>
  );
}
