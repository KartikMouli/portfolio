'use client';

import Image from "next/image";
import Link from "next/link";
import Socials from "@/components/socials/Socials";

import Projects from "@/components/project/Projects";
import { ArrowRightIcon, AtSign, MapPinHouseIcon } from "lucide-react";

import { useEffect, useState } from "react";
import { motion, useAnimation } from "framer-motion";
import Chatbot from "@/components/chatbot/Chatbot";
import Skills from "@/components/skill/Skills";
import ResumeButton from "@/components/resume-button/ResumeButton";

export default function Home() {
  const [isFlipped, setIsFlipped] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const controls = useAnimation();

  useEffect(() => {
    const timer = setTimeout(() => setIsFlipped(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
        if (entry.isIntersecting) {
          controls.start('visible');
        }
      },
      { threshold: 0.1 }
    );

    const currentElement = document.querySelector('.skills-section');
    if (currentElement) observer.observe(currentElement);

    return () => {
      if (currentElement) observer.unobserve(currentElement);
    };
  }, [controls]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className="flex flex-col gap-16 mt-8"
    >
      {/* Hero Section */}
      <section className="sm:pb-0 sm:min-h-0 sm:pt-10 md:pt-6 flex flex-col justify-center md:justify-start items-center text-center md:text-left md:px-0 gap-10">
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="flex flex-col md:flex-row-reverse items-center md:items-start md:justify-between gap-6 md:gap-8 w-full max-w-4xl mx-auto"
        >

          <motion.div
            className="avatar-container relative"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1 }}
            onHoverStart={() => setIsFlipped(true)}
            onHoverEnd={() => setIsFlipped(false)}
            onClick={() => setIsFlipped((prev) => !prev)}
          >
            <motion.div
              className="relative w-36 h-36 md:w-40 md:h-40"
              animate={{
                rotateY: isFlipped ? 180 : 0,
              }}
              initial={{ rotateY: 0 }}
              transition={{
                duration: 1,
                ease: "easeInOut",
              }}
              style={{
                transformStyle: "preserve-3d",
                perspective: "1000px",
              }}
            >
              {/* Front Side */}
              <motion.div
                className="absolute w-full h-full"
                style={{
                  backfaceVisibility: "hidden",
                }}
              >
                <Image
                  className="rounded-full border-2 border-gray-300"
                  src="/img/pfp.jpg"
                  alt="Front Profile of Kartik"
                  width={175}
                  height={175}
                  priority
                />
              </motion.div>

              {/* Back Side */}
              <motion.div
                className="absolute w-full h-full"
                style={{
                  transform: "rotateY(180deg)",
                  backfaceVisibility: "hidden",
                }}
              >
                <Image
                  className="rounded-full border-2 border-gray-300"
                  src="/img/pfp-avatar.jpg"
                  alt="Back Profile of Kartik"
                  width={175}
                  height={175}
                  priority
                />
              </motion.div>
            </motion.div>
          </motion.div>

         

          <div className="flex flex-col items-center md:items-start">
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.8 }}
              className="text-3xl md:text-4xl font-extrabold text-gradient mb-2"
            >
              Hey, I&apos;m Kartik Mouli <span className="waving-hand">👋</span>
            </motion.h1>
            <motion.h2
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 1 }}
              className="text-lg md:text-xl mb-2 dark:text-gray-300"
            >
              Full-Stack Web Developer
            </motion.h2>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 1.2 }}
              className="flex gap-2 items-center justify-center align-center mb-3 font-light dark:text-gray-300"
            >
              <MapPinHouseIcon width={16} height={16} />{" "}
              <h3 className="text-md">Nashik, Maharashtra, 🇮🇳</h3>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 1.4 }}
              className="md:flex dark:text-gray-200 text-sm md:text-base leading-relaxed mb-5 md:mb-6"
            >
              <span className="font-mono dark:text-white mr-1">IITP CSE&apos;24</span> |{" "}
              <div className="flex items-center ml-1">
                <span >Full Stack Developer Intern</span>
                <Link
                  href="https://unizoy.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-muted-foreground hover:text-foreground transition-colors duration-200"
                >
                  <AtSign className="size-4 ml-1" />Unizoy
                </Link>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 1.6 }}
              className="flex flex-wrap justify-center md:justify-start gap-10 md:gap-5 mt-5"
            >
              <ResumeButton />
              <Socials />
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Current Tech Section */}
      <section className="mb-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="flex justify-between items-center border-b-2 dark:border-gray-700 pb-2 mb-8"
        >
          <h2 className="text-2xl font-bold">Current technologies</h2>
          <Link href="/skills" className="link flex items-center gap-2 ">
            <span>Full skill overview</span>
            <ArrowRightIcon className="size-5 cursor-pointer animate-pulse" />
          </Link>
        </motion.div>
        <motion.section
          className="skills-section"
          initial="hidden"
          animate={controls}
          variants={{
            visible: {
              opacity: 1,
              y: 0,
              transition: {
                duration: 0.8,
                staggerChildren: 0.1
              }
            },
            hidden: {
              opacity: 0,
              y: 50
            }
          }}
        >
          <Skills />
        </motion.section>
      </section>

      {/* Project Section */}
      <section className="flex flex-col gap-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="flex justify-between items-center border-b-2 dark:border-gray-700 pb-3"
        >
          <h2 className="text-2xl font-bold">Featured projects</h2>
          <Link href="/projects" className="link flex items-center gap-2">
            <span>view more</span>
            <ArrowRightIcon className="size-5 cursor-pointer animate-pulse" />
          </Link>
        </motion.div>
        <Projects limit={2} />
      </section>

      {/* Chatbot Component */}
      <Chatbot />
    </motion.div>
  );
}
