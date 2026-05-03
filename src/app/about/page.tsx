import {
  FaFacebook,
  FaInstagram,
  FaSnapchat,
  FaThreads,
} from 'react-icons/fa6';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { siteConfig } from '@/config/site';

const personalSocials = [
  {
    href: siteConfig.links.facebook,
    icon: <FaFacebook className="w-5 h-5" />,
    label: 'Facebook',
  },
  {
    href: siteConfig.links.instagram,
    icon: <FaInstagram className="w-5 h-5" />,
    label: 'Instagram',
  },
  {
    href: siteConfig.links.snapchat,
    icon: <FaSnapchat className="w-5 h-5" />,
    label: 'Snapchat',
  },
  {
    href: siteConfig.links.threads,
    icon: <FaThreads className="w-5 h-5" />,
    label: 'Threads',
  },
];

const quickStats = [
  { label: 'Years Experience', value: 'fresher' },
  { label: 'Projects', value: '20+' },
  { label: 'LeetCode', value: '600+' },
  { label: 'GitHub Commits', value: '300+' },
];

export default function About() {
  return (
    <div className="max-w-4xl mx-auto px-4">
      <section className="mb-20">
        <Badge variant="outline" className="mb-4">
          About Me
        </Badge>
        <h1 className="text-4xl font-bold mb-6">{siteConfig.author.name}</h1>

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
              {personalSocials.map(({ href, icon, label }) => (
                <Link
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  aria-label={label}
                >
                  {icon}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <Card className="border-none shadow-none">
              <CardHeader>
                <CardTitle className="text-xl">Quick Stats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  {quickStats.map((stat) => (
                    <div
                      key={stat.label}
                      className="p-4 bg-muted/50 rounded-lg"
                    >
                      <p className="text-sm text-muted-foreground">
                        {stat.label}
                      </p>
                      <p className="text-2xl font-semibold">{stat.value}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
