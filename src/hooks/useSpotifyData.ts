import { useQuery } from '@tanstack/react-query';
import { SpotifyData } from '@/models/spotify';
import { getNowPlaying } from '@/actions/spotify';

const fetchSpotifyData = async (): Promise<SpotifyData> => {
  const data = await getNowPlaying();

  if ('error' in data) {
    throw new Error(data.error);
  }

  return data as SpotifyData;
};

export function useSpotifyData() {
  return useQuery({
    queryKey: ['spotify', 'now-playing'],
    queryFn: fetchSpotifyData,
    refetchInterval: 30 * 1000, // Refetch every 30 seconds
    staleTime: 30 * 1000, // Consider data fresh for 30 seconds
  });
}
