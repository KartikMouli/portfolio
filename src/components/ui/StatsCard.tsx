import Image from 'next/image';
import React from 'react';

// Define props interface
interface StatsCardProps {
    src: string; // Type for the src prop
    alt: string; // Type for the alt prop
}

// Correct function declaration
const StatsCard: React.FC<StatsCardProps> = ({ src, alt }) => {
    return (
        <div className="overflow-hidden shadow-lg transition-transform transform hover:scale-105">
            <Image
                src={src}
                alt={alt}
                width={400}
                height={200}
                className="w-full h-auto"
                priority
            />
        </div>
    );
};

export default StatsCard;
