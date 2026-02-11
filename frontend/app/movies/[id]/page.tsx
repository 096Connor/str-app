// app/movies/[id]/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { moviesAPI } from '@/lib/api';
import { removeToken, isAuthenticated } from '@/lib/auth';
import { Movie } from '@/types/movie';

export default function MovieDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/login');
      return;
    }

    const fetchMovie = async () => {
      try {
        const data = await moviesAPI.getOne(params.id as string);
        setMovie(data);
      } catch (error) {
        console.error('Failed to fetch movie', error);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchMovie();
    }
  }, [params.id, router]);

  const handleLogout = () => {
    removeToken();
    router.push('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <p className="text-white text-xl mb-4">Movie not found</p>
          <Link href="/movies" className="text-red-600 hover:underline">
            Back to movies
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Navbar */}
      <nav className="bg-black/90 border-b border-gray-800 px-8 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/dashboard">
              <h1 className="text-red-600 text-3xl font-bold cursor-pointer">NETFLIX</h1>
            </Link>
            <Link href="/movies" className="text-gray-300 hover:text-white transition">
              ← Back to Movies
            </Link>
          </div>
          
          <button
            onClick={handleLogout}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
          >
            Logout
          </button>
        </div>
      </nav>

      {/* Movie Details */}
      <div className="max-w-7xl mx-auto px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Poster */}
          <div className="md:col-span-1">
            <img
              src={movie.thumbnail}
              alt={movie.title}
              className="w-full rounded-lg shadow-2xl"
            />
          </div>

          {/* Details */}
          <div className="md:col-span-2">
            <h1 className="text-white text-4xl font-bold mb-4">{movie.title}</h1>
            
            <div className="flex items-center gap-4 mb-6">
              <span className="text-gray-300">{movie.releaseYear}</span>
              <span className="text-gray-500">•</span>
              <span className="text-gray-300">{movie.duration} min</span>
              {movie.rating && (
                <>
                  <span className="text-gray-500">•</span>
                  <span className="text-yellow-400">⭐ {movie.rating}/10</span>
                </>
              )}
            </div>

            {/* Genres */}
            <div className="flex flex-wrap gap-2 mb-6">
              {movie.genre.map((g) => (
                <span
                  key={g}
                  className="bg-gray-800 text-gray-300 px-3 py-1 rounded-full text-sm"
                >
                  {g}
                </span>
              ))}
            </div>

            {/* Description */}
            {movie.description && (
              <div className="mb-8">
                <h2 className="text-white text-xl font-semibold mb-2">Overview</h2>
                <p className="text-gray-300 text-lg leading-relaxed">
                  {movie.description}
                </p>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-4">
              <a
                href={movie.videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-red-600 text-white px-8 py-3 rounded font-semibold hover:bg-red-700 transition flex items-center gap-2"
              >
                ▶ Watch Trailer
              </a>
              <button className="bg-gray-800 text-white px-8 py-3 rounded font-semibold hover:bg-gray-700 transition flex items-center gap-2">
                + My List
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
