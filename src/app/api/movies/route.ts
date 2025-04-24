import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { sql } from 'drizzle-orm';
import { parse } from 'csv-parse/sync';

async function ensureMoviesTable() {
  try {
    // Check if table exists
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS movies (
        date DATE,
        name VARCHAR(255),
        year INTEGER,
        letterboxd_uri VARCHAR(255)
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

export async function GET() {
  try {
    await ensureMoviesTable();

    const result = await db.execute(sql`
      SELECT * FROM movies
      ORDER BY date DESC
    `);

    return NextResponse.json(result.rows);
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

    // Ensure the table exists before processing the file
    await ensureMoviesTable();

    const text = await file.text();
    
    // Parse CSV with proper handling of quoted fields
    const records = parse(text, {
      columns: true, // Use first line as headers
      skip_empty_lines: true,
      trim: true,
    });

    totalRecords = records.length;

    // First, clear the existing table
    await db.execute(sql`
      TRUNCATE TABLE movies
    `);

    // Insert new data using parameterized queries
    for (const record of records) {
      try {
        // Get values with correct case
        const date = record.Date || record.date;
        const name = record.Name || record.name;
        const year = record.Year || record.year;
        const letterboxd_uri = record['Letterboxd URI'] || record.letterboxd_uri;

        // Clean and validate data with defaults
        const cleanName = name ? String(name).replace(/'/g, "''") : 'Unknown Movie';
        const cleanUri = letterboxd_uri ? String(letterboxd_uri).replace(/'/g, "''") : '';
        const cleanYear = year ? parseInt(String(year)) : 0;
        const postgresDate = convertDateToPostgresFormat(date);

        await db.execute(sql`
          INSERT INTO movies (date, name, year, letterboxd_uri)
          VALUES (
            ${postgresDate ? sql`${postgresDate}::date` : sql`NULL`},
            ${cleanName},
            ${cleanYear},
            ${cleanUri}
          )
        `);
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
        failedDetails
      }
    }, { status: 500 });
  }
} 