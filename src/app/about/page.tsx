'use client';

import {
  FaFacebook,
  FaInstagram,
  FaSnapchat,
  FaThreads,
} from 'react-icons/fa6';
import Link from 'next/link';
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

function About() {
  return (
    <div className="max-w-4xl mx-auto px-4 ">
      {/* Hero Section */}
      <section className="mb-20">
        <div>
          <Badge variant="outline" className="mb-4">
            About Me
          </Badge>
          <h1 className="text-4xl font-bold mb-6">kartik</h1>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <p className="text-lg text-muted-foreground mb-4">
              Hey! I&apos;m a proud{' '}
              <span className="font-medium">IIT Patna CSE &apos;24</span>{' '}
              graduate. I focus on full-stack development, Web3, and competitive
              programming.
            </p>
            <p className="text-lg text-muted-foreground mb-4">
              Outside of coding, you&apos;ll find me on the football field or
              shooting hoops. I&apos;m also a huge movie enthusiast—whether
              it&apos;s action-packed blockbusters or thought-provoking dramas.
            </p>
            <p className="text-lg text-muted-foreground mb-6">
              Originally from <span className="font-medium">Nashik</span>,
              I&apos;m always excited about creating new tech and exploring the
              world of open-source.
            </p>
            <div className="flex gap-4">
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
                    <p className="text-sm text-muted-foreground">
                      Years Experience
                    </p>
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
                    <p className="text-sm text-muted-foreground">
                      GitHub Commits
                    </p>
                    <p className="text-2xl font-semibold">300+</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}

export default About;
