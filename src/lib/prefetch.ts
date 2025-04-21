import { QueryClient } from '@tanstack/react-query';
import axios from 'axios';
import getQueryClient from './getQueryClient';

async function prefetchVisitors(queryClient: QueryClient) {
    try {
        await queryClient.prefetchQuery({
            queryKey: ['visitorCount'],
            queryFn: async () => {
                const response = await axios.get('/api/visitors');
                console.log('Visitor count prefetched:', response.data.count);
                return response.data.count;
            },
        });
    } catch (error) {
        console.error('Failed to prefetch visitor count:', error);
    }
}

async function prefetchSpotify(queryClient: QueryClient) {
    try {
        await queryClient.prefetchQuery({
            queryKey: ['spotify', 'now-playing'],
            queryFn: async () => {
                const response = await axios.get('/api/spotify/now-playing');
                console.log('Spotify data prefetched:', response.data);
                return response.data;
            },
        });
    } catch (error) {
        console.error('Failed to prefetch Spotify data:', error);
    }
}

export async function prefetchAll() {
    const queryClient = getQueryClient();
    
    // Prefetch visitors first
    await prefetchVisitors(queryClient);
    
    // Then prefetch Spotify data
    await prefetchSpotify(queryClient);
    
    
    return queryClient;
} 