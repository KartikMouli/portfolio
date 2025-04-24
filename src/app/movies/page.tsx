'use client';

import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import Image from 'next/image';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface Movie {
    date: string | null;
    name: string;
    year: number | null;
    letterboxd_uri: string | null;
    tmdb_id: number | null;
    poster_path: string | null;
    release_date: string | null;
    overview: string | null;
}

export default function MoviesList() {
    const { data: movies, isLoading, error } = useQuery({
        queryKey: ['movies'],
        queryFn: async () => {
            const response = await axios.get('/api/movies');
            return response.data as Movie[];
        }
    });

    if (isLoading) {
        return <div className="text-center py-8">Loading movies...</div>;
    }

    if (error) {
        return <div className="text-center py-8 text-red-500">Error loading movies</div>;
    }

    return (
        <div className="container mx-auto px-2 sm:px-4 py-8">
            <h2 className="text-2xl font-bold mb-6">Movies I've Watched</h2>
            <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:gap-4 sm:justify-center">
                {movies?.map((movie) => (
                    <TooltipProvider key={movie.tmdb_id || movie.name}>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <div className="w-[140px] h-[207px] sm:w-[156px] sm:h-[231px] rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-opacity">
                                    {movie.poster_path ? (
                                        <Image
                                            src={movie.poster_path}
                                            alt={movie.name}
                                            width={156}
                                            height={231}
                                            className="object-cover w-full h-full"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                                            <div className="text-white text-2xl font-bold">
                                                {movie.name.charAt(0).toUpperCase()}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </TooltipTrigger>
                            <TooltipContent className='bg-black text-white border'>
                                <p>{movie.name}</p>
                                {movie.year && <p className="text-sm text-muted-foreground">{movie.year}</p>}
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                ))}
            </div>
        </div>
    );
} 