export const runtime = 'nodejs';

import dbConnect from '@/lib/db';
import Product from '@/models/Product';
import Link from 'next/link';
import { notFound } from 'next/navigation';

async function getProduct(id: string) {
  await dbConnect();
  const product = await Product.findById(id).lean();
  return product;
}

export default async function ProductViewPage({ params }: { params: { id: string } }) {
  const product = await getProduct(params.id);

  if (!product) {
    notFound();
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Product Details</h1>
          <p className="text-gray-600 mt-2">View complete product information</p>
        </div>
        <div className="flex gap-3">
          <Link
            href={`/dashboard/products/${params.id}/edit`}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            ✏️ Edit Product
          </Link>
          <Link
            href="/dashboard/products"
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            ← Back to Products
          </Link>
        </div>
      </div>

      {/* Product Image & Basic Info */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Product Image */}
          <div className="md:col-span-1">
            {product.images && product.images.length > 0 ? (
              <div className="space-y-4">
                <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                  <img 
                    src={product.images[0]} 
                    alt={product.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = '';
                      e.currentTarget.style.display = 'none';
                      e.currentTarget.parentElement!.innerHTML = '<div class="text-6xl">📦</div>';
                    }}
                  />
                </div>
                {product.images.length > 1 && (
                  <div className="grid grid-cols-4 gap-2">
                    {product.images.slice(1, 5).map((img, idx) => (
                      <div key={idx} className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                        <img 
                          src={img} 
                          alt={`${product.name} ${idx + 2}`}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="aspect-square bg-gradient-to-br from-pink-500 to-purple-600 rounded-lg flex items-center justify-center text-white text-6xl">
                📦
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="md:col-span-2 space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{product.name}</h2>
              {product.featured && (
                <span className="inline-block px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-semibold">
                  ⭐ Featured Product
                </span>
              )}
            </div>

            {product.shortDescription && (
              <p className="text-gray-600 text-lg">{product.shortDescription}</p>
            )}

            {/* Pricing */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">MRP</p>
                  <p className="text-xl font-bold text-gray-400 line-through">₹{product.mrp.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Selling Price</p>
                  <p className="text-2xl font-bold text-green-600">₹{product.sellingPrice.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Discount</p>
                  <p className="text-2xl font-bold text-pink-600">{product.discount.toFixed(2)}% OFF</p>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-blue-50 rounded-lg p-3">
                <p className="text-sm text-blue-600 mb-1">SKU</p>
                <p className="font-mono font-semibold text-blue-900">{product.sku}</p>
              </div>
              <div className="bg-green-50 rounded-lg p-3">
                <p className="text-sm text-green-600 mb-1">Stock</p>
                <p className="font-semibold text-green-900">{product.stock} units</p>
              </div>
              <div className="bg-purple-50 rounded-lg p-3">
                <p className="text-sm text-purple-600 mb-1">Category</p>
                <p className="font-semibold text-purple-900 capitalize">{product.category}</p>
              </div>
              <div className="bg-orange-50 rounded-lg p-3">
                <p className="text-sm text-orange-600 mb-1">Status</p>
                <p className="font-semibold text-orange-900 capitalize">{product.status}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Product Description */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Product Description</h3>
        <p className="text-gray-700 whitespace-pre-line">{product.description}</p>
      </div>

      {/* Product Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Category & Brand */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Category & Brand</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Category:</span>
              <span className="font-semibold capitalize">{product.category}</span>
            </div>
            {product.subCategory && (
              <div className="flex justify-between">
                <span className="text-gray-600">Sub Category:</span>
                <span className="font-semibold">{product.subCategory}</span>
              </div>
            )}
            {product.brand && (
              <div className="flex justify-between">
                <span className="text-gray-600">Brand:</span>
                <span className="font-semibold">{product.brand}</span>
              </div>
            )}
            {product.tags && product.tags.length > 0 && (
              <div>
                <span className="text-gray-600 block mb-2">Tags:</span>
                <div className="flex flex-wrap gap-2">
                  {product.tags.map((tag, idx) => (
                    <span key={idx} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Inventory */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Inventory</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Current Stock:</span>
              <span className={`font-semibold ${product.stock < product.lowStockThreshold ? 'text-red-600' : 'text-green-600'}`}>
                {product.stock} units
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Low Stock Alert:</span>
              <span className="font-semibold">{product.lowStockThreshold} units</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Status:</span>
              <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                product.status === 'active' 
                  ? 'bg-green-100 text-green-800'
                  : product.status === 'inactive'
                  ? 'bg-gray-100 text-gray-800'
                  : 'bg-red-100 text-red-800'
              }`}>
                {product.status === 'out_of_stock' ? 'Out of Stock' : product.status}
              </span>
            </div>
          </div>
        </div>

        {/* Shipping Details */}
        {product.shippingRequired && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Shipping Details</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Weight:</span>
                <span className="font-semibold">{product.weight} kg</span>
              </div>
              {product.dimensions && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Dimensions (L×W×H):</span>
                  <span className="font-semibold">
                    {product.dimensions.length} × {product.dimensions.width} × {product.dimensions.height} cm
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tax Information */}
        {product.taxable && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Tax Information</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Taxable:</span>
                <span className="font-semibold text-green-600">Yes</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tax Rate:</span>
                <span className="font-semibold">{product.taxRate}%</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* SEO Information */}
      {(product.metaTitle || product.metaDescription) && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">SEO Information</h3>
          <div className="space-y-3">
            {product.metaTitle && (
              <div>
                <span className="text-gray-600 block mb-1">Meta Title:</span>
                <p className="font-medium">{product.metaTitle}</p>
              </div>
            )}
            {product.metaDescription && (
              <div>
                <span className="text-gray-600 block mb-1">Meta Description:</span>
                <p className="text-gray-700">{product.metaDescription}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Timestamps */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Product Information</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <span className="text-gray-600 block mb-1">Created At:</span>
            <p className="font-medium">{new Date(product.createdAt).toLocaleString()}</p>
          </div>
          <div>
            <span className="text-gray-600 block mb-1">Last Updated:</span>
            <p className="font-medium">{new Date(product.updatedAt).toLocaleString()}</p>
          </div>
        </div>
      </div>
    </div>
  );
}