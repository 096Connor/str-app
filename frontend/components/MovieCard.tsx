// components/MovieCard.tsx
'use client';

import Link from 'next/link';
import { Movie } from '@/types/movie';

interface MovieCardProps {
  movie: Movie;
}

export default function MovieCard({ movie }: MovieCardProps) {
  return (
    <Link href={`/movies/${movie.id}`}>
      <div className="group relative cursor-pointer transition-transform duration-300 hover:scale-105">
        {/* Thumbnail */}
        <div className="relative aspect-[2/3] overflow-hidden rounded-lg">
          <img
            src={movie.thumbnail}
            alt={movie.title}
            className="h-full w-full object-cover"
          />
          
          {/* Overlay on hover */}
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <div className="text-center p-4">
              <h3 className="text-white font-semibold text-lg mb-2">
                {movie.title}
              </h3>
              <div className="flex items-center justify-center gap-2 text-sm text-gray-300">
                <span>{movie.releaseYear}</span>
                <span>•</span>
                <span>{movie.duration} min</span>
              </div>
              {movie.rating && (
                <div className="mt-2">
                  <span className="text-yellow-400">⭐ {movie.rating}/10</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Title below */}
        <div className="mt-2">
          <h4 className="text-white font-medium truncate">{movie.title}</h4>
          <p className="text-gray-400 text-sm">{movie.releaseYear}</p>
        </div>
      </div>
    </Link>
  );
}
