"use client";

import Link from "next/link";
import { Movie } from "@/types/movie";

interface MovieCardProps {
  movie: Movie;
  isCompleted?: boolean;
  isSubscribed?: boolean;
}

export default function MovieCard({
  movie,
  isCompleted = false,
  isSubscribed = false
}: MovieCardProps) {
  return (
    <Link href={`/movies/${movie.id}`}>
      <div className="group relative cursor-pointer transition-transform duration-300 hover:scale-105">
        <div className="relative aspect-[2/3] overflow-hidden rounded-lg">
          <img
            src={movie.thumbnail}
            alt={movie.title}
            className={`h-full w-full object-cover ${movie.isPremium && !isSubscribed ? "brightness-50" : ""}`}
          />

          {/* Premium badge */}
          {movie.isPremium && (
            <div
              className={`absolute top-2 right-2 text-xs px-2 py-1 rounded font-bold ${
                isSubscribed
                  ? "bg-yellow-500 text-black"
                  : "bg-gray-800 text-yellow-400 border border-yellow-400"
              }`}
            >
              PREMIUM
            </div>
          )}

          {/* Watched badge */}
          {isCompleted && (
            <div className="absolute top-2 left-2 bg-green-600 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
              <svg
                className="w-3 h-3"
                fill="none"
                stroke="currentColor"
                strokeWidth={2.5}
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              Watched
            </div>
          )}

          {/* Lock overlay for non-subscribers */}
          {movie.isPremium && !isSubscribed && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <svg
                  className="w-10 h-10 text-yellow-400 mx-auto mb-2"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" />
                </svg>
                <span className="text-yellow-400 text-xs font-bold">PREMIUM</span>
              </div>
            </div>
          )}

          {/* Hover overlay */}
          {(!movie.isPremium || isSubscribed) && (
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <div className="text-center p-4">
                <h3 className="text-white font-semibold text-lg mb-2">{movie.title}</h3>
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
          )}
        </div>

        <div className="mt-2">
          <h4 className="text-white font-medium truncate">{movie.title}</h4>
          <p className="text-gray-400 text-sm">{movie.releaseYear}</p>
        </div>
      </div>
    </Link>
  );
}
