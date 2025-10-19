import mongoose from 'mongoose';
import connectDB from '@/lib/mongodb';

const spotifySchema = new mongoose.Schema({
  access_token: { type: String, required: true },
  refresh_token: { type: String, required: true },
  expires_at: { type: Date, required: true },
});

// Initialize the model
let Spotify: mongoose.Model<{
  access_token: string;
  refresh_token: string;
  expires_at: Date;
}>;

// Function to get the model, ensuring connection is established
async function getSpotifyModel() {
  if (!Spotify) {
    await connectDB();
    Spotify =
      mongoose.models.Spotify || mongoose.model('Spotify', spotifySchema);
  }
  return Spotify;
}

export interface SpotifyData {
  device?: {
    id: string;
    is_active: boolean;
    is_private_session: boolean;
    is_restricted: boolean;
    name: string;
    type: string;
    volume_percent: number;
    supports_volume: boolean;
  };
  repeat_state?: string;
  shuffle_state?: boolean;
  context?: {
    type: string;
    href: string;
    external_urls: {
      spotify: string;
    };
    uri: string;
  };
  timestamp?: number;
  progress_ms?: number;
  is_playing: boolean;
  item?: {
    album: {
      album_type: string;
      total_tracks: number;
      available_markets: string[];
      external_urls: {
        spotify: string;
      };
      href: string;
      id: string;
      images: {
        url: string;
        height: number;
        width: number;
      }[];
      name: string;
      release_date: string;
      release_date_precision: string;
      type: string;
      uri: string;
      artists: {
        external_urls: {
          spotify: string;
        };
        href: string;
        id: string;
        name: string;
        type: string;
        uri: string;
      }[];
    };
    artists: {
      external_urls: {
        spotify: string;
      };
      href: string;
      id: string;
      name: string;
      type: string;
      uri: string;
    }[];
    available_markets: string[];
    disc_number: number;
    duration_ms: number;
    explicit: boolean;
    external_urls: {
      spotify: string;
    };
    href: string;
    id: string;
    is_playable: boolean;
    name: string;
    popularity: number;
    preview_url: string;
    track_number: number;
    type: string;
    uri: string;
    is_local: boolean;
  };
  currently_playing_type?: string;
  actions?: {
    interrupting_playback: boolean;
    pausing: boolean;
    resuming: boolean;
    seeking: boolean;
    skipping_next: boolean;
    skipping_prev: boolean;
    toggling_repeat_context: boolean;
    toggling_shuffle: boolean;
    toggling_repeat_track: boolean;
    transferring_playback: boolean;
  };
}

export { getSpotifyModel };
