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
                <h2 className="text-3xl font-bold mb-4">About Me</h2>
                <div className="text-white p-6 mb-16 mt-8 rounded-lg bg-[#1a1a1a]">
                    <p className="mb-2">
                        Hey! I&apos;m <span className="font-semibold">Kartik</span>, a proud <span className="italic">IIT Patna CSE '24</span> graduate. I focus on full-stack development, Web3, and competitive programming.
                    </p>
                    <p className="mb-2">
                        Outside of coding, you’ll find me on the football field or shooting hoops. I’m also a huge movie enthusiast—whether it’s action-packed blockbusters or thought-provoking dramas.
                    </p>
                    <p className='mb-2'>
                        Originally from <span className="italic">Nashik</span>, I’m always excited about creating new tech and exploring the world of open-source.
                    </p>
                    <p className="mt-4">
                        <Link href="/contact" className='font-semibold hover:scale-105 transition-transform inline-block'>Let’s connect!</Link> I’m open to discussing tech, sports, or the latest movies.
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
            <section className="mb-8">
                <h2 className="text-3xl font-bold mb-6 text-gray-100">Learning Journey</h2>
                <Education />
            </section>

            {/* Stats Overview Section */}
            <section className='mb-16'>
                <h3 className="text-3xl font-bold mt-6 mb-6">Data Playground</h3>
                <div className="flex gap-4 flex-wrap">
                    <div className="flex-1 rounded overflow-hidden shadow-lg p-4">
                        <Image
                            src="https://github-readme-streak-stats.herokuapp.com/?user=kartikmouli&theme=dark"
                            alt="GitHub Streak"
                            width={400}
                            height={300}
                        />
                    </div>
                    <div className="flex-1 rounded overflow-hidden shadow-lg p-4">
                        <Image
                            src="https://leetcard.jacoblin.cool/monchi02?ext=heatmap"
                            alt="LeetCode Stats"
                            width={400}
                            height={300}
                        />
                    </div>
                </div>
            </section>
        </>
    );
}

export default About;
