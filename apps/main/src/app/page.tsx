"use client";

import { auth } from "@/lib/auth";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AuthModals from "@/components/AuthModals";
import CoupleOnlyNotification from "@/components/CoupleOnlyNotification";

export default function Home() {
  const { data: session, status, update } = useSession();
  const router = useRouter();
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  
  // Force refresh session on mount and when coming back to page
  useEffect(() => {
    const refreshSession = async () => {
      await update();
    };
    refreshSession();
  }, [update]);

  // Listen for storage events (logout from other tabs)
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'logout-event') {
        update();
        router.refresh();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [update, router]);

  const openLogin = () => {
    setShowRegister(false);
    setShowLogin(true);
  };

  const openRegister = () => {
    setShowLogin(false);
    setShowRegister(true);
  };

  const closeModals = () => {
    setShowLogin(false);
    setShowRegister(false);
  };

  return (
    <div className="min-h-screen relative">
      {/* Background Image with Overlay */}
      <div
        className="fixed inset-0 z-0"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1529636798458-92182e662485?q=80&w=2048&auto=format&fit=crop')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat"
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-rose-900/85 via-purple-900/90 to-gray-900/95"></div>
      </div>

      {/* Content */}
      <div className="relative z-10">
      <nav className="bg-black/40 backdrop-blur-md border-b border-rose-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex-shrink-0">
              <Link href="/" className="flex items-center group">
                <div className="relative">
                  <h1 className="text-4xl font-black tracking-wide relative z-10">
                    <span className="bg-gradient-to-r from-rose-400 via-pink-400 to-purple-400 bg-clip-text text-transparent drop-shadow-[0_2px_10px_rgba(251,113,133,0.4)] hover:drop-shadow-[0_2px_15px_rgba(251,113,133,0.6)] transition-all duration-300" style={{ fontFamily: "'Poppins', 'Outfit', sans-serif", letterSpacing: '0.02em' }}>
                      Couple<span className="text-purple-300">Delight</span>
                    </span>
                  </h1>
                  <div className="absolute -inset-1 bg-gradient-to-r from-rose-600/20 to-purple-600/20 blur-lg opacity-50 group-hover:opacity-75 transition-opacity duration-300 -z-10"></div>
                </div>
              </Link>
            </div>
            <div className="flex items-center gap-4">
              {session ? (
                <>
                  <span className="text-rose-200">
                    Welcome, {session.user?.email}
                  </span>
                  <Link
                    href="/dashboard"
                    className="bg-gradient-to-r from-rose-600 to-purple-600 text-white px-4 py-2 rounded-md hover:from-rose-700 hover:to-purple-700 transition-all"
                  >
                    Dashboard
                  </Link>
                </>
              ) : (
                <>
                  <button
                    onClick={openLogin}
                    className="text-rose-300 hover:text-rose-200 font-medium"
                  >
                    Login
                  </button>
                  <button
                    onClick={openRegister}
                    className="bg-gradient-to-r from-rose-600 to-purple-600 text-white px-4 py-2 rounded-md hover:from-rose-700 hover:to-purple-700 transition-all"
                  >
                    Sign Up
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h1 className="text-5xl font-extrabold text-white mb-6">
            Explore Your Desires, Connect with Like-Minded Couples
            <span className="block bg-gradient-to-r from-rose-400 to-purple-400 bg-clip-text text-transparent mt-2">
              The Ultimate Lifestyle Community
            </span>
          </h1>
          <p className="text-xl text-rose-100 mb-8 max-w-3xl mx-auto">
            CoupleDelight is your exclusive platform to discover adventurous couples,
            explore premium adult toys, and embrace the lifestyle you desire.
            Discreet, safe, and judgment-free.
          </p>

          {!session && (
            <div className="flex justify-center gap-4">
              <button
                onClick={openRegister}
                className="bg-gradient-to-r from-rose-600 to-purple-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:from-rose-700 hover:to-purple-700 transition-all shadow-lg shadow-rose-500/50"
              >
                Join the Community
              </button>
              <button
                onClick={openLogin}
                className="bg-white/10 backdrop-blur-md text-white px-8 py-3 rounded-lg text-lg font-semibold border-2 border-rose-400 hover:bg-white/20 transition-all"
              >
                Sign In
              </button>
            </div>
          )}
        </div>

        <div className="mt-20 grid md:grid-cols-3 gap-8">
          <div className="bg-black/40 backdrop-blur-md p-6 rounded-lg border border-rose-500/20 hover:border-rose-500/40 transition-all">
            <div className="text-4xl mb-4">👥</div>
            <h3 className="text-2xl font-semibold mb-2 text-rose-300">Couple Discovery</h3>
            <p className="text-rose-100">
              Connect with verified cuckold couples in your area. Browse profiles,
              chat privately, and arrange discreet meetups with like-minded partners.
            </p>
          </div>

          <Link href="/shop" className="block bg-black/40 backdrop-blur-md p-6 rounded-lg border border-purple-500/20 hover:border-purple-500/40 transition-all group cursor-pointer">
            <div className="text-4xl mb-4">🛍️</div>
            <h3 className="text-2xl font-semibold mb-2 text-purple-300 group-hover:text-purple-200 transition-colors">Premium Shop</h3>
            <p className="text-purple-100 mb-4">
              Explore our curated collection of high-quality adult toys, dildos,
              and pleasure products. Discreet packaging and secure checkout guaranteed.
            </p>
            <span className="text-purple-400 group-hover:text-purple-300 font-medium">
              Browse Products →
            </span>
          </Link>

          <div className="bg-black/40 backdrop-blur-md p-6 rounded-lg border border-rose-500/20 hover:border-rose-500/40 transition-all">
            <div className="text-4xl mb-4">🔒</div>
            <h3 className="text-2xl font-semibold mb-2 text-rose-300">Private & Secure</h3>
            <p className="text-rose-100">
              Your privacy is our priority. Verified profiles, encrypted messaging,
              and a safe space to explore your lifestyle without judgment.
            </p>
          </div>
        </div>

        <div className="mt-20 bg-gradient-to-r from-rose-900/50 to-purple-900/50 backdrop-blur-md rounded-2xl p-12 border border-rose-500/20">
          <h2 className="text-3xl font-bold text-white text-center mb-8">
            Why Choose CoupleDelight?
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-rose-600 rounded-full flex items-center justify-center text-2xl">
                ✓
              </div>
              <div>
                <h4 className="text-xl font-semibold text-rose-300 mb-2">Verified Members Only</h4>
                <p className="text-rose-100">
                  All couples undergo verification to ensure authenticity and safety in our community.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center text-2xl">
                ✓
              </div>
              <div>
                <h4 className="text-xl font-semibold text-purple-300 mb-2">Discreet Shopping</h4>
                <p className="text-purple-100">
                  Browse and purchase from top adult brands with complete privacy and secure delivery.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-rose-600 rounded-full flex items-center justify-center text-2xl">
                ✓
              </div>
              <div>
                <h4 className="text-xl font-semibold text-rose-300 mb-2">Advanced Matching</h4>
                <p className="text-rose-100">
                  Smart filters help you find couples who match your preferences and boundaries.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center text-2xl">
                ✓
              </div>
              <div>
                <h4 className="text-xl font-semibold text-purple-300 mb-2">24/7 Support</h4>
                <p className="text-purple-100">
                  Our dedicated team ensures a safe, respectful environment for all members.
                </p>
              </div>
            </div>
          </div>
        </div>

        {session && (
          <div className="mt-16 text-center">
            <Link
              href="/dashboard"
              className="inline-block bg-gradient-to-r from-rose-600 to-purple-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:from-rose-700 hover:to-purple-700 transition-all shadow-lg shadow-rose-500/50"
            >
              Go to Dashboard →
            </Link>
          </div>
        )}
      </main>

      <footer className="bg-black/40 backdrop-blur-md border-t border-rose-500/20 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-center text-rose-200">
            © 2024 CoupleDelight. A safe space for adventurous couples. 18+ Only.
          </p>
          <p className="text-center text-rose-300/60 text-sm mt-2">
            All activities are consensual between adults. Privacy guaranteed.
          </p>
        </div>
      </footer>
      </div>

      {/* Couple Only Notification */}
      <CoupleOnlyNotification />

      {/* Auth Modals */}
      <AuthModals
        showLogin={showLogin}
        showRegister={showRegister}
        onClose={closeModals}
        onSwitchToRegister={openRegister}
        onSwitchToLogin={openLogin}
      />
    </div>
  );
}
