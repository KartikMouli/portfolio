'use server';

import { getAccessToken } from '@/lib/spotify/auth';
import { SpotifyData } from '@/models/spotify';

export async function getNowPlaying(): Promise<
  SpotifyData | { is_playing: false } | { error: string }
> {
  try {
    const access_token = await getAccessToken();

    const response = await fetch(
      'https://api.spotify.com/v1/me/player/currently-playing',
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    );

    if (response.status === 204) {
      return { is_playing: false };
    }

    if (!response.ok) {
      throw new Error('Failed to fetch currently playing track');
    }

    return await response.json();
  } catch (error) {
    console.error('Spotify now-playing action error:', error);
    return { error: 'Failed to fetch currently playing track' };
  }
}
