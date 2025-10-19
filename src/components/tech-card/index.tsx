import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { TechCardSchema } from '@/lib/schemas';

const TechCard = ({
  cardInfo,
}: {
  cardInfo: {
    name: string;
    description: string;
    imageUrl: string;
    bgColor: string;
  };
}) => {
  // Validate cardInfo using Zod
  const validation = TechCardSchema.safeParse(cardInfo);

  // If validation fails, log the error or return a fallback UI
  if (!validation.success) {
    console.error('Invalid TechCard data:', validation.error.format());
    return <div>Invalid TechCard data !</div>;
  }

  const { name, description, imageUrl, bgColor } = cardInfo;

  // Determine opacity based on bgColor
  const opacity = bgColor === 'white' ? 0.9 : 0.2;

  return (
    <Card
      className="flex items-center whitespace-nowrap rounded-xl hover:shadow-lg transition-all duration-300 border border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm"
      aria-label={`Technology: ${name}, Description: ${description}`}
    >
      {/* Image Section */}
      <div className="mx-2 relative shrink-0">
        {/* Background with reduced opacity for the image */}
        <div
          className="absolute inset-0 rounded-full"
          style={{
            backgroundColor: bgColor,
            opacity,
          }}
        />
        <div className="relative z-10 p-2 rounded-full">
          <Image
            src={imageUrl}
            alt={`${name} logo`}
            width={40}
            height={40}
            className="size-7 rounded-full"
            priority
          />
        </div>
      </div>

      {/* Content Section */}
      <CardContent className="p-3 relative z-10 text-ellipsis overflow-hidden">
        <h5 className="text-sm font-semibold text-ellipsis overflow-hidden text-zinc-800 dark:text-zinc-200">
          {name}
        </h5>
        <p className="text-xs font-extralight text-ellipsis overflow-hidden text-zinc-600 dark:text-zinc-400">
          {description}
        </p>
      </CardContent>
    </Card>
  );
};

export default TechCard;
