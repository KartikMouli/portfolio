'use client';

import * as React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

interface MovieDialogProps {
    movie: {
        name: string;
        year: number | null;
        date: string | null;
        letterboxd_uri: string | null;
        tmdb_id: number | null;
        poster_path: string | null;
        release_date: string | null;
        overview: string | null;
    };
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function MovieDialog({ movie, open, onOpenChange }: MovieDialogProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <AnimatePresence>
                {open && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40"
                            onClick={() => onOpenChange(false)}
                        />
                        <DialogContent className="max-w-[90vw] sm:max-w-[800px] bg-background/95 backdrop-blur-sm border-border p-0 mb-24 sm:mb-0 overflow-hidden z-50">
                            <DialogDescription className="sr-only">
                                Movie details for {movie.name}{movie.year ? ` (${movie.year})` : ''}
                            </DialogDescription>
                            <motion.div 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 20 }}
                                transition={{ duration: 0.3 }}
                                className="flex flex-col sm:flex-row"
                            >
                                <motion.div 
                                    initial={{ scale: 0.9 }}
                                    animate={{ scale: 1 }}
                                    transition={{ duration: 0.3, delay: 0.1 }}
                                    className="relative w-full sm:w-1/3 aspect-[3/4] sm:aspect-[2/3]"
                                >
                                    {movie.poster_path ? (
                                        <Image
                                            src={movie.poster_path}
                                            alt={movie.name}
                                            fill
                                            className="object-contain transition-transform duration-300 hover:scale-105"
                                            sizes="(max-width: 800px) 100vw, 300px"
                                            loading="lazy"
                                        />
                                    ) : (
                                        <motion.div 
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ duration: 0.5 }}
                                            className="w-full h-full bg-muted flex items-center justify-center"
                                        >
                                            <motion.div 
                                                initial={{ scale: 0.8 }}
                                                animate={{ scale: 1 }}
                                                transition={{ duration: 0.5, delay: 0.2 }}
                                                className="text-foreground text-2xl sm:text-6xl font-bold"
                                            >
                                                {movie.name.charAt(0).toUpperCase()}
                                            </motion.div>
                                        </motion.div>
                                    )}
                                </motion.div>
                                <motion.div 
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.3, delay: 0.2 }}
                                    className="p-3 sm:p-6 flex-1 space-y-2 sm:space-y-4 text-foreground"
                                >
                                    <DialogHeader className="p-0">
                                        <DialogTitle className="text-base sm:text-2xl font-bold">
                                            {movie.name}
                                            {movie.year && (
                                                <motion.span 
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    transition={{ duration: 0.3, delay: 0.3 }}
                                                    className="text-gray-400 ml-2"
                                                >
                                                    ({movie.year})
                                                </motion.span>
                                            )}
                                        </DialogTitle>
                                    </DialogHeader>
                                    {movie.overview && (
                                        <motion.div 
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.3, delay: 0.4 }}
                                            className="space-y-1"
                                        >
                                            <h3 className="text-xs sm:text-lg font-semibold text-white">Overview</h3>
                                            <p className="text-xs sm:text-sm leading-relaxed line-clamp-2 sm:line-clamp-none">{movie.overview}</p>
                                        </motion.div>
                                    )}
                                    <motion.div 
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.3, delay: 0.5 }}
                                        className="grid grid-cols-2 gap-2"
                                    >
                                        {movie.release_date && (
                                            <div className="space-y-0.5">
                                                <h3 className="text-xs font-medium text-gray-400">Release Date</h3>
                                                <p className="text-xs">{new Date(movie.release_date).toLocaleDateString()}</p>
                                            </div>
                                        )}
                                        {movie.date && (
                                            <div className="space-y-0.5">
                                                <h3 className="text-xs font-medium text-gray-400">Watched Date</h3>
                                                <p className="text-xs">{new Date(movie.date).toLocaleDateString()}</p>
                                            </div>
                                        )}
                                    </motion.div>
                                    <motion.div 
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.3, delay: 0.6 }}
                                        className="flex flex-wrap gap-2 pt-2"
                                    >
                                        {movie.letterboxd_uri && (
                                            <Button
                                                className="hover:cursor-pointer"
                                                variant="outline"
                                                onClick={() => movie.letterboxd_uri && window.open(movie.letterboxd_uri, '_blank')}
                                            >
                                                View on Letterboxd
                                            </Button>
                                        )}
                                        {movie.tmdb_id && (
                                            <Button
                                                className="hover:cursor-pointer"
                                                variant="outline"
                                                onClick={() => window.open(`https://www.themoviedb.org/movie/${movie.tmdb_id}`, '_blank')}
                                            >
                                                View on TMDB
                                            </Button>
                                        )}
                                    </motion.div>
                                </motion.div>
                            </motion.div>
                        </DialogContent>
                    </>
                )}
            </AnimatePresence>
        </Dialog>
    );
} 