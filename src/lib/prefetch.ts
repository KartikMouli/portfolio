import { QueryClient } from '@tanstack/react-query';
import axios from 'axios';
import getQueryClient from './getQueryClient';


async function prefetchMovies(queryClient: QueryClient) {
    try {
        await queryClient.prefetchQuery({
            queryKey: ['movies'],
            queryFn: async () => {
                const response = await axios.get('/api/movies');
                return response.data;
            },
        });
        console.log('[Server] Movies data prefetched successfully');
    } catch (error) {
        console.error('[Server] Failed to prefetch movies data:', error);
    }
}

export async function prefetchAll() {
    const queryClient = getQueryClient();

    console.log('[Server] Starting prefetch operations...');

    // Prefetch movies data
    await prefetchMovies(queryClient);

    console.log('[Server] All prefetch operations completed');

    return queryClient;
} 