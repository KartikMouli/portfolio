import { Button } from '@/components/ui/button';
import Link from 'next/link';

const lastUpdated = 'Oct 2024';

export default function page() {
  return (
    <section className="mt-8 pb-16 max-w-3xl mx-auto px-4 sm:px-8">
      {/* Header Section */}
      <div className="space-y-4 mb-8">
        <h1 className="text-5xl font-bold dark:text-gray-100">
          Privacy Policy
        </h1>
        <p className="dark:text-gray-400">Last Updated: {lastUpdated}</p>
      </div>

      {/* Main Content */}
      <div className="space-y-8">
        <h2 className="text-3xl font-semibold dark:text-gray-200">Welcome!</h2>
        <p className="dark:text-gray-300">
          Thanks for stopping by! This <b>Privacy Policy</b> explains how things
          work here. Spoiler alert: my site is mainly a showcase for my work,
          and your privacy is a big deal—just not a huge one since I don&apos;t
          collect much.
        </p>

        <h2 className="text-3xl font-semibold dark:text-gray-200">
          Information I Collect (Spoiler: It&apos;s Not Much)
        </h2>
        <p className="dark:text-gray-300">
          Given that this is a static portfolio, I don&apos;t collect any
          personal data. That means no account creation, no tracking cookies,
          and definitely no hidden data collection—sounds like a dream, right?
        </p>

        <h3 className="text-2xl font-semibold dark:text-gray-200">
          Contact Information
        </h3>
        <p className="dark:text-gray-300">
          If you decide to drop me a line via email or the form, it&apos;s
          entirely up to you what information you share. I promise to use it
          solely to respond to your message—nothing more, nothing less.
        </p>

        <h2 className="text-3xl font-semibold dark:text-gray-200">
          How I Use the Information
        </h2>
        <p className="dark:text-gray-300">
          If I do receive any info, here&apos;s what I might do with it:
        </p>
        <ul className="list-disc pl-5 space-y-2 dark:text-gray-300">
          <li>Make sure the website is running smoothly</li>
          <li>
            Improve the site based on your feedback (yes, I actually care)
          </li>
          <li>
            Respond to your inquiries or feedback—because that&apos;s what
            polite people do
          </li>
        </ul>

        <h2 className="text-3xl font-semibold dark:text-gray-200">
          Sharing Information (I Don&apos;t)
        </h2>
        <p className="dark:text-gray-300">
          I don&apos;t sell, trade, or share your personal data. If you
          accidentally share any sensitive information, just let me know, and
          I&apos;ll help you get rid of it faster than you can say “privacy
          breach.”
        </p>

        <h2 className="text-3xl font-semibold dark:text-gray-200">
          Security (No System Is Perfect)
        </h2>
        <p className="dark:text-gray-300">
          While I do my best to keep your data secure, no system is flawless.
          I&apos;ll take reasonable steps to protect any shared info, but I
          can&apos;t guarantee absolute security—after all, I&apos;m not a
          magician.
        </p>

        <h2 className="text-3xl font-semibold dark:text-gray-200">
          Third-Party Links (Not My Circus, Not My Monkeys)
        </h2>
        <p className="dark:text-gray-300">
          My portfolio may contain links to other sites. I&apos;m not
          responsible for their privacy practices or content, so proceed with
          caution and read their policies too!
        </p>

        <h2 className="text-3xl font-semibold dark:text-gray-200">
          Your Rights (Because You Should Know)
        </h2>
        <p className="dark:text-gray-300">
          If you ever provide me with any personal information, you have the
          right to request access to it, ask for corrections, or request
          deletion. Just let me know, and I&apos;ll be happy to help—unless I
          can&apos;t find it, then we&apos;ll just chalk it up to the mysteries
          of the internet.
        </p>

        <h2 className="text-3xl font-semibold dark:text-gray-200">
          Policy Updates (Keeping You Informed)
        </h2>
        <p className="dark:text-gray-300">
          This policy is current as of <b>{lastUpdated}</b>. If anything
          changes, I&apos;ll update this page. Feel free to check back, but
          don&apos;t worry—I&apos;ll notify you if anything major happens. No
          surprise changes here!
        </p>

        {/* Contact Section with Button */}
        <h2 className="text-3xl font-semibold dark:text-gray-200">
          Have Questions?
        </h2>
        <p className="dark:text-gray-300 pb-2">
          Got any questions, concerns, or just feel like saying hello? You can
          email me at{' '}
          <Link
            href="mailto:kartikmouli156@gmail.com"
            className="font-semibold text-blue-500 underline hover:text-blue-300"
          >
            kartikmouli156@gmail.com
          </Link>{' '}
          or use the{' '}
          <Link
            href="/contact"
            className="font-semibold text-blue-500 underline hover:text-blue-300"
          >
            contact form
          </Link>
          .
        </p>

        <Link href="/contact">
          <Button className="mt-4">Contact Me</Button>
        </Link>
      </div>
    </section>
  );
}
