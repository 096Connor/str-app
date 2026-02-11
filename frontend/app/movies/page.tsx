// app/movies/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { moviesAPI } from '@/lib/api';
import { removeToken, isAuthenticated } from '@/lib/auth';
import { Movie } from '@/types/movie';
import MovieCard from '@/components/MovieCard';

export default function MoviesPage() {
  const router = useRouter();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');
  const [seeding, setSeeding] = useState(false);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/login');
      return;
    }
    fetchMovies();
  }, [router, selectedGenre]);

  const fetchMovies = async () => {
    setLoading(true);
    try {
      const data = await moviesAPI.getAll(selectedGenre, search);
      setMovies(data);
    } catch (error) {
      console.error('Failed to fetch movies', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchMovies();
  };

  const handleSeed = async () => {
    setSeeding(true);
    try {
      await moviesAPI.seed();
      fetchMovies();
    } catch (error) {
      console.error('Failed to seed movies', error);
    } finally {
      setSeeding(false);
    }
  };

  const handleLogout = () => {
    removeToken();
    router.push('/login');
  };

  const genres = ['Action', 'Drama', 'Crime', 'Sci-Fi', 'Romance', 'Adventure', 'Thriller'];

  return (
    <div className="min-h-screen bg-black">
      {/* Navbar */}
      <nav className="bg-black/90 border-b border-gray-800 px-8 py-4 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/dashboard">
              <h1 className="text-red-600 text-3xl font-bold cursor-pointer">NETFLIX</h1>
            </Link>
            <div className="flex gap-4">
              <Link href="/dashboard" className="text-gray-300 hover:text-white transition">
                Home
              </Link>
              <Link href="/movies" className="text-white font-semibold">
                Movies
              </Link>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <button
              onClick={handleSeed}
              disabled={seeding}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition text-sm disabled:opacity-50"
            >
              {seeding ? 'Seeding...' : 'Seed Movies'}
            </button>
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-8 py-8">
        {/* Search and Filters */}
        <div className="mb-8">
          <form onSubmit={handleSearch} className="flex gap-4 mb-4">
            <input
              type="text"
              placeholder="Search movies..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 px-4 py-3 bg-gray-800 text-white border border-gray-700 rounded focus:outline-none focus:border-red-600"
            />
            <button
              type="submit"
              className="bg-red-600 text-white px-6 py-3 rounded hover:bg-red-700 transition"
            >
              Search
            </button>
          </form>

          {/* Genre filters */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedGenre('')}
              className={`px-4 py-2 rounded transition ${
                selectedGenre === ''
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              All
            </button>
            {genres.map((genre) => (
              <button
                key={genre}
                onClick={() => setSelectedGenre(genre)}
                className={`px-4 py-2 rounded transition ${
                  selectedGenre === genre
                    ? 'bg-red-600 text-white'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                {genre}
              </button>
            ))}
          </div>
        </div>

        {/* Movies Grid */}
        {loading ? (
          <div className="text-white text-center py-20">Loading movies...</div>
        ) : movies.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-400 text-xl mb-4">No movies found</p>
            <button
              onClick={handleSeed}
              className="bg-green-600 text-white px-6 py-3 rounded hover:bg-green-700 transition"
            >
              Seed Sample Movies
            </button>
          </div>
        ) : (
          <>
            <h2 className="text-white text-2xl font-semibold mb-6">
              {selectedGenre ? `${selectedGenre} Movies` : 'All Movies'} ({movies.length})
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {movies.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
