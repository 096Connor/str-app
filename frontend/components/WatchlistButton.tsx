"use client";

import { useEffect, useState } from "react";
import { watchlistAPI } from "@/lib/api";

export default function WatchlistButton({ movieId }: { movieId: string }) {
  const [inWatchlist, setInWatchlist] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    watchlistAPI
      .check(movieId)
      .then(setInWatchlist)
      .finally(() => setLoading(false));
  }, [movieId]);

  const handleClick = async () => {
    setLoading(true);
    try {
      if (inWatchlist) {
        await watchlistAPI.remove(movieId);
        setInWatchlist(false);
      } else {
        await watchlistAPI.add(movieId);
        setInWatchlist(true);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className={`flex items-center gap-2 px-6 py-3 rounded font-semibold transition border ${
        inWatchlist
          ? "bg-white text-black border-white hover:bg-gray-200"
          : "bg-gray-600/80 text-white border-gray-500 hover:bg-gray-500"
      } disabled:opacity-50`}
    >
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        viewBox="0 0 24 24"
      >
        {inWatchlist ? (
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        ) : (
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
        )}
      </svg>
      {loading ? "..." : inWatchlist ? "In My List" : "My List"}
    </button>
  );
}
