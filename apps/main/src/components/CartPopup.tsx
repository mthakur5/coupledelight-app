'use client';

import { useCart } from '@/contexts/CartContext';
import Image from 'next/image';
import Link from 'next/link';
import { X, Plus, Minus, Trash2, ShoppingBag } from 'lucide-react';

export default function CartPopup() {
  const { cart, isCartOpen, closeCart, updateQuantity, removeFromCart, cartTotal, cartCount } = useCart();

  if (!isCartOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 z-50 transition-opacity"
        onClick={closeCart}
      />

      {/* Cart Modal - Centered Popup */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-pink-50 to-purple-50">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-pink-600 rounded-full">
                <ShoppingBag className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Shopping Cart</h2>
                <p className="text-sm text-gray-600">{cartCount} {cartCount === 1 ? 'item' : 'items'}</p>
              </div>
            </div>
            <button
              onClick={closeCart}
              className="p-2 hover:bg-white rounded-full transition-colors"
              aria-label="Close cart"
            >
              <X className="w-6 h-6 text-gray-700" />
            </button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-6">
            {cart.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-gray-600">
                <ShoppingBag className="w-20 h-20 mb-4 text-gray-300" />
                <p className="text-xl font-semibold text-gray-900 mb-2">Your cart is empty</p>
                <p className="text-sm text-gray-500 mb-4">Add some products to get started</p>
                <button
                  onClick={closeCart}
                  className="px-6 py-2 bg-pink-600 hover:bg-pink-700 text-white rounded-lg font-medium transition-colors"
                >
                  Continue Shopping
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {cart.map((item) => (
                  <div key={item._id} className="flex gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                    <div className="relative w-24 h-24 flex-shrink-0 bg-white rounded-lg overflow-hidden border border-gray-200">
                      {item.image ? (
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-100">
                          <ShoppingBag className="w-8 h-8 text-gray-300" />
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-base text-gray-900 line-clamp-2 mb-2">{item.name}</h3>
                      <p className="text-lg font-bold text-pink-600 mb-3">₹{item.price.toLocaleString()}</p>
                      
                      <div className="flex items-center justify-between">
                        {/* Quantity Controls */}
                        <div className="flex items-center gap-3 bg-white rounded-lg border border-gray-300 p-1">
                          <button
                            onClick={() => updateQuantity(item._id, item.quantity - 1)}
                            className="p-1.5 hover:bg-gray-100 rounded transition-colors"
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="w-4 h-4 text-gray-700" />
                          </button>
                          <span className="text-base font-semibold w-10 text-center text-gray-900">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item._id, item.quantity + 1)}
                            className="p-1.5 hover:bg-gray-100 rounded transition-colors"
                            disabled={item.quantity >= item.stock}
                          >
                            <Plus className="w-4 h-4 text-gray-700" />
                          </button>
                        </div>

                        {/* Subtotal and Remove */}
                        <div className="flex items-center gap-3">
                          <span className="text-base font-bold text-gray-900">
                            ₹{(item.price * item.quantity).toLocaleString()}
                          </span>
                          <button
                            onClick={() => removeFromCart(item._id)}
                            className="p-2 hover:bg-red-50 rounded-lg text-red-600 transition-colors"
                            aria-label="Remove item"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>

                      {item.quantity >= item.stock && (
                        <p className="text-xs text-orange-600 mt-2 font-medium">Max stock reached</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {cart.length > 0 && (
            <div className="border-t bg-gradient-to-r from-pink-50 to-purple-50 p-6 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold text-gray-900">Subtotal:</span>
                <span className="text-2xl font-bold text-pink-600">₹{cartTotal.toLocaleString()}</span>
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={closeCart}
                  className="flex-1 border-2 border-gray-300 hover:border-gray-400 text-gray-700 font-semibold text-center py-3 rounded-xl transition-colors"
                >
                  Continue Shopping
                </button>
                <Link
                  href="/shop/checkout"
                  onClick={closeCart}
                  className="flex-1 bg-pink-600 hover:bg-pink-700 text-white text-center py-3 rounded-xl font-semibold transition-colors shadow-lg shadow-pink-600/30"
                >
                  Checkout →
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}