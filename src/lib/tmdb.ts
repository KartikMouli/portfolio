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
    let page = 1;
    let totalPages = 1;

    while (page <= totalPages) {
      const response = await axios.get(`${TMDB_BASE_URL}/search/multi`, {
        params: {
          api_key: TMDB_API_KEY,
          query: title,
          include_adult: true,
          page: page,
        },
      });

      // Update total pages and results on first page
      if (page === 1) {
        totalPages = response.data.total_pages;
      }

      const results = response.data.results as TMDBResult[];
      if (!results || results.length === 0) {
        return null;
      }

      // Filter out person results and get only movies and TV shows
      const mediaResults = results.filter(result => result.media_type !== 'person');

      // If year is provided, try to find exact match first
      if (year) {
        const exactMatch = mediaResults.find(item => {
          // Get the correct title/name based on media type
          const itemTitle = item.media_type === 'movie' ? item.title : item.name;
          
          // Get the correct release date based on media type
          const releaseDate = item.media_type === 'movie' 
            ? item.release_date 
            : item.first_air_date;
            
          const releaseYear = releaseDate ? new Date(releaseDate).getFullYear() : null;
          
          // Check for exact name match and year match
          const nameMatch = itemTitle?.toLowerCase() === title.toLowerCase();
          
          return nameMatch && releaseYear === year;
        });

        if (exactMatch) {
          return exactMatch;
        }
      }

      // If no exact match found and we've checked all pages, return the first result
      if (page === totalPages) {
        return mediaResults[0] || null;
      }

      page++;
    }

    return null;
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


