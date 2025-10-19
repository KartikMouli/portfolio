'use client';

import { Button } from '@/components/ui/button';
import { ArrowRightIcon } from 'lucide-react';
import { FaFacebook, FaInstagram, FaSnapchat, FaThreads } from "react-icons/fa6";
import Link from 'next/link';
import React from 'react';
import StatsCard from '@/components/about/StatsCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';


function About() {

    return (
        <div className="max-w-4xl mx-auto px-4 ">
            {/* Hero Section */}
            <section
                className="mb-20"
            >
                <div>
                    <Badge variant="outline" className="mb-4">About Me</Badge>
                    <h1 className="text-4xl font-bold mb-6">kartik</h1>
                </div>

                <div
                    className="grid md:grid-cols-2 gap-8"
                >
                    <div>
                        <p className="text-lg text-muted-foreground mb-4">
                            Hey! I&apos;m a proud <span className="font-medium">IIT Patna CSE &apos;24</span> graduate.
                            I focus on full-stack development, Web3, and competitive programming.
                        </p>
                        <p className="text-lg text-muted-foreground mb-4">
                            Outside of coding, you&apos;ll find me on the football field or shooting hoops.
                            I&apos;m also a huge movie enthusiast—whether it&apos;s action-packed blockbusters or
                            thought-provoking dramas.
                        </p>
                        <p className="text-lg text-muted-foreground mb-6">
                            Originally from <span className="font-medium">Nashik</span>, I&apos;m always excited
                            about creating new tech and exploring the world of open-source.
                        </p>
                        <div
                            className="flex gap-4"
                        >
                            <Link
                                href="https://facebook.com/kartikmouli"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-muted-foreground hover:text-foreground transition-colors"
                            >
                                <FaFacebook className="w-5 h-5" />
                            </Link>
                            <Link
                                href="https://instagram.com/kartikmouli"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-muted-foreground hover:text-foreground transition-colors"
                            >
                                <FaInstagram className="w-5 h-5" />
                            </Link>
                            <Link
                                href="https://snapchat.com/add/kartikmouli"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-muted-foreground hover:text-foreground transition-colors"
                            >
                                <FaSnapchat className="w-5 h-5" />
                            </Link>
                            <Link
                                href="https://threads.net/@kartikmouli"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-muted-foreground hover:text-foreground transition-colors"
                            >
                                <FaThreads className="w-5 h-5" />
                            </Link>
                        </div>
                    </div>

                    <div>
                        <Card className="border-none shadow-none">
                            <CardHeader>
                                <CardTitle className="text-xl">Quick Stats</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-4 bg-muted/50 rounded-lg">
                                        <p className="text-sm text-muted-foreground">Years Experience</p>
                                        <p className="text-2xl font-semibold">fresher</p>
                                    </div>
                                    <div className="p-4 bg-muted/50 rounded-lg">
                                        <p className="text-sm text-muted-foreground">Projects</p>
                                        <p className="text-2xl font-semibold">20+</p>
                                    </div>
                                    <div className="p-4 bg-muted/50 rounded-lg">
                                        <p className="text-sm text-muted-foreground">LeetCode</p>
                                        <p className="text-2xl font-semibold">600+</p>
                                    </div>
                                    <div className="p-4 bg-muted/50 rounded-lg">
                                        <p className="text-sm text-muted-foreground">GitHub Commits</p>
                                        <p className="text-2xl font-semibold">300+</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Skills Section */}
            <section
                className="mb-20"
            >
                <div>
                    <Badge variant="outline" className="mb-4">Skills & Expertise</Badge>
                    <h2 className="text-3xl font-bold mb-6">What I Do</h2>
                    <p className="text-lg text-muted-foreground mb-8">
                        Want to know more about the tools and technologies I work with?
                        Click below to dive into my skillset.
                    </p>
                    <Link href="/skills">
                        <Button variant="outline" className="hover:cursor-pointer group">
                            Explore Skills
                            <ArrowRightIcon className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </Button>
                    </Link>
                </div>
            </section>

            {/* Stats Section */}
            <section>
                <div>
                    <Badge variant="outline" className="mb-4">Achievements</Badge>
                    <h2 className="text-3xl font-bold mb-6">Data Playground</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                            <div
                                key={index}
                            >
                                <Card className="border-none shadow-none">
                                    <StatsCard src={stat.src} alt={stat.alt} />
                                </Card>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}

export default About;