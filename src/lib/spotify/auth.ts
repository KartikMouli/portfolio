import { generateRandomString } from "@/lib/utils";
import { getSpotifyModel } from "@/models/spotify";
import connectDB from "@/lib/mongodb";
import axios from "axios";

// Use server-side environment variables
const client_id = process.env.SPOTIFY_CLIENT_ID as string;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET as string;
const redirect_uri = process.env.SPOTIFY_REDIRECT_URI as string;

// Only expose client_id and redirect_uri to client
export const getClientConfig = () => {
  return {
    client_id: process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID,
    redirect_uri: process.env.NEXT_PUBLIC_SPOTIFY_REDIRECT_URI,
  };
};

export const getAuthorizationUrl = () => {
  const state = generateRandomString(16);
  const scope = 'user-read-currently-playing user-read-playback-state';
  const { client_id, redirect_uri } = getClientConfig();

  const params = new URLSearchParams({
    response_type: 'code',
    client_id: client_id!,
    scope: scope,
    redirect_uri: redirect_uri!,
    state: state,
  });

  return `https://accounts.spotify.com/authorize?${params.toString()}`;
};

export const getAccessToken = async (code?: string) => {
  await connectDB();
  const Spotify = await getSpotifyModel();
  
  if (code) {
    // Handle initial authorization code flow
    const response = await axios.post('https://accounts.spotify.com/api/token',
      new URLSearchParams({
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: redirect_uri,
      }).toString(),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Basic ${Buffer.from(`${client_id}:${client_secret}`).toString('base64')}`,
        },
      }
    );

    if (response.status !== 200) {
      throw new Error('Failed to get access token');
    }

    const data = response.data;
    return {
      access_token: data.access_token,
      refresh_token: data.refresh_token,
      expires_in: data.expires_in,
    };
  }

  // Handle refresh token flow
  const spotifyData = await Spotify.findOne();
  
  if (!spotifyData) {
    throw new Error('No Spotify tokens found. Please connect your Spotify account first.');
  }

  // Check if token needs refresh (refresh 5 minutes before expiry)
  const now = new Date();
  const expiresAt = new Date(spotifyData.expires_at);
  const fiveMinutes = 5 * 60 * 1000; // 5 minutes in milliseconds

  if (now.getTime() + fiveMinutes >= expiresAt.getTime()) {
    // Token needs refresh
    const response = await axios.post('https://accounts.spotify.com/api/token', 
      new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: spotifyData.refresh_token,
      }).toString(),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Basic ${Buffer.from(`${client_id}:${client_secret}`).toString('base64')}`,
        },
      }
    );

    if (response.status !== 200) {
      throw new Error('Failed to refresh access token');
    }

    const data = response.data;
    const newExpiresAt = new Date(Date.now() + data.expires_in * 1000);

    // Update the token in database
    await Spotify.findOneAndUpdate(
      {},
      { 
        access_token: data.access_token,
        expires_at: newExpiresAt,
      },
      { new: true }
    );

    return data.access_token;
  }

  return spotifyData.access_token;
};

export const saveTokens = async (code: string) => {
  const response = await axios.post('https://accounts.spotify.com/api/token',
    new URLSearchParams({
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: redirect_uri,
    }).toString(),
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${Buffer.from(`${client_id}:${client_secret}`).toString('base64')}`,
      },
    }
  );

  if (response.status !== 200) {
    throw new Error('Failed to get access token');
  }

  const data = response.data;
  const expires_at = new Date(Date.now() + data.expires_in * 1000);

  await connectDB();
  const Spotify = await getSpotifyModel();
  await Spotify.findOneAndUpdate(
    {},
    { 
      access_token: data.access_token,
      refresh_token: data.refresh_token,
      expires_at,
    },
    { upsert: true, new: true }
  );

  return {
    access_token: data.access_token,
    refresh_token: data.refresh_token,
    expires_in: data.expires_in,
  };
}; 