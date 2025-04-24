'use client';

import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

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
        <div className="container mx-auto px-4 py-8">
            <h2 className="text-2xl font-bold mb-6">Movies I've Watched</h2>
            <div className="grid grid-cols-1 gap-6">
                {movies?.map((movie) => (
                    <Card key={movie.tmdb_id || movie.name} className="overflow-hidden">
                        <div className="flex flex-col md:flex-row">
                            <div className="w-full md:w-1/3 lg:w-1/4">
                                <div className="relative aspect-[2/3] bg-gray-100">
                                    {movie.poster_path ? (
                                        <Image
                                            src={movie.poster_path}
                                            alt={movie.name}
                                            fill
                                            className="object-cover"
                                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                        />
                                    ) : (
                                        <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                                            No Poster Available
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="w-full md:w-2/3 lg:w-3/4 p-4">
                                <CardHeader className="p-0 mb-4">
                                    <div className="flex items-center justify-between">
                                        <CardTitle className="text-2xl">{movie.name}</CardTitle>
                                        <div className="flex gap-2">
                                            {movie.tmdb_id && (
                                                <Badge variant="secondary">
                                                    TMDB ID: {movie.tmdb_id}
                                                </Badge>
                                            )}
                                        </div>
                                    </div>
                                    <CardDescription className="text-lg">
                                        {movie.year || (movie.release_date ? new Date(movie.release_date).getFullYear() : 'Unknown Year')}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="p-0">
                                    <div className="space-y-4">
                                        {movie.overview && (
                                            <div>
                                                <h3 className="font-semibold mb-1">Overview</h3>
                                                <p className="text-muted-foreground">{movie.overview}</p>
                                            </div>
                                        )}

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {movie.date && (
                                                <div>
                                                    <h3 className="font-semibold mb-1">Watched Date</h3>
                                                    <p className="text-muted-foreground">
                                                        {new Date(movie.date).toLocaleDateString()}
                                                    </p>
                                                </div>
                                            )}

                                            {movie.release_date && (
                                                <div>
                                                    <h3 className="font-semibold mb-1">Release Date</h3>
                                                    <p className="text-muted-foreground">
                                                        {new Date(movie.release_date).toLocaleDateString()}
                                                    </p>
                                                </div>
                                            )}

                                            {movie.year && (
                                                <div>
                                                    <h3 className="font-semibold mb-1">Year</h3>
                                                    <p className="text-muted-foreground">{movie.year}</p>
                                                </div>
                                            )}

                                            {movie.letterboxd_uri && (
                                                <div>
                                                    <h3 className="font-semibold mb-1">Letterboxd</h3>
                                                    <a
                                                        href={movie.letterboxd_uri}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-blue-500 hover:text-blue-600"
                                                    >
                                                        View on Letterboxd
                                                    </a>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </CardContent>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
} 