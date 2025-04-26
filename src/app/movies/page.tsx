'use client';

import React, { Suspense } from 'react';
import { SortFilter, type SortOption } from '@/components/movie/SortFilter';
import { Input } from "@/components/ui/input";
import { Search } from 'lucide-react';
import { useState } from 'react';
import MoviesList from '@/components/movie/MoviesList';


const sortOptions: SortOption[] = [
    { label: 'Added Date (Newest)', value: 'date-desc', direction: 'desc' },
    { label: 'Added Date (Oldest)', value: 'date-asc', direction: 'asc' },
    { label: 'Release Year (Newest)', value: 'year-desc', direction: 'desc' },
    { label: 'Release Year (Oldest)', value: 'year-asc', direction: 'asc' },
    { label: 'Name (A-Z)', value: 'title-asc', direction: 'asc' },
    { label: 'Name (Z-A)', value: 'title-desc', direction: 'desc' },
];

export default function MoviesPage() {
    const [sortBy, setSortBy] = useState('date-desc');
    const [searchQuery, setSearchQuery] = useState('');

    return (
        <div className="container mx-auto px-4 py-6 sm:py-8">
            <div className="flex flex-col gap-4 sm:gap-6 mb-6 sm:mb-8">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <h1 className="text-xl sm:text-2xl font-semibold tracking-tight">My Movie Collection</h1>
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
                        <div className="relative w-full sm:w-[200px]">
                            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                            <Input
                                type="text"
                                placeholder="Search movies..."
                                className="pl-8 h-9 sm:h-8 text-sm"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <SortFilter
                            options={sortOptions}
                            value={sortBy}
                            onChange={setSortBy}
                            className="w-full sm:w-auto"
                        />
                    </div>
                </div>
            </div>
            <Suspense fallback={<div>Loading movies...</div>}>
                <MoviesList sortBy={sortBy} searchQuery={searchQuery} />
            </Suspense>
        </div>
    );
} 