import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useEffect, useState } from 'react';

export function useVisitorCount() {
    const [shouldIncrement, setShouldIncrement] = useState(false);

    useEffect(() => {
        // Check if this is the first visit
        const hasVisited = localStorage.getItem('hasVisited');
        if (!hasVisited) {
            setShouldIncrement(true);
            localStorage.setItem('hasVisited', 'true');
        }
    }, []);

    const { data: count, isLoading, error } = useQuery({
        queryKey: ['visitorCount'],
        queryFn: async () => {
            if (shouldIncrement) {
                const response = await axios.post('/api/visitors');
                return response.data.count;
            } else {
                const response = await axios.get('/api/visitors');
                return response.data.count;
            }
        },
        staleTime: Infinity, // Never refetch
        retry: false,
        enabled: shouldIncrement !== null, // Only run query after we've checked localStorage
    });

    return { count, isLoading, error };
} 