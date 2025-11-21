import ProductsList from '@/components/ProductsList';
import dbConnect from '@/lib/db';
import Product from '@/models/Product';
import Link from 'next/link';

async function getProductsData() {
  await dbConnect();
  
  const products = await Product.find().sort({ createdAt: -1 }).lean();

  const stats = {
    totalProducts: products.length,
    activeProducts: products.filter((p) => p.status === 'active').length,
    inactiveProducts: products.filter((p) => p.status === 'inactive').length,
    outOfStock: products.filter((p) => p.status === 'out_of_stock').length,
    totalValue: products.reduce((sum, p) => sum + (p.sellingPrice * p.stock), 0),
  };

  // Convert to plain objects with proper string IDs
  const plainProducts = products.map(p => {
    const productId = p._id?.toString() || String(p._id);
    return {
      _id: productId,
      name: p.name || '',
      description: p.description || '',
      sku: p.sku || '',
      mrp: p.mrp || 0,
      sellingPrice: p.sellingPrice || 0,
      category: p.category || 'other',
      brand: p.brand || '',
      stock: p.stock || 0,
      status: p.status || 'active',
      featured: p.featured || false,
      images: p.images || [],
    };
  });

  return { products: plainProducts, stats };
}

export default async function ProductsPage() {
  const { products, stats } = await getProductsData();

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Products Management</h1>
          <p className="text-gray-600 mt-2">Manage your product catalog</p>
        </div>
        <Link
          href="/dashboard/products/add"
          className="px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg hover:from-pink-600 hover:to-purple-700 transition-colors font-medium"
        >
          + Add Product
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Products</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalProducts}</p>
            </div>
            <div className="text-4xl">📦</div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.activeProducts}</p>
            </div>
            <div className="text-4xl">✅</div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Inactive</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.inactiveProducts}</p>
            </div>
            <div className="text-4xl">⏸️</div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Out of Stock</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.outOfStock}</p>
            </div>
            <div className="text-4xl">📭</div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Value</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">₹{stats.totalValue.toLocaleString()}</p>
            </div>
            <div className="text-4xl">💰</div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div className="flex gap-4">
          <input
            type="search"
            placeholder="Search products..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
          />
          <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent">
            <option value="">All Categories</option>
            <option value="gifts">Gifts</option>
            <option value="experiences">Experiences</option>
            <option value="decorations">Decorations</option>
            <option value="accessories">Accessories</option>
            <option value="other">Other</option>
          </select>
          <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent">
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="out_of_stock">Out of Stock</option>
          </select>
        </div>
      </div>

      {/* Products List Component */}
      <ProductsList products={products} />
    </div>
  );
}