'use client';

import { useState, useEffect, FormEvent } from 'react';

interface Product {
  _id: string;
  name: string;
  description: string;
  shortDescription?: string;
  sku: string;
  mrp: number;
  sellingPrice: number;
  category: string;
  subCategory?: string;
  brand?: string;
  stock: number;
  lowStockThreshold: number;
  images: string[];
  status: string;
  featured: boolean;
  tags: string[];
  weight: number;
  dimensions: {
    length: number;
    width: number;
    height: number;
  };
  shippingRequired: boolean;
  taxable: boolean;
  taxRate: number;
  metaTitle?: string;
  metaDescription?: string;
}

interface EditProductModalProps {
  productId: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function EditProductModal({ productId, isOpen, onClose, onSuccess }: EditProductModalProps) {
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    shortDescription: '',
    description: '',
    sku: '',
    mrp: '',
    sellingPrice: '',
    category: 'other',
    subCategory: '',
    brand: '',
    stock: '0',
    lowStockThreshold: '10',
    status: 'active',
    featured: false,
    taxable: true,
    taxRate: '18',
  });

  useEffect(() => {
    if (isOpen && productId) {
      fetchProduct();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, productId]);

  const fetchProduct = async () => {
    // Clean and validate the product ID
    const cleanId = productId?.toString().trim();
    
    console.log('Fetching product with ID:', cleanId);
    console.log('ID type:', typeof cleanId);
    console.log('ID length:', cleanId?.length);
    console.log('Original productId:', productId);
    
    if (!cleanId || cleanId === 'undefined' || cleanId === 'null' || cleanId.length !== 24) {
      const errorMsg = `Invalid product ID: "${cleanId}" (length: ${cleanId?.length})`;
      console.error(errorMsg);
      setError(errorMsg);
      setFetching(false);
      return;
    }
    
    setFetching(true);
    setError('');
    
    try {
      const url = `/api/products/${cleanId}`;
      console.log('Fetching URL:', url);
      
      const response = await fetch(url, {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache',
        },
      });
      
      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Product data:', data);

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch product');
      }

      const product = data.product;
      
      const newFormData = {
        name: product.name || '',
        shortDescription: product.shortDescription || '',
        description: product.description || '',
        sku: product.sku || '',
        mrp: product.mrp?.toString() || '0',
        sellingPrice: product.sellingPrice?.toString() || '0',
        category: product.category || 'other',
        subCategory: product.subCategory || '',
        brand: product.brand || '',
        stock: product.stock?.toString() || '0',
        lowStockThreshold: product.lowStockThreshold?.toString() || '10',
        status: product.status || 'active',
        featured: product.featured || false,
        taxable: product.taxable !== undefined ? product.taxable : true,
        taxRate: product.taxRate?.toString() || '18',
      };
      
      console.log('Setting form data:', newFormData);
      setFormData(newFormData);
    } catch (err: unknown) {
      console.error('Error fetching product:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setFetching(false);
    }
  };

  const calculateDiscount = () => {
    const mrp = parseFloat(formData.mrp) || 0;
    const sellingPrice = parseFloat(formData.sellingPrice) || 0;
    if (mrp > 0 && sellingPrice > 0) {
      return ((mrp - sellingPrice) / mrp * 100).toFixed(2);
    }
    return '0';
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const productData = {
        name: formData.name,
        description: formData.description,
        shortDescription: formData.shortDescription,
        sku: formData.sku.toUpperCase(),
        mrp: parseFloat(formData.mrp),
        sellingPrice: parseFloat(formData.sellingPrice),
        discount: parseFloat(calculateDiscount()),
        category: formData.category,
        subCategory: formData.subCategory,
        brand: formData.brand,
        stock: parseInt(formData.stock),
        lowStockThreshold: parseInt(formData.lowStockThreshold),
        status: formData.status,
        featured: formData.featured,
        taxable: formData.taxable,
        taxRate: parseFloat(formData.taxRate),
      };

      const response = await fetch(`/api/products/${productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update product');
      }

      onSuccess();
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const discount = calculateDiscount();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">Edit Product</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          {fetching ? (
            <div className="text-center py-12">
              <div className="text-4xl mb-4">⏳</div>
              <p className="text-gray-600">Loading product data...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Product Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      SKU <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="sku"
                      value={formData.sku}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent uppercase"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Brand
                    </label>
                    <input
                      type="text"
                      name="brand"
                      value={formData.brand}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      required
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* Pricing */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Pricing</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      MRP (₹) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="mrp"
                      value={formData.mrp}
                      onChange={handleInputChange}
                      required
                      min="0"
                      step="0.01"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Selling Price (₹) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="sellingPrice"
                      value={formData.sellingPrice}
                      onChange={handleInputChange}
                      required
                      min="0"
                      step="0.01"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Discount (%)
                    </label>
                    <input
                      type="text"
                      value={discount}
                      disabled
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
                    />
                  </div>
                </div>
              </div>

              {/* Category & Inventory */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Category</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Category <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                      >
                        <option value="gifts">Gifts</option>
                        <option value="experiences">Experiences</option>
                        <option value="decorations">Decorations</option>
                        <option value="accessories">Accessories</option>
                        <option value="jewellery">Jewellery</option>
                        <option value="fashion">Fashion</option>
                        <option value="electronics">Electronics</option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Sub Category
                      </label>
                      <input
                        type="text"
                        name="subCategory"
                        value={formData.subCategory}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Inventory</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Stock <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        name="stock"
                        value={formData.stock}
                        onChange={handleInputChange}
                        required
                        min="0"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Status <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="status"
                        value={formData.status}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                        <option value="out_of_stock">Out of Stock</option>
                      </select>
                    </div>

                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        name="featured"
                        checked={formData.featured}
                        onChange={handleInputChange}
                        className="w-5 h-5 text-pink-600 border-gray-300 rounded focus:ring-pink-500"
                      />
                      <label className="ml-2 text-sm font-medium text-gray-700">
                        Featured Product
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tax */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Tax</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="taxable"
                      checked={formData.taxable}
                      onChange={handleInputChange}
                      className="w-5 h-5 text-pink-600 border-gray-300 rounded focus:ring-pink-500"
                    />
                    <label className="ml-2 text-sm font-medium text-gray-700">
                      Taxable
                    </label>
                  </div>

                  {formData.taxable && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tax Rate (%)
                      </label>
                      <input
                        type="number"
                        name="taxRate"
                        value={formData.taxRate}
                        onChange={handleInputChange}
                        min="0"
                        max="100"
                        step="0.01"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-4 pt-4 border-t border-gray-200">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg hover:from-pink-600 hover:to-purple-700 transition-colors font-medium disabled:opacity-50"
                >
                  {loading ? 'Updating...' : 'Update Product'}
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}