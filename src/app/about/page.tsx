import Education from '@/components/Education';
import { ArrowRightIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';


function About() {
    return (
        <>
            {/* About Me Section */}
            <section className='mt-8 pb-2'>
                <h2 className="text-3xl font-bold mb-4">About me</h2>
                <div className="text-white p-6 mb-16 mt-8 rounded-lg bg-[#1a1a1a]">
                    <p className="mb-2">
                        Hey! I&apos;m <span className="font-semibold">Kartik</span>, a proud <span className="italic">IIT Patna CSE &apos;24</span> graduate. I focus on full-stack development, Web3, and competitive programming.
                    </p>
                    <p className="mb-2">
                        Outside of coding, you&apos;ll find me on the football field or shooting hoops. I&apos;m also a huge movie enthusiast—whether it&apos;s action-packed blockbusters or thought-provoking dramas.
                    </p>
                    <p className='mb-2'>
                        Originally from <span className="italic">Nashik</span>, I&apos;m always excited about creating new tech and exploring the world of open-source.
                    </p>
                    <p className="mt-4">
                        <Link href="/contact" className='font-semibold hover:scale-105 transition-transform inline-block'>Let&apos;s connect!</Link> I&apos;m open to discussing tech, sports, or the latest movies.
                    </p>
                </div>
            </section>

            {/* Skills Section */}
            <section className="mb-16">
                <h3 className="text-3xl font-bold mb-4 text-gray-100">Skills</h3>
                <p className="text-gray-300 mb-4">
                    Want to know more about the tools and technologies I work with? Click below to dive into my skillset.
                </p>
                <Link href="/skills">
                    <button className="px-4 py-2 flex items-center gap-2 hover:bg-white text-white hover:text-[#111111] rounded transition duration-300 border border-white">
                        Explore Skills
                        <ArrowRightIcon className="size-5" />
                    </button>
                </Link>
            </section>

            {/* Education Section */}
            <section className="mb-16">
                <h2 className="text-3xl font-bold mb-6 text-gray-100">Learning Journey</h2>
                <Education />
            </section>

            {/* Stats Overview Section */}
            <section className='mb-16'>
                <h3 className="text-3xl font-bold mt-6 mb-6">Data Playground</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 pr-24 gap-4">
                    <div className="pt-1 rounded overflow-hidden shadow-lg transition-transform transform hover:scale-105">
                        <Image
                            src="https://leetcard.jacoblin.cool/monchi02?ext=heatmap"
                            alt="LeetCode Stats"
                            width={400} // Set a wider width
                            height={150} // Set a taller height
                            className="w-300 h-auto"
                            priority // Ensure the image loads faster
                        />
                    </div>

                    <div className="rounded overflow-hidden shadow-lg transition-transform transform hover:scale-105">
                        <Image
                            src="https://raw.githubusercontent.com/KartikMouli/cf-stats/refs/heads/main/output/light_card.svg"
                            alt="Codeforces Stats"
                            width={400} // Set a wider width
                            height={150} // Set a taller height
                            className="w-300 h-auto"
                            priority // Ensure the image loads faster
                        />
                    </div>

                    <div className="rounded overflow-hidden shadow-lg transition-transform transform hover:scale-105">
                        <Image
                            src="https://github-readme-streak-stats.herokuapp.com/?user=kartikmouli&theme=dark"
                            alt="GitHub Stats"
                            width={400} // Set a wider width
                            height={150} // Set a taller height
                            className="w-300 h-auto"
                            priority // Ensure the image loads faster
                        />
                    </div>


                </div>
            </section>



        </>
    );
}

export default About;
