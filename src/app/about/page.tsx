'use client';

import Education from '@/components/Education';
import StatsCard from '@/components/StatsCard';
import { Button } from '@/components/ui/button';
import { ArrowRightIcon } from 'lucide-react';
import Link from 'next/link';
import React from 'react';
import { motion } from 'framer-motion';

function About() {
    // Fade in and slide up animation for sections
    const sectionVariants = {
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

    // Text animation variants
    const textVariants = {
        hidden: { opacity: 0, y: 10 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.4 }
        }
    };

    // Button animation variants
    const buttonVariants = {
        hover: { 
            scale: 1.05,
            transition: { duration: 0.2 }
        },
        tap: { scale: 0.95 }
    };

    // Stats card container variants
    const statsContainerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2,
                delayChildren: 0.3
            }
        }
    };

    // Stats card item variants
    const statsItemVariants = {
        hidden: { opacity: 0, scale: 0.9 },
        visible: {
            opacity: 1,
            scale: 1,
            transition: {
                duration: 0.5,
                ease: "easeOut"
            }
        }
    };

    return (
        <>
            {/* About Me Section */}
            <motion.section 
                className='mt-8 pb-2'
                variants={sectionVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
            >
                <motion.h2 
                    className="text-3xl font-bold mb-4"
                    variants={textVariants}
                >
                    About me
                </motion.h2>
                <motion.div 
                    className="dark:text-white px-4 py-6 mb-16 mt-8 rounded-lg dark:bg-[#1a1a1a] border dark:border-hidden border-gray-300"
                    variants={textVariants}
                >
                    <motion.p 
                        className="mb-2"
                        variants={textVariants}
                    >
                        Hey! I&apos;m <motion.span 
                            className="font-semibold"
                            whileHover={{ scale: 1.1 }}
                            transition={{ duration: 0.2 }}
                        >Kartik</motion.span>, a proud <motion.span className="italic">IIT Patna CSE &apos;24</motion.span> graduate. I focus on full-stack development, Web3, and competitive programming.
                    </motion.p>
                    <motion.p 
                        className="mb-2"
                        variants={textVariants}
                    >
                        Outside of coding, you&apos;ll find me on the football field or shooting hoops. I&apos;m also a huge movie enthusiast—whether it&apos;s action-packed blockbusters or thought-provoking dramas.
                    </motion.p>
                    <motion.p 
                        className='mb-2'
                        variants={textVariants}
                    >
                        Originally from <motion.span className="italic">Nashik</motion.span>, I&apos;m always excited about creating new tech and exploring the world of open-source.
                    </motion.p>
                    <motion.p 
                        className="mt-4"
                        variants={textVariants}
                    >
                        <motion.span
                            whileHover="hover"
                            whileTap="tap"
                            variants={buttonVariants}
                        >
                            <Link href="/contact" className='font-semibold inline-block'>
                                Let&apos;s connect!
                            </Link>
                        </motion.span> I&apos;m open to discussing tech, sports, or the latest movies.
                    </motion.p>
                </motion.div>
            </motion.section>

            {/* Skills Section */}
            <motion.section 
                className="mb-16"
                variants={sectionVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
            >
                <motion.h3 
                    className="text-3xl font-bold mb-4 dark:text-gray-100"
                    variants={textVariants}
                >
                    Skills
                </motion.h3>
                <motion.p 
                    className="dark:text-gray-300 mb-4"
                    variants={textVariants}
                >
                    Want to know more about the tools and technologies I work with? Click below to dive into my skillset.
                </motion.p>
                <motion.div
                    whileHover="hover"
                    whileTap="tap"
                    variants={buttonVariants}
                >
                    <Link href="/skills">
                        <Button variant="outline" className='p-6'>
                            Explore Skills
                            <motion.span
                                animate={{ x: [0, 5, 0] }}
                                transition={{ 
                                    duration: 1.5, 
                                    repeat: Infinity,
                                    ease: "easeInOut" 
                                }}
                            >
                                <ArrowRightIcon className="size-5" />
                            </motion.span>
                        </Button>
                    </Link>
                </motion.div>
            </motion.section>

            {/* Education Section */}
            <motion.section 
                className="mb-16"
                variants={sectionVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
            >
                <motion.h2 
                    className="text-3xl font-bold mb-10 dark:text-gray-100"
                    variants={textVariants}
                >
                    Learning Journey
                </motion.h2>
                <Education />
            </motion.section>

            {/* Stats Overview Section */}
            <motion.section 
                className='mb-16'
                variants={sectionVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
            >
                <motion.h3 
                    className="text-3xl font-bold mt-6 mb-6"
                    variants={textVariants}
                >
                    Data Playground
                </motion.h3>
                <motion.div 
                    className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-10 align-center items-center"
                    variants={statsContainerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                >
                    {[
                        {
                            src: "https://leetcard.jacoblin.cool/monchi02?ext=heatmap",
                            alt: "LeetCode Heatmap Stats"
                        },
                        {
                            src: "https://raw.githubusercontent.com/KartikMouli/cf-stats/refs/heads/main/output/light_card.svg",
                            alt: "Codeforces Statistics Card"
                        },
                        {
                            src: "https://github-readme-streak-stats.herokuapp.com/?user=kartikmouli&theme=dark",
                            alt: "GitHub Streak Stats"
                        },
                        {
                            src: "https://holopin.me/kartikmouli",
                            alt: "Holopin Badges"
                        }
                    ].map((stat, index) => (
                        <motion.div
                            key={index}
                            variants={statsItemVariants}
                            whileHover={{ scale: 1.02 }}
                            transition={{ duration: 0.2 }}
                        >
                            <StatsCard src={stat.src} alt={stat.alt} />
                        </motion.div>
                    ))}
                </motion.div>
            </motion.section>
        </>
    );
}

export default About;
