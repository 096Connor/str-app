import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import WatchlistButton from "@/components/WatchlistButton";

interface Movie {
  id: string;
  title: string;
  description?: string;
  releaseYear: number;
  duration: number;
  genre: string[];
  thumbnail: string;
  videoUrl: string;
  rating?: number;
  isPremium: boolean;
}

async function getMovie(id: string, token: string): Promise<Movie | null> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/movies/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
      next: { revalidate: 60 }
    });
    if (!response.ok) return null;
    return response.json();
  } catch {
    return null;
  }
}

async function getSubscriptionStatus(token: string): Promise<boolean> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/payments/status`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store"
    });
    if (!response.ok) return false;
    const data = await response.json();
    return data.isSubscribed;
  } catch {
    return false;
  }
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value || "";
  const movie = await getMovie(id, token);

  if (!movie) return { title: "Movie Not Found" };

  return {
    title: `${movie.title} (${movie.releaseYear}) — Netflix Clone`,
    description: movie.description,
    openGraph: {
      title: movie.title,
      description: movie.description,
      images: [movie.thumbnail]
    }
  };
}

export default async function MovieDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) redirect("/login");

  const [movie, isSubscribed] = await Promise.all([
    getMovie(id, token),
    getSubscriptionStatus(token)
  ]);

  if (!movie) notFound();

  return (
    <div className="min-h-screen bg-black">
      {/* Navbar */}
      <nav className="bg-black/90 border-b border-gray-800 px-8 py-4 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/dashboard">
              <h1 className="text-red-600 text-3xl font-bold cursor-pointer">NETFLIX</h1>
            </Link>
            <Link
              href="/movies"
              className="text-gray-300 hover:text-white transition flex items-center gap-1"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
              </svg>
              Back to Movies
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero banner */}
      <div className="relative h-[50vh] overflow-hidden">
        <img
          src={movie.thumbnail}
          alt={movie.title}
          className={`w-full h-full object-cover object-top ${movie.isPremium && !isSubscribed ? "opacity-20" : "opacity-40"}`}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/40 to-transparent" />
      </div>

      {/* Szczegóły */}
      <div className="max-w-7xl mx-auto px-8 -mt-48 relative z-10 pb-16">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="hidden md:block md:w-64 flex-shrink-0">
            <img
              src={movie.thumbnail}
              alt={movie.title}
              className="w-full rounded-lg shadow-2xl border border-gray-800"
            />
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-3 mb-4">
              <h1 className="text-white text-5xl font-bold drop-shadow-lg">{movie.title}</h1>
              {movie.isPremium && (
                <span className="bg-yellow-500 text-black text-sm px-3 py-1 rounded font-bold">
                  PREMIUM
                </span>
              )}
            </div>

            <div className="flex items-center gap-4 mb-4 text-gray-300">
              <span className="text-green-400 font-semibold">
                {movie.rating ? `${(movie.rating * 10).toFixed(0)}% Match` : "New"}
              </span>
              <span>{movie.releaseYear}</span>
              <span className="border border-gray-500 px-2 py-0.5 text-sm rounded">
                {movie.duration} min
              </span>
              {movie.rating && <span className="text-yellow-400">⭐ {movie.rating}/10</span>}
            </div>

            <div className="flex flex-wrap gap-2 mb-6">
              {movie.genre.map((g) => (
                <span key={g} className="bg-gray-800 text-gray-300 px-3 py-1 rounded-full text-sm">
                  {g}
                </span>
              ))}
            </div>

            {movie.description && (
              <p className="text-gray-300 text-lg leading-relaxed mb-8 max-w-2xl">
                {movie.description}
              </p>
            )}

            <div className="flex flex-wrap gap-4">
              {movie.isPremium && !isSubscribed ? (
                <Link href="/subscribe">
                  <button className="flex items-center gap-3 bg-yellow-500 text-black px-8 py-3 rounded font-bold text-lg hover:bg-yellow-400 transition">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" />
                    </svg>
                    Get Premium to Watch
                  </button>
                </Link>
              ) : (
                <Link href={`/watch/${movie.id}`}>
                  <button className="flex items-center gap-3 bg-white text-black px-8 py-3 rounded font-bold text-lg hover:bg-gray-200 transition">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                    Play
                  </button>
                </Link>
              )}

              <WatchlistButton movieId={movie.id} />

              <a
                href={movie.videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-transparent text-white px-6 py-3 rounded font-semibold hover:bg-white/10 transition border border-gray-500"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 100 20A10 10 0 0012 2z"
                  />
                </svg>
                Trailer
              </a>
            </div>

            {movie.isPremium && !isSubscribed && (
              <div className="mt-6 bg-yellow-500/10 border border-yellow-500 rounded-lg p-4">
                <p className="text-yellow-400 font-semibold mb-1">🔒 Premium Content</p>
                <p className="text-gray-300 text-sm">
                  Subscribe to Netflix Premium for 29.99 PLN/month to watch this and all other
                  premium movies.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
