import axios from 'axios';
import { SpotifyData } from '@/models/spotify';

export async function getSpotifyData(): Promise<SpotifyData> {
  const response = await axios.get('/api/spotify/now-playing');
  return response.data;
}
