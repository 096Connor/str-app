// app/page.tsx
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-red-950/20 to-black" />
      
      {/* Content */}
      <div className="relative z-10">
        {/* Navbar */}
        <nav className="px-8 py-6">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <h1 className="text-red-600 text-4xl font-bold">NETFLIX</h1>
            <Link
              href="/login"
              className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700 transition"
            >
              Sign In
            </Link>
          </div>
        </nav>

        {/* Hero */}
        <div className="max-w-4xl mx-auto px-8 py-32 text-center">
          <h2 className="text-white text-5xl md:text-6xl font-bold mb-6">
            Unlimited movies, TV shows, and more
          </h2>
          <p className="text-white text-xl md:text-2xl mb-4">
            Watch anywhere. Cancel anytime.
          </p>
          <p className="text-white text-lg mb-8">
            Ready to watch? Create your account to get started.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register"
              className="bg-red-600 text-white px-8 py-4 rounded text-lg font-semibold hover:bg-red-700 transition"
            >
              Get Started
            </Link>
            <Link
              href="/login"
              className="bg-gray-800 text-white px-8 py-4 rounded text-lg font-semibold hover:bg-gray-700 transition border border-gray-700"
            >
              Sign In
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="max-w-7xl mx-auto px-8 py-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="text-red-600 text-5xl mb-4">📺</div>
            <h3 className="text-white text-xl font-semibold mb-2">
              Enjoy on your TV
            </h3>
            <p className="text-gray-400">
              Watch on Smart TVs, PlayStation, Xbox, and more.
            </p>
          </div>
          
          <div className="text-center">
            <div className="text-red-600 text-5xl mb-4">📱</div>
            <h3 className="text-white text-xl font-semibold mb-2">
              Watch everywhere
            </h3>
            <p className="text-gray-400">
              Stream unlimited movies on your phone, tablet, and laptop.
            </p>
          </div>
          
          <div className="text-center">
            <div className="text-red-600 text-5xl mb-4">🎬</div>
            <h3 className="text-white text-xl font-semibold mb-2">
              Create profiles
            </h3>
            <p className="text-gray-400">
              Send kids on adventures with their favorite characters.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
