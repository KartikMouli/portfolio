'use client';

import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

interface Movie {
  date: string;
  name: string;
  year: number;
  letterboxd_uri: string;
}

export default function MoviesList() {
  const { data: movies, isLoading, error } = useQuery({
    queryKey: ['movies'],
    queryFn: async () => {
      const response = await axios.get('/api/movies');
      return response.data as Movie[];
    }
  });

  if (isLoading) {
    return <div className="text-center py-8">Loading movies...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">Error loading movies</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6">Movies I've Watched</h2>
      <div className="grid gap-4">
        {movies?.map((movie, index) => (
          <div key={index} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-semibold">{movie.name}</h3>
                <p className="text-gray-600 dark:text-gray-300">{movie.year}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Watched on: {new Date(movie.date).toLocaleDateString()}
                </p>
              </div>
              <a
                href={movie.letterboxd_uri}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:text-blue-600"
              >
                View on Letterboxd
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 