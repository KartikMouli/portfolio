import Image from "next/image";
import { Card, CardContent } from "./ui/card";


// Define props interface
interface StatsCardProps {
    src: string; // Type for the src prop
    alt: string; // Type for the alt prop
}

// Correct function declaration
const StatsCard: React.FC<StatsCardProps> = ({ src, alt }) => {
    return (
        <Card className="overflow-hidden shadow-lg hover:scale-105 transition-transform">
            <CardContent className="p-0">
                <Image
                    src={src}
                    alt={alt}
                    width={400}
                    height={200}
                    className="w-full h-auto rounded-lg"
                    priority
                />
            </CardContent>
        </Card>
    );
};

export default StatsCard;
