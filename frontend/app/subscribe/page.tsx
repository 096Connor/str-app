"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { paymentsAPI } from "@/lib/api";
import { isAuthenticated } from "@/lib/auth";

export default function SubscribePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!isAuthenticated()) router.push("/login");
  }, [router]);

  const { data: status } = useQuery({
    queryKey: ["subscription"],
    queryFn: () => paymentsAPI.getStatus(),
    enabled: mounted && isAuthenticated()
  });

  const handleSubscribe = async () => {
    setLoading(true);
    try {
      const { url } = await paymentsAPI.createCheckout();
      window.location.href = url;
    } catch (error) {
      console.error("Checkout error", error);
      setLoading(false);
    }
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="max-w-lg w-full">
        <div className="text-center mb-8">
          <h1 className="text-red-600 text-4xl font-bold mb-2">NETFLIX</h1>
          <h2 className="text-white text-2xl font-semibold">Get Premium Access</h2>
        </div>

        {searchParams.get("subscribed") === "true" && (
          <div className="bg-green-500/10 border border-green-500 text-green-400 px-4 py-3 rounded mb-6 text-center">
            🎉 Subscription activated! Enjoy premium content.
          </div>
        )}

        {searchParams.get("canceled") === "true" && (
          <div className="bg-red-500/10 border border-red-500 text-red-400 px-4 py-3 rounded mb-6 text-center">
            Payment canceled. You can try again anytime.
          </div>
        )}

        {status?.isSubscribed ? (
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-8 text-center">
            <div className="text-green-400 text-5xl mb-4">✓</div>
            <h3 className="text-white text-xl font-bold mb-2">You're a Premium Member!</h3>
            {status.subscribedUntil && (
              <p className="text-gray-400 mb-6">
                Valid until: {new Date(status.subscribedUntil).toLocaleDateString()}
              </p>
            )}
            <Link href="/movies">
              <button className="bg-red-600 text-white px-8 py-3 rounded font-bold hover:bg-red-700 transition">
                Browse Movies
              </button>
            </Link>
          </div>
        ) : (
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-8">
            <div className="text-center mb-6">
              <div className="text-4xl font-bold text-white mb-1">29.99 PLN</div>
              <div className="text-gray-400">per month</div>
            </div>

            <ul className="space-y-3 mb-8">
              {[
                "Access to all premium movies",
                "HD & 4K streaming quality",
                "Watch on any device",
                "Cancel anytime"
              ].map((feature) => (
                <li key={feature} className="flex items-center gap-3 text-gray-300">
                  <svg
                    className="w-5 h-5 text-green-400 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  {feature}
                </li>
              ))}
            </ul>

            <button
              onClick={handleSubscribe}
              disabled={loading}
              className="w-full bg-red-600 text-white py-4 rounded font-bold text-lg hover:bg-red-700 transition disabled:opacity-50"
            >
              {loading ? "Redirecting to payment..." : "Subscribe Now"}
            </button>

            <p className="text-gray-500 text-sm text-center mt-4">
              Secure payment via Stripe. Cancel anytime.
            </p>
          </div>
        )}

        <div className="text-center mt-6">
          <Link href="/dashboard" className="text-gray-400 hover:text-white transition">
            ← Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
