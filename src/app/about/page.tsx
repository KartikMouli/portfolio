import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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
