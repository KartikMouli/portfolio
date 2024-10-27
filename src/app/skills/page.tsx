import React from 'react';
import data from "@/data/skills.json";
import TechCard from '@/components/ui/TechCard';

// Define the type for each tech item
interface TechItem {
    name: string;
    description: string; // Add this property
    imageUrl: string;    // Add this property
    bgColor: string;     // Add this property
}

// Define the props for the TechCategory component
interface TechCategoryProps {
    title: string;
    techItems: TechItem[];
}

const TechCategory: React.FC<TechCategoryProps> = ({ title, techItems }) => {
    return (
        <div className='mt-4'>
            <h3 className='text-xl'>{title}</h3>
            <div className="mt-5 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 items-center justify-between gap-4">
                {techItems.map((cardItem) => (
                    <TechCard key={cardItem.name} cardInfo={cardItem} />
                ))}
            </div>
        </div>
    );
};

const Page: React.FC = () => {
    const {
        Programming_Languages,
        WebDevelopment_Tech,
        Database_Technologies,
        DevOps_Deployment_Tools
    } = data;

    return (
        <div className='mt-8 flex flex-col gap-8 pb-16 p-1'>
            <h1 className="text-2xl font-semibold">Development stack I&apos;m familiar with</h1>

            <TechCategory title="Programming languages" techItems={Programming_Languages} />
            <TechCategory title="Web development technologies" techItems={WebDevelopment_Tech} />
            <TechCategory title="Database technologies" techItems={Database_Technologies} />
            <TechCategory title="DevOps & Deployment tools" techItems={DevOps_Deployment_Tools} />
        </div>
    );
};

export default Page;
