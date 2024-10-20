import React from 'react';
import Image from 'next/image';
import data from '@/data/education.json'

const educationData = data.educationData;

const Education: React.FC = () => {
    return (

        <ul className="space-y-6">
            {educationData.map((edu, index) => (
                <li key={index} className="relative">
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
                            <h2 className="font-semibold text-gray-100">{edu.university}</h2>
                            <p className="text-sm  text-gray-300">{edu.degree}</p>
                            <p className="text-xs  text-gray-400">{edu.period}</p>

                        </div>
                    </div>
                </li>
            ))}
        </ul>

    );
};

export default Education;