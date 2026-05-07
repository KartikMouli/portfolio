import { Button } from '@/components/ui/button';
import { H1, H2, H3, List, Muted, P } from '@/components/typography';
import Link from 'next/link';
import { siteConfig } from '@/config/site';

const lastUpdated = 'Oct 2024';

export default function PrivacyPage() {
  return (
    <section className="mt-8 pb-16 max-w-3xl mx-auto px-4 sm:px-8">
      {/* Header Section */}
      <div className="space-y-4 mb-8">
        <H1>Privacy Policy</H1>
        <Muted>Last Updated: {lastUpdated}</Muted>
      </div>

      {/* Main Content */}
      <div className="space-y-8">
        <H2>Welcome!</H2>
        <P>
          Thanks for stopping by! This <b>Privacy Policy</b> explains how things
          work here. Spoiler alert: my site is mainly a showcase for my work,
          and your privacy is a big deal—just not a huge one since I don&apos;t
          collect much.
        </P>

        <H2>Information I Collect (Spoiler: It&apos;s Not Much)</H2>
        <P>
          Given that this is a static portfolio, I don&apos;t collect any
          personal data. That means no account creation, no tracking cookies,
          and definitely no hidden data collection—sounds like a dream, right?
        </P>

        <H3>Contact Information</H3>
        <P>
          If you decide to drop me a line via email or the form, it&apos;s
          entirely up to you what information you share. I promise to use it
          solely to respond to your message—nothing more, nothing less.
        </P>

        <H2>How I Use the Information</H2>
        <P>If I do receive any info, here&apos;s what I might do with it:</P>
        <List>
          <li>Make sure the website is running smoothly</li>
          <li>
            Improve the site based on your feedback (yes, I actually care)
          </li>
          <li>
            Respond to your inquiries or feedback—because that&apos;s what
            polite people do
          </li>
        </List>

        <H2>Sharing Information (I Don&apos;t)</H2>
        <P>
          I don&apos;t sell, trade, or share your personal data. If you
          accidentally share any sensitive information, just let me know, and
          I&apos;ll help you get rid of it faster than you can say “privacy
          breach.”
        </P>

        <H2>Security (No System Is Perfect)</H2>
        <P>
          While I do my best to keep your data secure, no system is flawless.
          I&apos;ll take reasonable steps to protect any shared info, but I
          can&apos;t guarantee absolute security—after all, I&apos;m not a
          magician.
        </P>

        <H2>Third-Party Links (Not My Circus, Not My Monkeys)</H2>
        <P>
          My portfolio may contain links to other sites. I&apos;m not
          responsible for their privacy practices or content, so proceed with
          caution and read their policies too!
        </P>

        <H2>Your Rights (Because You Should Know)</H2>
        <P>
          If you ever provide me with any personal information, you have the
          right to request access to it, ask for corrections, or request
          deletion. Just let me know, and I&apos;ll be happy to help—unless I
          can&apos;t find it, then we&apos;ll just chalk it up to the mysteries
          of the internet.
        </P>

        <H2>Policy Updates (Keeping You Informed)</H2>
        <P>
          This policy is current as of <b>{lastUpdated}</b>. If anything
          changes, I&apos;ll update this page. Feel free to check back, but
          don&apos;t worry—I&apos;ll notify you if anything major happens. No
          surprise changes here!
        </P>

        {/* Contact Section with Button */}
        <H2>Have Questions?</H2>
        <P>
          Got any questions, concerns, or just feel like saying hello? You can
          email me at{' '}
          <Link
            href={`mailto:${siteConfig.author.email}`}
            className="font-semibold underline underline-offset-4 hover:text-muted-foreground transition-colors"
          >
            {siteConfig.author.email}
          </Link>{' '}
          or use the{' '}
          <Link
            href="/contact"
            className="font-semibold underline underline-offset-4 hover:text-muted-foreground transition-colors"
          >
            contact form
          </Link>
          .
        </P>

        <Link href="/contact">
          <Button className="mt-4">Contact Me</Button>
        </Link>
      </div>
    </section>
  );
}
