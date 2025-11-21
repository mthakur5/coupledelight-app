const mongoose = require('mongoose');

// MongoDB URI from .env.local
const MONGODB_URI = 'mongodb://manmohandb:Manmohan89%40%23@103.225.188.18:27017/coupledelight?authSource=admin';

// Product Schema
const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    shortDescription: {
      type: String,
      trim: true,
    },
    sku: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
    },
    mrp: {
      type: Number,
      required: true,
      min: 0,
    },
    sellingPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    discount: {
      type: Number,
      default: 0,
    },
    category: {
      type: String,
      required: true,
      enum: ['gifts', 'experiences', 'decorations', 'accessories', 'jewellery', 'fashion', 'electronics', 'other'],
    },
    subCategory: String,
    brand: String,
    stock: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    lowStockThreshold: {
      type: Number,
      default: 10,
    },
    images: [String],
    status: {
      type: String,
      enum: ['active', 'inactive', 'out_of_stock'],
      default: 'active',
    },
    featured: {
      type: Boolean,
      default: false,
    },
    tags: [String],
    weight: {
      type: Number,
      default: 0,
    },
    dimensions: {
      length: { type: Number, default: 0 },
      width: { type: Number, default: 0 },
      height: { type: Number, default: 0 },
    },
    shippingRequired: {
      type: Boolean,
      default: true,
    },
    taxable: {
      type: Boolean,
      default: true,
    },
    taxRate: {
      type: Number,
      default: 18,
    },
    metaTitle: String,
    metaDescription: String,
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema);

async function addSampleProduct() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Check if product already exists
    const existingProduct = await Product.findOne({ sku: 'WELLNESS-001' });
    
    if (existingProduct) {
      console.log('⚠️  Product with SKU WELLNESS-001 already exists');
      console.log('Product details:', {
        name: existingProduct.name,
        sku: existingProduct.sku,
        mrp: existingProduct.mrp,
        sellingPrice: existingProduct.sellingPrice,
        stock: existingProduct.stock,
      });
      await mongoose.connection.close();
      return;
    }

    // Create the product
    const productData = {
      name: 'Premium Silicone Massager for Women',
      description: 'High-quality, body-safe silicone personal massager designed for ultimate comfort and pleasure. Features multiple intensity settings, waterproof design, and rechargeable battery. Discreet packaging and fast shipping included.',
      shortDescription: 'Premium body-safe silicone massager with multiple settings, waterproof, and rechargeable.',
      sku: 'WELLNESS-001',
      mrp: 2999,
      sellingPrice: 1999,
      discount: 33.34,
      category: 'accessories',
      subCategory: 'Wellness & Personal Care',
      brand: 'Intimate Wellness',
      stock: 50,
      lowStockThreshold: 10,
      images: [
        'https://example.com/products/wellness-massager-main.jpg',
        'https://example.com/products/wellness-massager-side.jpg',
      ],
      status: 'active',
      featured: true,
      tags: ['wellness', 'personal care', 'womens health', 'self care', 'premium'],
      weight: 0.15,
      dimensions: {
        length: 18,
        width: 3.5,
        height: 3.5,
      },
      shippingRequired: true,
      taxable: true,
      taxRate: 18,
      metaTitle: 'Premium Silicone Wellness Massager for Women | Discreet',
      metaDescription: 'Shop premium body-safe silicone personal massager. Waterproof, rechargeable with multiple settings. Discreet packaging & fast delivery.',
    };

    console.log('\nCreating product...');
    const product = await Product.create(productData);
    
    console.log('\n✅ Product created successfully!');
    console.log('\nProduct Details:');
    console.log('================');
    console.log(`Name: ${product.name}`);
    console.log(`SKU: ${product.sku}`);
    console.log(`MRP: ₹${product.mrp}`);
    console.log(`Selling Price: ₹${product.sellingPrice}`);
    console.log(`Discount: ${product.discount}%`);
    console.log(`Category: ${product.category}`);
    console.log(`Brand: ${product.brand}`);
    console.log(`Stock: ${product.stock}`);
    console.log(`Status: ${product.status}`);
    console.log(`Featured: ${product.featured ? 'Yes' : 'No'}`);
    console.log(`Product ID: ${product._id}`);

    // Close connection
    await mongoose.connection.close();
    console.log('\n✅ Database connection closed');
    
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.close();
    }
    process.exit(1);
  }
}

// Run the script
addSampleProduct();