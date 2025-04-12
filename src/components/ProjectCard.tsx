import Image from "next/image";
import Link from "next/link";
import Markdown from "react-markdown";
import { FaGithub, FaExternalLinkAlt } from "react-icons/fa";
import { motion } from "framer-motion";

import {
    Card,
    CardContent,
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

    // Animation variants for card elements
    const cardContentVariants = {
        hidden: { opacity: 0 },
        visible: { 
            opacity: 1,
            transition: { duration: 0.3 }
        }
    };

    const imageVariants = {
        hover: { scale: 1.05 }
    };

    const tagVariants = {
        initial: { scale: 0.8, opacity: 0 },
        animate: { scale: 1, opacity: 1 },
        hover: { scale: 1.1 }
    };

    return (
        <Card className="flex flex-col border dark:border-gray-800 rounded-xl h-full">
            {/* Image Section */}
            {image && (
                <Link href={href || image}>
                    <motion.div
                        whileHover="hover"
                        initial="initial"
                        animate="animate"
                    >
                        <motion.div
                            variants={imageVariants}
                            className="overflow-hidden"
                        >
                            <Image
                                src={image}
                                alt={name}
                                width={500}
                                height={300}
                                className="w-full h-40 px-4 pt-4 object-cover object-top"
                                priority
                            />
                        </motion.div>
                    </motion.div>
                </Link>
            )}

            {/* Main Content Wrapper */}
            <div className="flex flex-col flex-grow">
                {/* Card Header */}
                <motion.div
                    variants={cardContentVariants}
                    initial="hidden"
                    animate="visible"
                >
                    <CardHeader className="p-6 pb-0">
                        <CardTitle className="text-lg font-semibold">{name}</CardTitle>
                    </CardHeader>

                    {/* Card Content */}
                    <CardContent className="p-6 pt-2">
                        <Markdown className="text-sm font-sans text-pretty">
                            {description}
                        </Markdown>
                        {tags && tags.length > 0 && (
                            <motion.div 
                                className="mt-4 flex flex-wrap gap-2"
                                initial="hidden"
                                animate="visible"
                                variants={{
                                    hidden: {},
                                    visible: {
                                        transition: {
                                            staggerChildren: 0.05
                                        }
                                    }
                                }}
                            >
                                {tags.sort().map((tag) => (
                                    <motion.div
                                        key={tag}
                                        variants={tagVariants}
                                        whileHover={{ scale: 1.05 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <Badge variant="secondary">
                                            {tag}
                                        </Badge>
                                    </motion.div>
                                ))}
                            </motion.div>
                        )}
                    </CardContent>
                </motion.div>

                {/* Spacer to push footer to bottom */}
                <div className="flex-grow" />

                {/* Card Footer */}
                {links && links.length > 0 && (
                    <motion.div
                        variants={cardContentVariants}
                        initial="hidden"
                        animate="visible"
                        className="p-6 pt-0"
                    >
                        <CardFooter className="flex flex-wrap gap-2 p-0">
                            {links.sort().map((link, idx) => (
                                <motion.div
                                    key={idx}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <Link
                                        href={link.href}
                                        target="_blank"
                                        aria-label={`Link to ${link.name}`}
                                    >
                                        <Button 
                                            variant="outline"
                                            className="border-gray-200 dark:border-gray-800"
                                        >
                                            {link.name === "Live Demo" ? (
                                                <FaExternalLinkAlt className="mr-1 h-4 w-4" />
                                            ) : (
                                                <FaGithub className="mr-1 h-4 w-4" />
                                            )}
                                            <span className="text-sm">{link.name}</span>
                                        </Button>
                                    </Link>
                                </motion.div>
                            ))}
                        </CardFooter>
                    </motion.div>
                )}
            </div>
        </Card>
    );
}
