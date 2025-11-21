'use client';

import Link from 'next/link';
import { useCart } from '@/contexts/CartContext';
import { ShoppingCart } from 'lucide-react';

export default function ShopNavigation() {
  const { cartCount, openCart } = useCart();

  return (
    <header className="bg-white border-b sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-pink-600">
            CoupleDelight
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/" className="hover:text-pink-600 transition-colors">
              Home
            </Link>
            <Link href="/shop" className="text-pink-600 font-medium">
              Shop
            </Link>
            <Link href="/dashboard" className="hover:text-pink-600 transition-colors">
              Dashboard
            </Link>
          </nav>
          <button
            onClick={openCart}
            className="relative p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Open cart"
          >
            <ShoppingCart className="w-6 h-6 text-gray-700" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-pink-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}