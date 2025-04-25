import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.NEONDB_DATABASE_URL as string);
export const db = drizzle(sql);

export interface Movie {
    date: string | null;
    name: string;
    year: number | null;
    letterboxd_uri: string | null;
    tmdb_id: number | null;
    poster_path: string | null;
    release_date: string | null;
    overview: string | null;
}

export async function getMovies() {
    const result = await sql`
        SELECT 
            date,
            name,
            year,
            letterboxd_uri,
            tmdb_id,
            poster_path,
            release_date,
            overview
        FROM movies
        ORDER BY date DESC
    `;
    
    return result.map(movie => ({
        ...movie,
        date: movie.date ? new Date(String(movie.date)).toISOString().split('T')[0] : null,
        release_date: movie.release_date ? new Date(String(movie.release_date)).toISOString().split('T')[0] : null,
        poster_path: movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : null
    })) as Movie[];
} 