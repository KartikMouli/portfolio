import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { SpotifyData } from '@/models/spotify'

const fetchSpotifyData = async (): Promise<SpotifyData> => {
    const response = await axios.get('/api/spotify/now-playing')
    return response.data
}

export function useSpotifyData() {
    return useQuery({
        queryKey: ['spotify', 'now-playing'],
        queryFn: fetchSpotifyData,
        refetchInterval: 30*1000, // Refetch every 30 seconds
        staleTime: 30*1000, // Consider data fresh for 30 seconds
    })
} 