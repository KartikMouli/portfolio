import React, { useState } from 'react';
import Image from 'next/image';
import educationData from '@/data/education.json'
import experienceData from '@/data/experience.json'
import Link from 'next/link';
import { EducationDataSchema, ExperienceDataSchema } from '@/lib/schemas';
import { GraduationCap, Briefcase } from 'lucide-react';

// Validate the education data
const validatedEducationData = EducationDataSchema.parse(educationData.educationData);
const validatedExperienceData = ExperienceDataSchema.parse(experienceData.experienceData);

const Timeline: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'education' | 'experience'>('education');

    const tabs = [
        {
            id: 'education',
            label: 'Education',
            icon: <GraduationCap className="w-4 h-4" />,
            content: (
                <ul
                    className="space-y-4"
                >
                    {validatedEducationData.map((edu, index) => (
                        <li
                            key={index}
                            className="relative"
                        >
                            <div className="flex items-start group">
                                <div className="rounded-lg p-3 w-full bg-card border border-border hover:border-primary/50 transition-colors duration-300">
                                    <div className="flex items-start gap-3">
                                        <div className="rounded-full p-1 w-10 h-10 shrink-0 flex items-center justify-center overflow-hidden border border-border group-hover:border-primary/50 transition-colors duration-300">
                                            <Image
                                                src={edu.image}
                                                alt={`${edu.university} logo`}
                                                width={40}
                                                height={40}
                                                className="object-cover w-full h-full rounded-full"
                                            />
                                        </div>
                                        <div className="grow">
                                            <Link
                                                href={edu.web}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="group-hover:text-primary transition-colors duration-300"
                                            >
                                                <h2 className="font-medium text-base text-foreground">{edu.university}</h2>
                                            </Link>
                                            <p className="text-sm text-muted-foreground mt-0.5">{edu.degree}</p>
                                            <p className="text-xs text-muted-foreground/70 mt-0.5">{edu.period}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            )
        },
        {
            id: 'experience',
            label: 'Experience',
            icon: <Briefcase className="w-4 h-4" />,
            content: (
                <ul
                    className="space-y-4"
                >
                    {validatedExperienceData.map((experience, index) => (
                        <li
                            key={index}
                            className="relative"
                        >
                            <div className="flex items-start group">
                                <div className="rounded-lg p-3 w-full bg-card border border-border hover:border-primary/50 transition-colors duration-300">
                                    <div className="flex items-start gap-3">
                                        <div className="rounded-full p-1 w-10 h-10 shrink-0 flex items-center justify-center overflow-hidden border border-border group-hover:border-primary/50 transition-colors duration-300">
                                            <Image
                                                src="https://avatars.githubusercontent.com/u/142896542?s=200&v=4"
                                                alt="Unizoy logo"
                                                width={40}
                                                height={40}
                                                className="object-cover w-full h-full rounded-full"
                                            />
                                        </div>
                                        <div className="grow">
                                            <Link
                                                href="https://unizoy.com"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="group-hover:text-primary transition-colors duration-300"
                                            >
                                                <h2 className="font-medium text-base text-foreground">{experience.company}</h2>
                                            </Link>
                                            <p className="text-sm text-muted-foreground mt-0.5">{experience.role}</p>
                                            <p className="text-xs text-muted-foreground/70 mt-0.5">{experience.period}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            )
        }
    ];

    return (
        <div className="w-full">
            <div className="inline-flex h-9 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground mb-6">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as 'education' | 'experience')}
                        className={`inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${activeTab === tab.id
                            ? 'bg-background text-foreground shadow-sm'
                            : 'hover:text-foreground'
                            }`}
                    >
                        {tab.icon}
                        <span className="ml-2">{tab.label}</span>
                    </button>
                ))}
            </div>
            {tabs.map((tab) => (
                activeTab === tab.id && (
                    <div
                        key={tab.id}
                    >
                        {tab.content}
                    </div>
                )
            ))}
        </div>
    );
};

export default Timeline;