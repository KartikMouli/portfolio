import Image from "next/image";
import Link from "next/link";
import Markdown from "react-markdown";
import { FaGithub, FaExternalLinkAlt } from "react-icons/fa";

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { ProjectSchema } from "@/lib/schemas";

// Define the types for project and links
interface ProjectLink {
    href: string;
    name: string;
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

    // Validate project data using Zod schema
    const parsedProject = ProjectSchema.safeParse(project);

    if (!parsedProject.success) {
        // Handle the validation error (optional: return a fallback UI or log the error)
        // console.error("Invalid project data:", parsedProject.error.format());
        return <div>Invalid project data</div>;
    }


    const { name, href, description, image, tags, links } = project;


    return (
        <Card className="flex flex-col border dark:border-gray-800 rounded-xl">
            {/* Image Section */}
            {image && (
                <Link href={href || image}>
                    <Image
                        src={image}
                        alt={name}
                        width={500}
                        height={300}
                        className="w-full h-40 px-4 pt-4 object-cover object-top hover:scale-105 transition-transform duration-300"
                        priority
                    />
                </Link>
            )}

            {/* Card Header */}
            <CardHeader className="p-6 pb-0">
                <CardTitle className="text-lg font-semibold">{name}</CardTitle>
            </CardHeader>

            {/* Card Content */}
            <CardContent className="p-6 pt-2">
                <Markdown className="text-sm font-sans text-pretty">
                    {description}
                </Markdown>
                {tags && tags.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                        {tags.sort().map((tag) => (
                            <Badge
                                key={tag}
                                variant="secondary"
                            >
                                {tag}
                            </Badge>
                        ))}
                    </div>
                )}
            </CardContent>

            {/* Card Footer */}
            {links && links.length > 0 && (
                <CardFooter className="flex flex-wrap mt-auto gap-2">
                    {links.sort().map((link, idx) => (
                        <Link
                            href={link.href}
                            key={idx}
                            target="_blank"
                            aria-label={`Link to ${link.name}`}
                        >
                            <Button variant="outline" className="transition-transform duration-300 hover:scale-105">
                                {link.name === "Live Demo" ? (
                                    <FaExternalLinkAlt />
                                ) : (
                                    <FaGithub />
                                )}
                                <span className="text-sm">{link.name}</span>
                            </Button>
                        </Link>
                    ))}
                </CardFooter>
            )}
        </Card>
    );
}
