'use client';

import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useEffect, useState } from 'react';

export function useVisitorCount() {
    const [hasCounted, setHasCounted] = useState<boolean | null>(null);
    
    // Check localStorage only on client side
    useEffect(() => {
        const counted = localStorage.getItem('hasCounted');
        setHasCounted(!!counted);
    }, []);

    // Increment count only once per session
    useEffect(() => {
        if (hasCounted === false) {
            axios.post('/api/visitors')
                .then(() => {
                    localStorage.setItem('hasCounted', 'true');
                    setHasCounted(true);
                })
                .catch(console.error);
        }
    }, [hasCounted]);

    // Get current count
    const { data: count, isLoading, error } = useQuery({
        queryKey: ['visitorCount'],
        queryFn: async () => {
            const response = await axios.get('/api/visitors');
            return response.data.count;
        },
        enabled: hasCounted !== null // Only run query after we've checked localStorage
    });

    return { count, isLoading, error };
} 