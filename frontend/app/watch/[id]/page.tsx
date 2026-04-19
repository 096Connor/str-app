"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { moviesAPI, historyAPI } from "@/lib/api";
import { isAuthenticated } from "@/lib/auth";
import { Movie } from "@/types/movie";
import VideoPlayer from "@/components/VideoPlayer";
import { paymentsAPI } from "@/lib/api";

export default function WatchPage() {
  const router = useRouter();
  const params = useParams();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);
  const [completed, setCompleted] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/login");
      return;
    }

    const fetchMovie = async () => {
      try {
        const data = await moviesAPI.getOne(params.id as string);
        setMovie(data);

        // Sprawdź subskrypcję
        const status = await paymentsAPI.getStatus();
        setIsSubscribed(status.isSubscribed);

        // Blokada premium
        if (data.isPremium && !status.isSubscribed) {
          router.push("/subscribe");
          return;
        }

        await historyAPI.add(params.id as string);

        const completedList = await historyAPI.getCompleted();
        const isCompleted = completedList.some((item: any) => item.movie.id === params.id);
        setCompleted(isCompleted);
      } catch {
        router.push("/movies");
      } finally {
        setLoading(false);
      }
    };

    if (params.id) fetchMovie();
  }, [params.id, router]);

  const handleMarkCompleted = async () => {
    if (!movie) return;
    await historyAPI.markCompleted(movie.id);
    setCompleted(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  if (!movie) return null;

  const videoSrc = movie.videoUrl;

  return (
    <div className="min-h-screen bg-black flex flex-col">
      {/* Top bar */}
      <div className="flex items-center gap-4 px-6 py-4 bg-black/80">
        <Link
          href={`/movies/${movie.id}`}
          className="text-white hover:text-red-500 transition flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
          </svg>
          Back
        </Link>
        <span className="text-gray-500">|</span>
        <h1 className="text-red-600 text-xl font-bold">NETFLIX</h1>
        <span className="text-white text-lg truncate">{movie.title}</span>

        <div className="ml-auto">
          {completed ? (
            <span className="text-green-400 flex items-center gap-2">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              Watched
            </span>
          ) : (
            <button
              onClick={handleMarkCompleted}
              disabled={completed}
              className={`flex items-center gap-2 px-4 py-2 rounded transition flex items-center gap-2 ${
                completed
                  ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                  : "bg-green-600 text-white hover:bg-green-700"
              }`}
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              {completed ? "Already watched" : "Mark as watched"}
            </button>
          )}
        </div>
      </div>

      {/* Player */}
      <div className="flex-1 flex items-center justify-center bg-black">
        <div className="w-full max-w-6xl px-0 md:px-8">
          <VideoPlayer
            onEnded={handleMarkCompleted}
            src={videoSrc}
            title={movie.title}
            poster={movie.thumbnail}
          />
        </div>
      </div>

      {/* Info */}
      <div className="px-6 py-6 md:px-16 bg-black border-t border-gray-900">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-8">
          <div className="flex-1">
            <h2 className="text-white text-2xl font-bold mb-2">{movie.title}</h2>
            <div className="flex items-center gap-3 mb-4 text-sm text-gray-400">
              <span>{movie.releaseYear}</span>
              <span>•</span>
              <span>{movie.duration} min</span>
              {movie.rating && (
                <>
                  <span>•</span>
                  <span className="text-yellow-400">⭐ {movie.rating}/10</span>
                </>
              )}
            </div>
            <div className="flex flex-wrap gap-2 mb-4">
              {movie.genre.map((g) => (
                <span key={g} className="bg-gray-800 text-gray-300 px-3 py-1 rounded-full text-xs">
                  {g}
                </span>
              ))}
            </div>
            {movie.description && (
              <p className="text-gray-300 leading-relaxed">{movie.description}</p>
            )}
          </div>

          <div className="md:w-64">
            <h3 className="text-gray-400 text-sm font-semibold uppercase mb-3">
              Keyboard Shortcuts
            </h3>
            <div className="space-y-2 text-sm">
              {[
                ["Space", "Play / Pause"],
                ["← / →", "Skip ±10 seconds"],
                ["M", "Mute / Unmute"],
                ["F", "Fullscreen"]
              ].map(([key, action]) => (
                <div key={key} className="flex justify-between">
                  <kbd className="bg-gray-800 text-gray-300 px-2 py-1 rounded text-xs font-mono">
                    {key}
                  </kbd>
                  <span className="text-gray-400">{action}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
