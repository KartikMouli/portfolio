'use client';

import Image from "next/image";
import Link from "next/link";
import Socials from "@/components/socials/Socials";
import Projects from "@/components/project/Projects";
import { ArrowRightIcon, AtSign, MapPinHouseIcon, Music } from "lucide-react";
import { useEffect, useState } from "react";
import { motion, useAnimation } from "framer-motion";
import Skills from "@/components/skill/Skills";
import ResumeButton from "@/components/resume-button/ResumeButton";
import { useSpotifyData } from "@/hooks/useSpotifyData";
import SpotifyWidget from "@/components/spotify/SpotifyWidget";
import { FaSpotify } from "react-icons/fa";
import Timeline from "../about/Timeline";

export default function HomeClient() {
  const [isFlipped, setIsFlipped] = useState(true);
  const [_, setIsVisible] = useState(false);
  const { data: spotifyData } = useSpotifyData();
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

  const staggerChildren = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className="flex flex-col gap-10 mt-8"
    >
      {/* Hero Section */}
      <section className=" mt-4 flex flex-col justify-center items-center text-center md:text-left">
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="flex flex-col md:flex-row items-center md:items-start gap-8 md:gap-12 w-full max-w-4xl mx-auto px-4"
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
              className="relative w-32 h-32 md:w-40 md:h-40"
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
                  className="rounded-full border-2 border-gray-300 dark:border-gray-700"
                  src="/img/pfp-avatar.jpg"
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
                  className="rounded-full border-2 border-gray-300 dark:border-gray-700"
                  src="/img/pfp.jpg"
                  alt="Back Profile of Kartik"
                  width={175}
                  height={175}
                  priority
                />
              </motion.div>
            </motion.div>
          </motion.div>

          <div className="flex flex-col items-center md:items-start gap-4">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.8 }}
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
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 1 }}
              className="flex items-center gap-2 text-muted-foreground"
            >
              <MapPinHouseIcon className="size-4" />
              <span className="text-sm">Nashik, Maharashtra, 🇮🇳</span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 1.2 }}
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
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 1.4 }}
              className="flex flex-wrap justify-center md:justify-start gap-4 mt-2"
            >
              <ResumeButton />
              <Socials />
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Current Tech Section */}
      <section>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="flex justify-between items-center border-b-2 pb-2 mb-8"
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


      {/* Education Section */}
      <section>
        <motion.section
          className="mb-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerChildren}
        >
          <motion.div variants={fadeInUp}>
            <h2 className="text-2xl font-bold mb-6 border-b-2 pb-2">Education & Experience</h2>
            <Timeline />
          </motion.div>
        </motion.section>
      </section>


      {/* Project Section */}
      <section className="flex flex-col gap-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="flex justify-between items-center border-b-2 pb-3"
        >
          <h2 className="text-2xl font-bold">Featured projects</h2>
          <Link href="/projects" className="link flex items-center gap-2">
            <span>view more</span>
            <ArrowRightIcon className="size-5 cursor-pointer animate-pulse" />
          </Link>
        </motion.div>
        <Projects limit={2} />
      </section>

      {/* Spotify Section */}
      {spotifyData?.is_playing && spotifyData?.item?.id && (
        <section className="flex flex-col gap-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="flex flex-col md:flex-row items-center md:items-start gap-8 md:gap-12 w-full max-w-5xl mx-auto px-4"
          >
            {/* Left side - Text */}
            <div className="flex flex-col items-center md:items-start gap-4 w-full md:w-1/2">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="flex flex-col gap-3"
              >
                <div className="flex items-center gap-2">
                  <FaSpotify className="text-[#1DB954] text-2xl" />
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-[#1DB954] to-[#1DB954]/80 bg-clip-text text-transparent">
                    Join the Vibe
                  </h2>
                </div>
                <p className="text-muted-foreground text-lg">
                  Play the same song as me and let&apos;s vibe together! <Music className="size-5 inline-block ml-1" />
                </p>
                <p className="text-sm text-muted-foreground/80">
                  Click the card to play this song on your device !
                </p>
              </motion.div>
            </div>

            {/* Right side - Spotify Widget */}
            <div className="w-full md:w-1/2">
              <SpotifyWidget />
            </div>
          </motion.div>
        </section>
      )}
    </motion.div>
  );
} 