import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useEffect } from 'react';

export function useVisitorCount() {
    // Check if user has been counted in this session
    const hasCounted = localStorage.getItem('hasCounted');
    
    // Increment count only once per session
    useEffect(() => {
        if (!hasCounted) {
            axios.post('/api/visitors/increment')
                .then(() => {
                    localStorage.setItem('hasCounted', 'true');
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
        staleTime: Infinity, // Never refetch
        retry: false
    });

    return { count, isLoading, error };
} 