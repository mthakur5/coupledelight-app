'use client';

import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import LogoutButton from './LogoutButton';

export default function Navbar() {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [newEventsCount, setNewEventsCount] = useState(0);
  const [newCouplesCount, setNewCouplesCount] = useState(0);

  // Fetch new items count
  useEffect(() => {
    const fetchNewCounts = async () => {
      if (status !== 'authenticated') return;
      
      try {
        // Fetch new events count (created in last 7 days)
        const eventsRes = await fetch('/api/events?new=true');
        if (eventsRes.ok) {
          const eventsData = await eventsRes.json();
          setNewEventsCount(Array.isArray(eventsData) ? eventsData.length : 0);
        }

        // Fetch new couples count (created in last 7 days)
        const couplesRes = await fetch('/api/couples/search?new=true');
        if (couplesRes.ok) {
          const couplesData = await couplesRes.json();
          setNewCouplesCount(Array.isArray(couplesData) ? couplesData.length : 0);
        }
      } catch (error) {
        console.error('Error fetching new counts:', error);
      }
    };

    fetchNewCounts();
  }, [status]);

  // Don't show navbar on login or register pages, or if user is not logged in
  if (status === 'loading') return null;
  if (!session) return null;
  if (pathname === '/login' || pathname === '/register') return null;

  const isActive = (path: string) => {
    return pathname === path;
  };

  const navLinks = [
    { href: '/dashboard', label: 'Dashboard', icon: '🏠', badge: 0 },
    { href: '/events', label: 'Events', icon: '📅', badge: newEventsCount },
    { href: '/search-couples', label: 'Couples', icon: '💑', badge: newCouplesCount },
    { href: '/shop', label: 'Shop', icon: '🛍️', badge: 0 },
    { href: '/my-bookings', label: 'Bookings', icon: '📋', badge: 0 },
  ];

  return (
    <nav className="bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <span className="text-2xl font-bold text-white drop-shadow-lg group-hover:scale-105 transition-transform">
              💝 CoupleDelight
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-1.5 relative ${
                  isActive(link.href)
                    ? 'bg-white text-purple-600 shadow-md'
                    : 'text-white hover:bg-white/20'
                }`}
              >
                <span>{link.icon}</span>
                <span>{link.label}</span>
                {link.badge > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {link.badge > 9 ? '9+' : link.badge}
                  </span>
                )}
              </Link>
            ))}
          </div>

          {/* User Menu & Mobile Toggle */}
          <div className="flex items-center space-x-3">
            {/* User Dropdown */}
            <div className="relative hidden sm:block">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg transition-colors"
              >
                <span className="text-sm font-medium truncate max-w-[150px]">
                  {session.user?.name || session.user?.email}
                </span>
                <svg
                  className={`w-4 h-4 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl py-2 z-50">
                  <Link
                    href="/profile"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 transition-colors"
                    onClick={() => setUserMenuOpen(false)}
                  >
                    👤 View Profile
                  </Link>
                  <Link
                    href="/wishlist"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 transition-colors"
                    onClick={() => setUserMenuOpen(false)}
                  >
                    ❤️ My Wishlist
                  </Link>
                  <Link
                    href="/my-orders"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 transition-colors"
                    onClick={() => setUserMenuOpen(false)}
                  >
                    📦 My Orders
                  </Link>
                  <hr className="my-2" />
                  <div className="px-4 py-2">
                    <LogoutButton />
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Logout (Small Screens) */}
            <div className="sm:hidden">
              <LogoutButton />
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-md text-white hover:bg-white/20 transition-colors"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {mobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden pb-4 pt-2">
            <div className="flex flex-col space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all flex items-center gap-2 relative ${
                    isActive(link.href)
                      ? 'bg-white text-purple-600 shadow-md'
                      : 'text-white hover:bg-white/20'
                  }`}
                >
                  <span className="text-lg">{link.icon}</span>
                  <span>{link.label}</span>
                  {link.badge > 0 && (
                    <span className="ml-auto bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                      {link.badge > 9 ? '9+' : link.badge}
                    </span>
                  )}
                </Link>
              ))}
              <div className="pt-2 px-4">
                <div className="text-white text-sm mb-2 opacity-75">
                  {session.user?.name || session.user?.email}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}