// app/dashboard/page.tsx - ZAKTUALIZOWANA WERSJA
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { authAPI } from '@/lib/api';
import { removeToken, isAuthenticated } from '@/lib/auth';
import { User } from '@/types/auth';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!isAuthenticated()) {
        router.push('/login');
        return;
      }

      try {
        const profile = await authAPI.getProfile();
        setUser(profile);
      } catch (error) {
        console.error('Failed to fetch profile', error);
        removeToken();
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [router]);

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

  return (
    <div className="min-h-screen bg-black">
      {/* Navbar */}
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
            <span className="text-white">
              Welcome, {user?.name || user?.email}!
            </span>
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
      <div className="max-w-7xl mx-auto px-8 py-12">
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-8 mb-8">
          <h2 className="text-white text-2xl font-semibold mb-4">
            Your Profile
          </h2>
          
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
                <span className="font-semibold">Member since:</span>{' '}
                {new Date(user.createdAt).toLocaleDateString()}
              </p>
            )}
          </div>
        </div>

        {/* Quick access */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link href="/movies">
            <div className="bg-gradient-to-r from-red-600 to-red-800 p-8 rounded-lg cursor-pointer hover:scale-105 transition-transform">
              <h3 className="text-white text-2xl font-bold mb-2">Browse Movies</h3>
              <p className="text-red-100">Discover thousands of movies</p>
            </div>
          </Link>
          
          <div className="bg-gradient-to-r from-gray-800 to-gray-900 p-8 rounded-lg opacity-50 cursor-not-allowed">
            <h3 className="text-white text-2xl font-bold mb-2">My List</h3>
            <p className="text-gray-400">Coming soon...</p>
          </div>
        </div>
      </div>
    </div>
  );
}
