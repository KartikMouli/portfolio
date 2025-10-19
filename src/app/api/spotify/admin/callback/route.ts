import { NextResponse } from 'next/server';
import { getAccessToken } from '@/lib/spotify/auth';
import { getSpotifyModel } from '@/models/spotify';
import connectDB from '@/lib/mongodb';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    const error = searchParams.get('error');

    if (error) {
      return NextResponse.redirect(
        new URL('/admin?error=access_denied', request.url)
      );
    }

    if (!code) {
      return NextResponse.redirect(
        new URL('/admin?error=no_code', request.url)
      );
    }

    await connectDB();
    const { access_token, refresh_token, expires_in } =
      await getAccessToken(code);

    // Calculate expiration time
    const expires_at = new Date(Date.now() + expires_in * 1000);

    // Store or update tokens in database
    const Spotify = await getSpotifyModel();
    await Spotify.findOneAndUpdate(
      {},
      { access_token, refresh_token, expires_at },
      { upsert: true, new: true }
    );

    return NextResponse.redirect(new URL('/admin?success=true', request.url));
  } catch (error) {
    console.error('Error in Spotify callback:', error);
    return NextResponse.redirect(
      new URL('/admin?error=token_error', request.url)
    );
  }
}
