'use client';

import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import Image from 'next/image';
import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Input } from "@/components/ui/input";
import { Loader2, Search, AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination";
import { MovieDialog } from "@/components/movie/MovieDialog";
import { SortFilter, type SortOption } from '@/components/movie/SortFilter';

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

const ITEMS_PER_PAGE = 24;

// Separate the query function for better reusability and testing
const fetchMovies = async (): Promise<Movie[]> => {
    const response = await axios.get('/api/movies');
    return response.data;
};

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

export default function MoviesList() {
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
    const [sortBy, setSortBy] = useState('date-desc');

    const sortOptions: SortOption[] = [
        { label: 'Added Date (Newest)', value: 'date-desc', direction: 'desc' },
        { label: 'Added Date (Oldest)', value: 'date-asc', direction: 'asc' },
        { label: 'Release Year (Newest)', value: 'year-desc', direction: 'desc' },
        { label: 'Release Year (Oldest)', value: 'year-asc', direction: 'asc' },
        { label: 'Name (A-Z)', value: 'title-asc', direction: 'asc' },
        { label: 'Name (Z-A)', value: 'title-desc', direction: 'desc' },
    ];

    const { data: movies = [], isLoading, isError, error, isFetching } = useQuery<Movie[], Error>({
        queryKey: ['movies'],
        queryFn: fetchMovies,
        staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
        gcTime: 30 * 60 * 1000, // Keep unused data in cache for 30 minutes
        retry: 2, // Retry failed requests 2 times
        refetchOnWindowFocus: false, // Don't refetch when window regains focus
    });

    const filteredMovies = useMemo(() => {
        return movies
            .filter((movie: Movie) => 
                movie.name.toLowerCase().includes(searchQuery.toLowerCase())
            )
            .sort((a: Movie, b: Movie) => {
                const [sortField, sortDirection] = sortBy.split('-');
                
                switch (sortField) {
                    case 'date':
                        // Handle null dates by putting them at the end
                        if (!a.date && !b.date) return 0;
                        if (!a.date) return 1;
                        if (!b.date) return -1;
                        
                        const dateA = new Date(a.date).getTime();
                        const dateB = new Date(b.date).getTime();
                        return sortDirection === 'desc' ? dateB - dateA : dateA - dateB;
                    
                    case 'year':
                        // Handle null years by putting them at the end
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

        // Always show first page
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

        // Calculate start and end of visible pages
        let startPage = Math.max(2, currentPage - halfVisible);
        let endPage = Math.min(totalPages - 1, currentPage + halfVisible);

        // Adjust if we're near the start
        if (currentPage <= halfVisible + 1) {
            endPage = Math.min(maxVisiblePages, totalPages - 1);
        }
        // Adjust if we're near the end
        if (currentPage >= totalPages - halfVisible) {
            startPage = Math.max(totalPages - maxVisiblePages + 1, 2);
        }

        // Add ellipsis after first page if needed
        if (startPage > 2) {
            items.push(
                <PaginationItem key="start-ellipsis">
                    <PaginationEllipsis />
                </PaginationItem>
            );
        }

        // Add visible page numbers
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

        // Add ellipsis before last page if needed
        if (endPage < totalPages - 1) {
            items.push(
                <PaginationItem key="end-ellipsis">
                    <PaginationEllipsis />
                </PaginationItem>
            );
        }

        // Always show last page if there's more than one page
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
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="h-8 w-8 animate-spin" />
                    <p className="text-muted-foreground">Loading your movie collection...</p>
                </div>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="container mx-auto px-4 py-8">
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>
                        {error instanceof Error ? error.message : 'Failed to load movies'}
                    </AlertDescription>
                </Alert>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-2 sm:px-4 py-8">
            <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4"
            >
                <div className="flex items-center gap-2">
                    <h2 className="text-2xl font-bold">Movies I've Watched</h2>
                    {isFetching && (
                        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                    )}
                </div>
                <div className="flex items-center gap-4">
                    <div className="w-full sm:w-64">
                        <Input
                            type="text"
                            placeholder="Search movies..."
                            value={searchQuery}
                            onChange={(e) => {
                                setSearchQuery(e.target.value);
                                setCurrentPage(1);
                            }}
                            className="w-full"
                        />
                    </div>
                    <SortFilter
                        options={sortOptions}
                        value={sortBy}
                        onChange={(value) => {
                            setSortBy(value);
                            setCurrentPage(1);
                        }}
                    />
                </div>
            </motion.div>

            {filteredMovies.length === 0 ? (
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="flex flex-col items-center justify-center py-12 text-center"
                >
                    <Search className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-xl font-semibold mb-2">No movies found</h3>
                    <p className="text-muted-foreground">
                        {searchQuery ? (
                            `No movies match your search for "${searchQuery}"`
                        ) : (
                            "No movies available"
                        )}
                    </p>
                </motion.div>
            ) : (
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
                                            <TooltipContent className="bg-background text-foreground border" >
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
            )}
        </div>
    );
} 