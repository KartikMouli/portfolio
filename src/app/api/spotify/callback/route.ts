import { NextResponse } from 'next/server';
import { saveTokens } from '@/lib/spotify/auth';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const error = searchParams.get('error');

  if (error) {
    return NextResponse.redirect(new URL(`/admin?error=${error}`, request.url));
  }

  if (!code) {
    return NextResponse.redirect(new URL('/admin?error=no_code', request.url));
  }

  try {
    await saveTokens(code);
    return NextResponse.redirect(new URL('/admin?success=true', request.url));
  } catch (error) {
    console.error('Error in Spotify callback:', error);
    return NextResponse.redirect(
      new URL('/admin?error=token_error', request.url)
    );
  }
}
