import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  description: string;
  shortDescription: string;
  sku: string;
  mrp: number;
  sellingPrice: number;
  discount: number;
  category: string;
  subCategory: string;
  brand: string;
  stock: number;
  lowStockThreshold: number;
  images: string[];
  status: 'active' | 'inactive' | 'out_of_stock';
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
  metaTitle: string;
  metaDescription: string;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema: Schema<IProduct> = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
      maxlength: [200, 'Product name cannot exceed 200 characters'],
    },
    description: {
      type: String,
      required: [true, 'Product description is required'],
      trim: true,
    },
    shortDescription: {
      type: String,
      trim: true,
      maxlength: [500, 'Short description cannot exceed 500 characters'],
    },
    sku: {
      type: String,
      required: [true, 'SKU is required'],
      unique: true,
      trim: true,
      uppercase: true,
    },
    mrp: {
      type: Number,
      required: [true, 'MRP is required'],
      min: [0, 'MRP cannot be negative'],
    },
    sellingPrice: {
      type: Number,
      required: [true, 'Selling price is required'],
      min: [0, 'Selling price cannot be negative'],
    },
    discount: {
      type: Number,
      default: 0,
      min: [0, 'Discount cannot be negative'],
      max: [100, 'Discount cannot exceed 100%'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: ['ladies_toys', 'mens_toys', 'couples_toys', 'vibrators', 'dildos', 'lingerie', 'lubricants', 'bdsm', 'other'],
      default: 'other',
    },
    subCategory: {
      type: String,
      trim: true,
    },
    brand: {
      type: String,
      trim: true,
    },
    stock: {
      type: Number,
      required: true,
      min: [0, 'Stock cannot be negative'],
      default: 0,
    },
    lowStockThreshold: {
      type: Number,
      default: 10,
      min: [0, 'Threshold cannot be negative'],
    },
    images: {
      type: [String],
      default: [],
      validate: {
        validator: function(v: string[]) {
          return v.length <= 10;
        },
        message: 'Cannot have more than 10 images',
      },
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'out_of_stock'],
      default: 'active',
    },
    featured: {
      type: Boolean,
      default: false,
    },
    tags: {
      type: [String],
      default: [],
    },
    weight: {
      type: Number,
      default: 0,
      min: [0, 'Weight cannot be negative'],
    },
    dimensions: {
      length: {
        type: Number,
        default: 0,
        min: [0, 'Length cannot be negative'],
      },
      width: {
        type: Number,
        default: 0,
        min: [0, 'Width cannot be negative'],
      },
      height: {
        type: Number,
        default: 0,
        min: [0, 'Height cannot be negative'],
      },
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
      min: [0, 'Tax rate cannot be negative'],
      max: [100, 'Tax rate cannot exceed 100%'],
    },
    metaTitle: {
      type: String,
      trim: true,
      maxlength: [60, 'Meta title cannot exceed 60 characters'],
    },
    metaDescription: {
      type: String,
      trim: true,
      maxlength: [160, 'Meta description cannot exceed 160 characters'],
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for faster queries
ProductSchema.index({ name: 1 });
ProductSchema.index({ sku: 1 });
ProductSchema.index({ category: 1 });
ProductSchema.index({ status: 1 });
ProductSchema.index({ sellingPrice: 1 });
ProductSchema.index({ mrp: 1 });
ProductSchema.index({ featured: 1 });
ProductSchema.index({ brand: 1 });

const Product: Model<IProduct> = mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);

export default Product;