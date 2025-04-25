import axios from 'axios';

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

interface TMDBResult {
  media_type: 'movie' | 'tv' | 'person';
  id: number;
  title?: string;
  name?: string;
  original_title?: string;
  original_name?: string;
  release_date?: string;
  first_air_date?: string;
  poster_path: string | null;
  overview: string;
  adult: boolean;
  original_language: string;
  genre_ids: number[];
  vote_average: number;
  vote_count: number;
  popularity: number;
  video?: boolean;
  origin_country?: string[];
}

export async function searchMovie(title: string, year?: number): Promise<TMDBResult | null> {
  try {
    const response = await axios.get(`${TMDB_BASE_URL}/search/multi`, {
      params: {
        api_key: TMDB_API_KEY,
        query: title,
        include_adult: true,
      },
    });

    const results = response.data.results as TMDBResult[];
    if (!results || results.length === 0) {
      return null;
    }

    // Filter out person results and get only movies and TV shows
    const mediaResults = results.filter(result => result.media_type !== 'person');

    // If year is provided, try to find exact match first
    if (year) {
      const exactMatch = mediaResults.find(item => {
        const releaseYear = item.release_date ? new Date(item.release_date).getFullYear() : 
                          item.first_air_date ? new Date(item.first_air_date).getFullYear() : null;
        return releaseYear === year;
      });
      if (exactMatch) {
        return exactMatch;
      }
    }


    // Return the first result (usually the most popular/relevant)
    return mediaResults[0];
  } catch (error) {
    console.error('Error searching TMDB:', error);
    return null;
  }
}

export async function getMovieDetails(tmdbId: number): Promise<TMDBResult | null> {
  try {
    const response = await axios.get(`${TMDB_BASE_URL}/movie/${tmdbId}`, {
      params: {
        api_key: TMDB_API_KEY,
        language: 'en-US',
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error fetching movie details:', error);
    return null;
  }
} 


