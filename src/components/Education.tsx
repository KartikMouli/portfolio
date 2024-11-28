import React from 'react';
import Image from 'next/image';
import data from '@/data/education.json'
import Link from 'next/link';
import { z } from 'zod';
import {EducationDataSchema} from '@/lib/schemas';


// Validate the education data
const educationData = EducationDataSchema.parse(data.educationData);

const Education: React.FC = () => {
    return (

        <ul className="space-y-6 border-l ml-10">
            {educationData.map((edu, index) => (
                <li key={index} className="relative ml-11 -left-20">
                    <div className="flex items-start mb-2">

                        <div className="rounded-full p-1 mr-4 w-17 h-17 flex-shrink-0 flex items-center justify-center overflow-hidden">
                            <Image
                                src={edu.image}
                                alt={`${edu.university} logo`}
                                width={64}
                                height={64}
                                className="object-cover w-full h-full rounded-full"
                            />
                        </div>
                        <div className="flex-grow">
                            <Link href={edu.web} target="_blank"
                                rel="noopener noreferrer" >
                                <h2 className="font-semibold dark:text-gray-100 hover:text-white">{edu.university}</h2>
                            </Link>

                            <p className="text-sm  dark:text-gray-300">{edu.degree}</p>
                            <p className="text-xs  dark:text-gray-400">{edu.period}</p>

                        </div>
                    </div>
                </li>
            ))}
        </ul>

    );
};

export default Education;