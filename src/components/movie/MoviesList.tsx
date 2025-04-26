'use client';

import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import Image from 'next/image';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination";
import { MovieDialog } from "./MovieDialog";
import { Movie } from '@/lib/db';
import axios from 'axios';

const ITEMS_PER_PAGE = 24;
const STALE_TIME = 5 * 60 * 1000; // 5 minutes

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
};

interface MoviesListProps {
    sortBy: string;
    searchQuery: string;
}

function MoviesList({ sortBy, searchQuery }: MoviesListProps) {
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

    const { data: movies = [], isLoading} = useQuery<Movie[]>({
        queryKey: ['movies'],
        queryFn: async () => {
            const response = await axios.get('/api/movies');
            return response.data;
        },
        staleTime: STALE_TIME,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        gcTime: 30 * 60 * 1000, // 30 minutes
    });

    const filteredMovies = useMemo(() => {
        if (!movies || !Array.isArray(movies)) return [];
        
        return movies
            .filter((movie: Movie) => 
                movie.name.toLowerCase().includes(searchQuery.toLowerCase())
            )
            .sort((a: Movie, b: Movie) => {
                const [sortField, sortDirection] = sortBy.split('-');
                
                switch (sortField) {
                    case 'date':
                        if (!a.date && !b.date) return 0;
                        if (!a.date) return 1;
                        if (!b.date) return -1;
                        
                        const dateA = new Date(a.date).getTime();
                        const dateB = new Date(b.date).getTime();
                        return sortDirection === 'desc' ? dateB - dateA : dateA - dateB;
                    
                    case 'year':
                        if (!a.year && !b.year) return 0;
                        if (!a.year) return 1;
                        if (!b.year) return -1;
                        
                        return sortDirection === 'desc' 
                            ? (b.year || 0) - (a.year || 0)
                            : (a.year || 0) - (b.year || 0);
                    
                    case 'title':
                        return sortDirection === 'desc' 
                            ? b.name.localeCompare(a.name)
                            : a.name.localeCompare(b.name);
                    
                    default:
                        return 0;
                }
            });
    }, [movies, searchQuery, sortBy]);

    // Reset to first page when search query changes
    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery]);

    // Preload next page images
    useEffect(() => {
        if (filteredMovies.length > 0) {
            const nextPageStart = currentPage * ITEMS_PER_PAGE;
            const nextPageMovies = filteredMovies.slice(nextPageStart, nextPageStart + ITEMS_PER_PAGE);
            
            nextPageMovies.forEach((movie: Movie) => {
                if (movie.poster_path) {
                    const img = new window.Image();
                    img.src = movie.poster_path;
                }
            });
        }
    }, [currentPage, filteredMovies]);

    const totalPages = Math.ceil(filteredMovies.length / ITEMS_PER_PAGE);
    const paginatedMovies = useMemo(() => {
        const start = (currentPage - 1) * ITEMS_PER_PAGE;
        const end = start + ITEMS_PER_PAGE;
        return filteredMovies.slice(start, end);
    }, [filteredMovies, currentPage]);

    const renderPaginationItems = () => {
        const items = [];
        const maxVisiblePages = 5;
        const halfVisible = Math.floor(maxVisiblePages / 2);

        items.push(
            <PaginationItem key={1}>
                <PaginationLink
                    isActive={currentPage === 1}
                    onClick={() => setCurrentPage(1)}
                >
                    1
                </PaginationLink>
            </PaginationItem>
        );

        let startPage = Math.max(2, currentPage - halfVisible);
        let endPage = Math.min(totalPages - 1, currentPage + halfVisible);

        if (currentPage <= halfVisible + 1) {
            endPage = Math.min(maxVisiblePages, totalPages - 1);
        }
        if (currentPage >= totalPages - halfVisible) {
            startPage = Math.max(totalPages - maxVisiblePages + 1, 2);
        }

        if (startPage > 2) {
            items.push(
                <PaginationItem key="start-ellipsis">
                    <PaginationEllipsis />
                </PaginationItem>
            );
        }

        for (let i = startPage; i <= endPage; i++) {
            items.push(
                <PaginationItem key={i}>
                    <PaginationLink
                        isActive={currentPage === i}
                        onClick={() => setCurrentPage(i)}
                    >
                        {i}
                    </PaginationLink>
                </PaginationItem>
            );
        }

        if (endPage < totalPages - 1) {
            items.push(
                <PaginationItem key="end-ellipsis">
                    <PaginationEllipsis />
                </PaginationItem>
            );
        }

        if (totalPages > 1) {
            items.push(
                <PaginationItem key={totalPages}>
                    <PaginationLink
                        isActive={currentPage === totalPages}
                        onClick={() => setCurrentPage(totalPages)}
                    >
                        {totalPages}
                    </PaginationLink>
                </PaginationItem>
            );
        }

        return items;
    };

    if (isLoading) {
        return <div>Loading movies...</div>;
    }

    if (filteredMovies.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-12 text-center">
                <h3 className="text-xl font-semibold mb-2">No movies found</h3>
                <p className="text-muted-foreground">
                    {searchQuery ? (
                        `No movies match your search for "${searchQuery}"`
                    ) : (
                        "No movies available"
                    )}
                </p>
            </div>
        );
    }

    return (
        <>
            <motion.div 
                variants={container}
                initial="hidden"
                animate="show"
                className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4 justify-items-center w-full"
            >
                <AnimatePresence mode="popLayout">
                    {paginatedMovies.map((movie: Movie) => (
                        <motion.div
                            key={movie.tmdb_id || movie.name}
                            variants={item}
                            initial="hidden"
                            animate="show"
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ duration: 0.2 }}
                            layout
                            className="w-[140px] sm:w-[156px] flex-shrink-0"
                        >
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <motion.div 
                                            whileHover={{ 
                                                scale: 1.02,
                                                y: -2,
                                                boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)"
                                            }}
                                            transition={{ 
                                                duration: 0.2,
                                                ease: "easeOut"
                                            }}
                                            className="h-[207px] sm:h-[231px] rounded-lg overflow-hidden cursor-pointer bg-muted border border-border hover:border-foreground/20 transition-colors duration-300"
                                            onClick={() => setSelectedMovie(movie)}
                                        >
                                            {movie.poster_path ? (
                                                <Image
                                                    src={movie.poster_path}
                                                    alt={movie.name}
                                                    width={156}
                                                    height={231}
                                                    className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                                                    loading="lazy"
                                                    quality={75}
                                                    sizes="(max-width: 640px) 140px, (max-width: 1024px) 156px, 156px"
                                                />
                                            ) : (
                                                <motion.div 
                                                    whileHover={{ scale: 1.02 }}
                                                    transition={{ duration: 0.2 }}
                                                    className="w-full h-full bg-muted flex items-center justify-center group"
                                                >
                                                    <motion.div 
                                                        initial={{ scale: 0.8 }}
                                                        animate={{ scale: 1 }}
                                                        transition={{ duration: 0.5 }}
                                                        className="text-foreground text-2xl font-bold group-hover:scale-105 transition-transform"
                                                    >
                                                        {movie.name.charAt(0).toUpperCase()}
                                                    </motion.div>
                                                </motion.div>
                                            )}
                                        </motion.div>
                                    </TooltipTrigger>
                                    <TooltipContent className="bg-background text-foreground border">
                                        <p>{movie.name}</p>
                                        {movie.year && <p className="text-sm text-muted-foreground">{movie.year}</p>}
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </motion.div>

            {totalPages > 1 && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="mt-8"
                >
                    <Pagination>
                        <PaginationContent>
                            <PaginationItem>
                                <PaginationPrevious
                                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                    className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                                />
                            </PaginationItem>
                            {renderPaginationItems()}
                            <PaginationItem>
                                <PaginationNext
                                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                    className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                                />
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>
                </motion.div>
            )}

            {selectedMovie && (
                <MovieDialog
                    movie={selectedMovie}
                    open={!!selectedMovie}
                    onOpenChange={(open) => !open && setSelectedMovie(null)}
                />
            )}
        </>
    );
} 

export default MoviesList;