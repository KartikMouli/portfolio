import { NextResponse } from 'next/server';
import { getAccessToken } from '@/lib/spotify/auth';

export async function GET() {
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
      return NextResponse.json({ is_playing: false });
    }

    if (!response.ok) {
      throw new Error('Failed to fetch currently playing track');
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in now-playing route:', error);
    return NextResponse.json(
      { error: 'Failed to fetch currently playing track' },
      { status: 500 }
    );
  }
}
