import axios from 'axios';

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

interface TMDBMovie {
  id: number;
  title: string;
  original_title: string;
  release_date: string;
  poster_path: string | null;
  overview: string;
  vote_average: number;
  vote_count: number;
}

export async function searchMovie(title: string, year?: number): Promise<TMDBMovie | null> {
  try {
    const response = await axios.get(`${TMDB_BASE_URL}/search/multi`, {
      params: {
        api_key: TMDB_API_KEY,
        query: title,
        year: year,
        include_adult: true,
      },
    });

    const results = response.data.results as TMDBMovie[];
    if (!results || results.length === 0) {
      return null;
    }

    // If year is provided, try to find exact match first
    if (year) {
      const exactMatch = results.find(movie => {
        const releaseYear = new Date(movie.release_date).getFullYear();
        return releaseYear === year;
      });
      if (exactMatch) {
        return exactMatch;
      }
    }

    // Return the first result (usually the most popular/relevant)
    return results[0];
  } catch (error) {
    console.error('Error searching TMDB:', error);
    return null;
  }
}

export async function getMovieDetails(tmdbId: number): Promise<TMDBMovie | null> {
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