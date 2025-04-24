import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { sql } from 'drizzle-orm';
import { parse } from 'csv-parse/sync';
import { searchMovie } from '@/lib/tmdb';

async function ensureMoviesTable() {
  try {
    // Check if table exists
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS movies (
        date DATE,
        name VARCHAR(255),
        year INTEGER,
        letterboxd_uri VARCHAR(255),
        tmdb_id INTEGER,
        poster_path VARCHAR(255),
        release_date DATE,
        overview TEXT
      );
    `);
  } catch (error) {
    console.error('Error ensuring movies table:', error);
    throw error;
  }
}

function convertDateToPostgresFormat(dateStr: string): string | null {
  if (!dateStr) return null;
  try {
    // Handle DD-MM-YYYY format
    const [day, month, year] = dateStr.split('-');
    if (!day || !month || !year) return null;
    return `${year}-${month}-${day}`;
  } catch {
    return null;
  }
}

interface Movie {
  date: string | null;
  name: string;
  year: number | null;
  letterboxd_uri: string | null;
  tmdb_id: number | null;
  poster_path: string | null;
  release_date: string | null;
  overview: string | null;
}

export async function GET() {
  try {
    await ensureMoviesTable();

    const result = await db.execute(sql`
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
    `);

    // Format the dates and handle null values
    const movies = result.rows.map(movie => ({
      ...movie,
      date: movie.date ? new Date(String(movie.date)).toISOString().split('T')[0] : null,
      release_date: movie.release_date ? new Date(String(movie.release_date)).toISOString().split('T')[0] : null,
      poster_path: movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : null
    })) as Movie[];

    return NextResponse.json(movies);
  } catch (error) {
    console.error('Error fetching movies:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch movies' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  let totalRecords = 0;
  let successfulRecords = 0;
  let failedRecords = 0;
  let skippedRecords = 0;
  let tmdbNotFoundRecords = 0;
  const failedDetails: string[] = [];

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file uploaded' },
        { status: 400 }
      );
    }

    await ensureMoviesTable();

    const text = await file.text();
    const records = parse(text, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
    });

    totalRecords = records.length;

    await db.execute(sql`
      TRUNCATE TABLE movies
    `);

    for (const record of records) {
      try {
        const date = record.Date;
        const name = record.Name;
        const year = record.Year;
        const letterboxd_uri = record['Letterboxd URI'];

        // Skip empty records
        if (!name && !date && !year && !letterboxd_uri) {
          skippedRecords++;
          continue;
        }

        if (!name) {
          throw new Error('Movie name is required');
        }

        const cleanName = String(name).replace(/'/g, "''");
        const cleanUri = letterboxd_uri ? String(letterboxd_uri).replace(/'/g, "''") : '';
        const cleanYear = year ? parseInt(String(year)) : undefined;
        const postgresDate = convertDateToPostgresFormat(date);

        // Search for movie in TMDB
        const tmdbData = await searchMovie(cleanName, cleanYear);
        
        if (tmdbData && tmdbData.id && tmdbData.title) {
          // Add movie with TMDB data
          await db.execute(sql`
            INSERT INTO movies (
              date, name, year, letterboxd_uri,
              tmdb_id, poster_path, release_date, overview
            )
            VALUES (
              ${postgresDate ? sql`${postgresDate}::date` : sql`NULL`},
              ${cleanName},
              ${cleanYear || sql`NULL`},
              ${cleanUri},
              ${tmdbData.id},
              ${tmdbData.poster_path || sql`NULL`},
              ${tmdbData.release_date || sql`NULL`},
              ${tmdbData.overview || sql`NULL`}
            )
          `);
        } else {
          // Add movie without TMDB data
          await db.execute(sql`
            INSERT INTO movies (
              date, name, year, letterboxd_uri,
              tmdb_id, poster_path, release_date, overview
            )
            VALUES (
              ${postgresDate ? sql`${postgresDate}::date` : sql`NULL`},
              ${cleanName},
              ${cleanYear || sql`NULL`},
              ${cleanUri},
              NULL,
              NULL,
              NULL,
              NULL
            )
          `);
          tmdbNotFoundRecords++;
        }
        successfulRecords++;
      } catch (error) {
        failedRecords++;
        failedDetails.push(`Failed to process record: ${JSON.stringify(record)} - ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }

    return NextResponse.json({
      message: 'Movies updated successfully',
      statistics: {
        totalRecords,
        successfulRecords,
        failedRecords,
        skippedRecords,
        tmdbNotFoundRecords,
        failedDetails
      }
    }, { status: 200 });
  } catch (error) {
    console.error('Error updating movies:', error);
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Failed to update movies',
      statistics: {
        totalRecords,
        successfulRecords,
        failedRecords,
        skippedRecords,
        tmdbNotFoundRecords,
        failedDetails
      }
    }, { status: 500 });
  }
} 