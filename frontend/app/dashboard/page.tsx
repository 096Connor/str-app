"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { authAPI, watchlistAPI, historyAPI, recommendationsAPI, paymentsAPI } from "@/lib/api";
import { removeToken, isAuthenticated } from "@/lib/auth";
import { Movie } from "@/types/movie";

interface WatchlistItem {
  movie: Movie;
}

interface HistoryItem {
  id: string;
  watchedAt: string;
  movie: Movie;
}

function MovieGrid({
  movies,
  href,
  showDate = false,
  completed = false
}: {
  movies: HistoryItem[];
  href: (item: HistoryItem) => string;
  showDate?: boolean;
  completed?: boolean;
}) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {movies.map((item) => (
        <Link href={href(item)} key={item.id}>
          <div className="group relative cursor-pointer transition-transform duration-300 hover:scale-105">
            <div className="relative aspect-[2/3] overflow-hidden rounded-lg">
              <img
                src={item.movie.thumbnail}
                alt={item.movie.title}
                className="h-full w-full object-cover"
              />
              {completed && (
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
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
              {showDate && (
                <div className="absolute bottom-2 right-2 bg-black/70 text-gray-300 text-xs px-2 py-1 rounded">
                  {new Date(item.watchedAt).toLocaleDateString()}
                </div>
              )}
            </div>
            <div className="mt-2">
              <h4 className="text-white font-medium truncate">{item.movie.title}</h4>
              <p className="text-gray-400 text-sm">{item.movie.releaseYear}</p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}

function RecommendationGrid({ movies }: { movies: Movie[] }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {movies.map((movie) => (
        <Link href={`/movies/${movie.id}`} key={movie.id}>
          <div className="group relative cursor-pointer transition-transform duration-300 hover:scale-105">
            <div className="relative aspect-[2/3] overflow-hidden rounded-lg">
              <img src={movie.thumbnail} alt={movie.title} className="h-full w-full object-cover" />
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
            </div>
            <div className="mt-2">
              <h4 className="text-white font-medium truncate">{movie.title}</h4>
              <p className="text-gray-400 text-sm">{movie.releaseYear}</p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}

export default function DashboardPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!isAuthenticated()) router.push("/login");
  }, [router]);

  const { data: user, isLoading: userLoading } = useQuery({
    queryKey: ["profile"],
    queryFn: () => authAPI.getProfile(),
    enabled: mounted && isAuthenticated()
  });

  const { data: watchlist = [] } = useQuery({
    queryKey: ["watchlist"],
    queryFn: () => watchlistAPI.getAll(),
    enabled: mounted && isAuthenticated()
  });

  const { data: history = [] } = useQuery({
    queryKey: ["history"],
    queryFn: () => historyAPI.getAll(),
    enabled: mounted && isAuthenticated()
  });

  const { data: completedMovies = [] } = useQuery({
    queryKey: ["completed"],
    queryFn: () => historyAPI.getCompleted(),
    enabled: mounted && isAuthenticated()
  });

  const { data: recommendations = [] } = useQuery({
    queryKey: ["recommendations"],
    queryFn: () => recommendationsAPI.getAll(),
    enabled: mounted && isAuthenticated()
  });

  const { data: subscription } = useQuery({
    queryKey: ["subscription"],
    queryFn: () => paymentsAPI.getStatus(),
    enabled: mounted && isAuthenticated()
  });

  const clearHistoryMutation = useMutation({
    mutationFn: () => historyAPI.clear(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["history"] });
    }
  });

  const handleLogout = () => {
    removeToken();
    router.push("/login");
  };

  if (!mounted || userLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <nav className="bg-black/90 border-b border-gray-800 px-8 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-8">
            <h1 className="text-red-600 text-3xl font-bold">NETFLIX</h1>
            <div className="flex gap-4">
              <Link href="/dashboard" className="text-white font-semibold">
                Home
              </Link>
              <Link href="/movies" className="text-gray-300 hover:text-white transition">
                Movies
              </Link>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {subscription?.isSubscribed ? (
              <span className="text-green-400 text-sm flex items-center gap-1">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                Premium
              </span>
            ) : (
              <Link href="/subscribe">
                <button className="bg-yellow-500 text-black px-4 py-2 rounded font-semibold hover:bg-yellow-400 transition text-sm">
                  Get Premium
                </button>
              </Link>
            )}
            <span className="text-white">Welcome, {user?.name || user?.email}!</span>
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-8 py-12">
        {/* Profile */}
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-8 mb-8">
          <h2 className="text-white text-2xl font-semibold mb-4">Your Profile</h2>
          <div className="space-y-3 text-gray-300">
            <p>
              <span className="font-semibold">Email:</span> {user?.email}
            </p>
            {user?.name && (
              <p>
                <span className="font-semibold">Name:</span> {user.name}
              </p>
            )}
            <p>
              <span className="font-semibold">User ID:</span> {user?.id}
            </p>
            {user?.createdAt && (
              <p>
                <span className="font-semibold">Member since:</span>{" "}
                {new Date(user.createdAt).toLocaleDateString()}
              </p>
            )}
            <p>
              <span className="font-semibold">Subscription: </span>
              {subscription?.isSubscribed ? (
                <span className="text-green-400">
                  Premium — active until{" "}
                  {new Date(subscription.subscribedUntil).toLocaleDateString()}
                </span>
              ) : (
                <span className="text-gray-400">
                  Free plan —{" "}
                  <Link href="/subscribe" className="text-yellow-400 hover:underline">
                    Upgrade to Premium
                  </Link>
                </span>
              )}
            </p>
          </div>
        </div>

        {/* Quick access */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Link href="/movies">
            <div className="bg-gradient-to-r from-red-600 to-red-800 p-8 rounded-lg cursor-pointer hover:scale-105 transition-transform">
              <h3 className="text-white text-2xl font-bold mb-2">Browse Movies</h3>
              <p className="text-red-100">Discover thousands of movies</p>
            </div>
          </Link>
          <div className="bg-gradient-to-r from-gray-800 to-gray-900 p-8 rounded-lg">
            <h3 className="text-white text-2xl font-bold mb-2">My List</h3>
            <p className="text-gray-400">
              {watchlist.length} movie{watchlist.length !== 1 ? "s" : ""} saved
            </p>
          </div>
          {!subscription?.isSubscribed ? (
            <Link href="/subscribe">
              <div className="bg-gradient-to-r from-yellow-600 to-yellow-500 p-8 rounded-lg cursor-pointer hover:scale-105 transition-transform">
                <h3 className="text-black text-2xl font-bold mb-2">Get Premium</h3>
                <p className="text-yellow-900">Unlock all movies for 29.99 PLN/mo</p>
              </div>
            </Link>
          ) : (
            <div className="bg-gradient-to-r from-green-900 to-green-800 p-8 rounded-lg">
              <h3 className="text-white text-2xl font-bold mb-2">Watched</h3>
              <p className="text-green-300">
                {completedMovies.length} movie{completedMovies.length !== 1 ? "s" : ""} completed
              </p>
            </div>
          )}
        </div>

        {/* Recommendations */}
        {recommendations.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <h2 className="text-white text-2xl font-semibold">Recommended for You</h2>
              <span className="bg-red-600 text-white text-xs px-2 py-1 rounded">AI Pick</span>
            </div>
            <RecommendationGrid movies={recommendations} />
          </div>
        )}

        {/* My List */}
        {watchlist.length > 0 && (
          <div className="mb-12">
            <h2 className="text-white text-2xl font-semibold mb-6">My List</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {watchlist.map(({ movie }: WatchlistItem) => (
                <Link href={`/movies/${movie.id}`} key={movie.id}>
                  <div className="group relative cursor-pointer transition-transform duration-300 hover:scale-105">
                    <div className="relative aspect-[2/3] overflow-hidden rounded-lg">
                      <img
                        src={movie.thumbnail}
                        alt={movie.title}
                        className="h-full w-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <div className="text-center p-4">
                          <h3 className="text-white font-semibold text-lg mb-2">{movie.title}</h3>
                          <div className="flex items-center justify-center gap-2 text-sm text-gray-300">
                            <span>{movie.releaseYear}</span>
                            <span>•</span>
                            <span>{movie.duration} min</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="mt-2">
                      <h4 className="text-white font-medium truncate">{movie.title}</h4>
                      <p className="text-gray-400 text-sm">{movie.releaseYear}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Continue Watching */}
        {history.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-white text-2xl font-semibold">Continue Watching</h2>
              <button
                onClick={() => clearHistoryMutation.mutate()}
                disabled={clearHistoryMutation.isPending}
                className="text-gray-400 hover:text-white text-sm transition"
              >
                {clearHistoryMutation.isPending ? "Clearing..." : "Clear history"}
              </button>
            </div>
            <MovieGrid
              movies={history}
              href={(item) => `/watch/${item.movie.id}`}
              showDate={true}
            />
          </div>
        )}

        {/* Watched */}
        {completedMovies.length > 0 && (
          <div className="mb-12">
            <h2 className="text-white text-2xl font-semibold mb-6">Watched</h2>
            <MovieGrid
              movies={completedMovies}
              href={(item) => `/movies/${item.movie.id}`}
              showDate={true}
              completed={true}
            />
          </div>
        )}

        {/* Empty state */}
        {watchlist.length === 0 &&
          history.length === 0 &&
          completedMovies.length === 0 &&
          recommendations.length === 0 && (
            <div className="text-center py-12 bg-gray-900 border border-gray-800 rounded-lg">
              <p className="text-gray-400 text-lg mb-4">Start exploring movies!</p>
              <Link href="/movies">
                <button className="bg-red-600 text-white px-6 py-3 rounded hover:bg-red-700 transition">
                  Browse Movies
                </button>
              </Link>
            </div>
          )}
      </div>
    </div>
  );
}
