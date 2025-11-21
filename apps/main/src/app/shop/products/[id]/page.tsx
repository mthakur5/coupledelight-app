'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { useCart } from '@/contexts/CartContext';
import { ShoppingBag, ArrowLeft, Plus, Minus, Heart, Share2, Package, Truck, ShieldCheck } from 'lucide-react';

interface Product {
  _id: string;
  name: string;
  description: string;
  shortDescription: string;
  sellingPrice: number;
  mrp: number;
  discount: number;
  category: string;
  subCategory: string;
  brand: string;
  images: string[];
  stock: number;
  tags: string[];
  weight: number;
  shippingRequired: boolean;
  taxable: boolean;
  taxRate: number;
}

export default function ProductDetailPage() {
  const params = useParams();
  const productId = params.id as string;
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [mounted, setMounted] = useState(false);
  const { addToCart, cartCount, openCart } = useCart();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    fetchProduct();
  }, [productId]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/products/${productId}`);
      const data = await response.json();
      setProduct(data.product);
    } catch (error) {
      console.error('Error fetching product:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (!product) return;
    
    for (let i = 0; i < quantity; i++) {
      addToCart({
        _id: product._id,
        name: product.name,
        price: product.sellingPrice,
        image: product.images[0] || '',
        stock: product.stock,
      });
    }
  };

  const incrementQuantity = () => {
    if (product && quantity < product.stock) {
      setQuantity(quantity + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <Link href="/" className="text-2xl font-bold text-pink-600">
              CoupleDelight
            </Link>
          </div>
        </header>
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="animate-pulse grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="aspect-square bg-gray-200 rounded-lg" />
              <div className="grid grid-cols-4 gap-2">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="aspect-square bg-gray-200 rounded" />
                ))}
              </div>
            </div>
            <div className="space-y-4">
              <div className="h-8 bg-gray-200 rounded w-3/4" />
              <div className="h-4 bg-gray-200 rounded w-1/2" />
              <div className="h-6 bg-gray-200 rounded w-1/3" />
              <div className="h-24 bg-gray-200 rounded" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <ShoppingBag className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">Product Not Found</h3>
          <Link href="/shop" className="text-pink-600 hover:underline">
            Back to Shop
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/shop" className="text-2xl font-bold text-pink-600 flex items-center gap-2">
              <ShoppingBag className="w-7 h-7" />
              <span className="hidden sm:inline">CoupleDelight Shop</span>
              <span className="sm:hidden">Shop</span>
            </Link>
            <div className="flex items-center gap-4">
              <nav className="hidden md:flex items-center gap-6">
                <Link href="/" className="text-gray-700 hover:text-pink-600 transition-colors">Home</Link>
                <Link href="/shop" className="text-pink-600 font-medium">Shop</Link>
                <Link href="/dashboard" className="text-gray-700 hover:text-pink-600 transition-colors">Dashboard</Link>
              </nav>
              
              {/* Cart Button */}
              <button
                onClick={openCart}
                className="relative p-3 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Open cart"
              >
                <ShoppingBag className="w-6 h-6 text-gray-700" />
                {mounted && cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-pink-600 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center gap-2 text-sm">
            <Link href="/shop" className="text-gray-600 hover:text-pink-600">Shop</Link>
            <span className="text-gray-400">/</span>
            <Link href={`/shop/category/${product.category}`} className="text-gray-600 hover:text-pink-600 capitalize">
              {product.category.replace(/_/g, ' ')}
            </Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-900 font-medium">{product.name}</span>
          </div>
        </div>
      </div>

      {/* Product Details */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <Link href="/shop" className="inline-flex items-center gap-2 text-gray-600 hover:text-pink-600 mb-6">
          <ArrowLeft className="w-4 h-4" />
          Back to Shop
        </Link>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Images Section */}
          <div className="space-y-4">
            <div className="aspect-square bg-white rounded-lg overflow-hidden shadow-md">
              {product.images.length > 0 ? (
                <div className="relative w-full h-full">
                  <Image
                    src={product.images[selectedImage]}
                    alt={product.name}
                    fill
                    className="object-contain"
                  />
                </div>
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-100">
                  <ShoppingBag className="w-24 h-24 text-gray-300" />
                </div>
              )}
            </div>

            {/* Thumbnail Images */}
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImage === index ? 'border-pink-600' : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="relative w-full h-full">
                      <Image
                        src={image}
                        alt={`${product.name} ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info Section */}
          <div className="space-y-6">
            <div>
              {product.brand && (
                <p className="text-sm text-gray-500 mb-2">Brand: {product.brand}</p>
              )}
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
              {product.shortDescription && (
                <p className="text-gray-600">{product.shortDescription}</p>
              )}
            </div>

            {/* Price */}
            <div className="flex items-center gap-4">
              <span className="text-3xl font-bold text-pink-600">₹{product.sellingPrice.toLocaleString()}</span>
              {product.discount > 0 && (
                <>
                  <span className="text-xl text-gray-400 line-through">₹{product.mrp.toLocaleString()}</span>
                  <span className="bg-red-500 text-white px-3 py-1 rounded-md text-sm font-semibold">
                    {product.discount}% OFF
                  </span>
                </>
              )}
            </div>

            {/* Stock Status */}
            <div>
              {product.stock > 0 ? (
                <p className="text-green-600 font-medium">In Stock ({product.stock} available)</p>
              ) : (
                <p className="text-red-600 font-medium">Out of Stock</p>
              )}
            </div>

            {/* Quantity Selector */}
            {product.stock > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">Quantity</label>
                <div className="flex items-center gap-3">
                  <button
                    onClick={decrementQuantity}
                    disabled={quantity <= 1}
                    className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-gray-700"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="text-lg font-medium w-12 text-center text-gray-900">{quantity}</span>
                  <button
                    onClick={incrementQuantity}
                    disabled={quantity >= product.stock}
                    className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-gray-700"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className={`w-full py-3 rounded-lg font-medium text-lg transition-colors ${
                product.stock === 0
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  : 'bg-pink-600 hover:bg-pink-700 text-white'
              }`}
            >
              {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
            </button>

            {/* Features */}
            <div className="grid grid-cols-3 gap-4 py-6 border-y">
              <div className="text-center">
                <Package className="w-8 h-8 mx-auto text-pink-600 mb-2" />
                <p className="text-xs text-gray-600">Quality Product</p>
              </div>
              <div className="text-center">
                <Truck className="w-8 h-8 mx-auto text-pink-600 mb-2" />
                <p className="text-xs text-gray-600">Free Shipping</p>
              </div>
              <div className="text-center">
                <ShieldCheck className="w-8 h-8 mx-auto text-pink-600 mb-2" />
                <p className="text-xs text-gray-600">Secure Payment</p>
              </div>
            </div>

            {/* Description */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">Description</h2>
              <p className="text-gray-700 whitespace-pre-line leading-relaxed">{product.description}</p>
            </div>

            {/* Tags */}
            {product.tags.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-2">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {product.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}