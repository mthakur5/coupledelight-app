'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { useCart } from '@/contexts/CartContext';
import { ShoppingBag, Search, ArrowLeft } from 'lucide-react';

interface Product {
  _id: string;
  name: string;
  shortDescription: string;
  sellingPrice: number;
  mrp: number;
  discount: number;
  category: string;
  images: string[];
  stock: number;
  featured: boolean;
}

const categoryNames: Record<string, string> = {
  ladies_toys: 'Ladies Sex Toys',
  mens_toys: 'Men Sex Toys',
  couples_toys: 'Couples Toys',
  vibrators: 'Vibrators',
  dildos: 'Dildos',
  lingerie: 'Lingerie',
  lubricants: 'Lubricants & Oils',
  bdsm: 'BDSM & Bondage',
  other: 'Other',
};

export default function CategoryPage() {
  const params = useParams();
  const category = params.category as string;
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const { addToCart } = useCart();

  useEffect(() => {
    fetchProducts();
  }, [category, searchQuery]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      params.append('category', category);
      if (searchQuery) {
        params.append('search', searchQuery);
      }

      const response = await fetch(`/api/products?${params.toString()}`);
      const data = await response.json();
      setProducts(data.products || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (product: Product) => {
    addToCart({
      _id: product._id,
      name: product.name,
      price: product.sellingPrice,
      image: product.images[0] || '',
      stock: product.stock,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold text-pink-600">
              CoupleDelight
            </Link>
            <nav className="hidden md:flex items-center gap-6">
              <Link href="/" className="hover:text-pink-600 transition-colors">Home</Link>
              <Link href="/shop" className="text-pink-600 font-medium">Shop</Link>
              <Link href="/dashboard" className="hover:text-pink-600 transition-colors">Dashboard</Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Category Header */}
      <div className="bg-gradient-to-r from-pink-500 to-purple-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <Link href="/shop" className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-4">
            <ArrowLeft className="w-4 h-4" />
            Back to Shop
          </Link>
          <h1 className="text-4xl font-bold mb-2">{categoryNames[category] || category}</h1>
          <p className="text-lg opacity-90">Explore our collection of {categoryNames[category]?.toLowerCase() || category}</p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search in this category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
                <div className="w-full h-64 bg-gray-200" />
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-3 bg-gray-200 rounded w-1/2" />
                  <div className="h-6 bg-gray-200 rounded w-1/3" />
                </div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12">
            <ShoppingBag className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No Products Found</h3>
            <p className="text-gray-500">Try adjusting your search query or browse other categories</p>
            <Link
              href="/shop"
              className="inline-block mt-4 px-6 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors"
            >
              Browse All Products
            </Link>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <p className="text-gray-600">
                Showing {products.length} {products.length === 1 ? 'product' : 'products'}
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <div key={product._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow group">
                  <Link href={`/shop/products/${product._id}`}>
                    <div className="relative w-full h-64 bg-gray-100 overflow-hidden">
                      {product.images[0] ? (
                        <Image
                          src={product.images[0]}
                          alt={product.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ShoppingBag className="w-16 h-16 text-gray-300" />
                        </div>
                      )}
                      {product.discount > 0 && (
                        <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-md text-sm font-semibold">
                          {product.discount}% OFF
                        </div>
                      )}
                      {product.featured && (
                        <div className="absolute top-2 left-2 bg-pink-500 text-white px-2 py-1 rounded-md text-xs font-semibold">
                          Featured
                        </div>
                      )}
                    </div>
                  </Link>

                  <div className="p-4">
                    <Link href={`/shop/products/${product._id}`}>
                      <h3 className="font-semibold text-gray-800 line-clamp-2 hover:text-pink-600 transition-colors mb-2">
                        {product.name}
                      </h3>
                    </Link>
                    <p className="text-sm text-gray-500 line-clamp-2 mb-3">{product.shortDescription}</p>
                    
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-lg font-bold text-pink-600">₹{product.sellingPrice.toLocaleString()}</span>
                      {product.discount > 0 && (
                        <span className="text-sm text-gray-400 line-through">₹{product.mrp.toLocaleString()}</span>
                      )}
                    </div>

                    <button
                      onClick={() => handleAddToCart(product)}
                      disabled={product.stock === 0}
                      className={`w-full py-2 rounded-lg font-medium transition-colors ${
                        product.stock === 0
                          ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                          : 'bg-pink-600 hover:bg-pink-700 text-white'
                      }`}
                    >
                      {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}