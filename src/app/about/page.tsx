import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { H1, Lead } from '@/components/typography';
import Socials from '@/components/socials';
import { siteConfig } from '@/config/site';

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
        <H1 className="mb-6">{siteConfig.author.name}</H1>

        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <Lead className="mb-4">
              Hey! I&apos;m a proud{' '}
              <span className="font-medium">IIT Patna CSE &apos;24</span>{' '}
              graduate. I focus on full-stack development, Web3, and competitive
              programming.
            </Lead>
            <Lead className="mb-4">
              Outside of coding, you&apos;ll find me on the football field or
              shooting hoops. I&apos;m also a huge movie enthusiast—whether
              it&apos;s action-packed blockbusters or thought-provoking dramas.
            </Lead>
            <Lead className="mb-6">
              Originally from <span className="font-medium">Nashik</span>,
              I&apos;m always excited about creating new tech and exploring the
              world of open-source.
            </Lead>
            <Socials />
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
