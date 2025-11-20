import { NextResponse } from 'next/server';
import { getAccessToken } from '@/lib/spotify/auth';

async function getNowPlaying() {
  'use cache';

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
    console.error('Error in getNowPlaying:', error);
    return { error: 'Failed to fetch currently playing track' };
  }
}

export async function GET() {
  const data = await getNowPlaying();

  if (data.error) {
    return NextResponse.json(data, { status: 500 });
  }

  return NextResponse.json(data);
}
