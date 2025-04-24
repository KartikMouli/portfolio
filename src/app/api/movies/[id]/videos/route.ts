import { NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        // Ensure params are properly awaited
        const { id } = await params;

        if (!id) {
            return NextResponse.json(
                { error: 'Movie ID is required' },
                { status: 400 }
            );
        }

        const response = await axios.get(`https://api.themoviedb.org/3/movie/${id}/videos`, {
            params: {
                api_key: process.env.TMDB_API_KEY,
            }
        });

        // Filter for YouTube trailers and teasers
        const videos = response.data.results.filter((video: any) =>
            video.site === 'YouTube' &&
            (video.type === 'Trailer' || video.type === 'Teaser')
        );

        return NextResponse.json(videos);
    } catch (error) {
        console.error('Error fetching movie videos:', error);
        return NextResponse.json(
            { error: 'Failed to fetch movie videos' },
            { status: 500 }
        );
    }
} 