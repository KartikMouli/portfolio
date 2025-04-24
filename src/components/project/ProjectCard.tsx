import { Badge } from "@/components/ui/badge";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import Markdown from "react-markdown";
import { FaGithub, FaExternalLinkAlt } from "react-icons/fa";

interface ProjectLink {
    href: string;
    name: string;
    icon?: string;
}

interface Project {
    name: string;
    href?: string;
    description: string;
    image?: string;
    tags?: string[];
    links?: ProjectLink[];
}

interface Props {
    project: Project;
}

export function ProjectCard({ project }: Props) {
    const { name, href, description, image, tags, links } = project;

    return (
        <Card className="flex flex-col h-full">
            <CardHeader className="p-4">
                {image && (
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
                )}
            </CardHeader>
            <CardContent className="flex flex-col gap-2 flex-1">
                <CardTitle>{name}</CardTitle>
                <div className="prose max-w-full text-pretty font-sans text-xs text-muted-foreground dark:prose-invert">
                    <Markdown>
                        {description}
                    </Markdown>
                </div>
            </CardContent>
            <CardFooter className="flex flex-col items-start gap-4 mt-auto">
                {tags && tags.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                        {tags.toSorted().map((tag: string) => (
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
                        {links.toSorted().map((link: ProjectLink, idx: number) => (
                            <Link href={link.href} key={idx} target="_blank">
                                <Badge className="flex gap-2 px-2 py-1 text-[10px]">
                                    {link.name === "Live Demo" ? (
                                        <FaExternalLinkAlt className="size-3" />
                                    ) : (
                                        <FaGithub className="size-3" />
                                    )}
                                    {link.name}
                                </Badge>
                            </Link>
                        ))}
                    </div>
                )}
            </CardFooter>
        </Card>
    );
}
