import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import Image from 'next/image';
import Link from 'next/link';
import Markdown from 'react-markdown';
import { ArrowRight, Globe } from 'lucide-react';
import { FaGithub } from 'react-icons/fa';
import type { z } from 'zod';
import type { ProjectSchema } from '@/lib/schemas';

type Project = z.infer<typeof ProjectSchema>;

interface Props {
  project: Project;
}

/**
 * Fallback rendered in the card header when a project has no `image`.
 * Renders the full project name in serif (Playfair Display) on a
 * `bg-muted` block, same height as image cards so the grid stays
 * aligned. Long names clamp to two lines with an ellipsis.
 *
 * `aria-hidden` is correct here: the same name is rendered as the
 * `<CardTitle>` below, so exposing it twice to assistive tech adds
 * no information.
 */
function NoImageFallback({ name }: { name: string }) {
  return (
    <div className="flex h-40 w-full items-center justify-center bg-muted px-6 text-muted-foreground select-none">
      <span
        className="line-clamp-2 text-center font-serif text-2xl tracking-tight"
        aria-hidden
      >
        {name}
      </span>
    </div>
  );
}

export function ProjectCard({ project }: Props) {
  const { name, href, description, image, tags, links, caseStudy } = project;

  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="p-4">
        {image ? (
          <Link href={href || image}>
            <Image
              src={image}
              alt={name}
              width={500}
              height={300}
              className="h-40 w-full object-cover object-top"
              priority
            />
          </Link>
        ) : href ? (
          <Link href={href} target="_blank" rel="noopener noreferrer">
            <NoImageFallback name={name} />
          </Link>
        ) : (
          <NoImageFallback name={name} />
        )}
      </CardHeader>
      <CardContent className="flex flex-col gap-2 flex-1">
        <CardTitle>{name}</CardTitle>
        <div className="prose max-w-full text-pretty font-sans text-xs text-muted-foreground dark:prose-invert">
          <Markdown>{description}</Markdown>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col items-start gap-4 mt-auto">
        {tags && tags.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {tags.toSorted().map((tag) => (
              <Badge
                key={tag}
                className="px-1 py-0 text-[10px]"
                variant="secondary"
              >
                {tag}
              </Badge>
            ))}
          </div>
        )}
        {links && links.length > 0 && (
          <div className="flex w-full flex-row flex-wrap items-center gap-2">
            {links.map((link) => (
              <Link
                href={link.href ?? '#'}
                key={link.name ?? link.href}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Badge className="flex gap-2 px-2 py-1 text-[10px]">
                  {link.name === 'Live Demo' ? (
                    <Globe className="size-3" />
                  ) : (
                    <FaGithub className="size-3" />
                  )}
                  {link.name}
                </Badge>
              </Link>
            ))}
          </div>
        )}
        {/* Case-study link — internal navigation, rendered as a small
            typed text link rather than another badge to differentiate
            it from the external-link pills above. */}
        {caseStudy && (
          <Link
            href={`/projects/${caseStudy}`}
            className="group inline-flex items-center gap-1 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Read the case study
            <ArrowRight className="size-3 transition-transform group-hover:translate-x-0.5" />
          </Link>
        )}
      </CardFooter>
    </Card>
  );
}
