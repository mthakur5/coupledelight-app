import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import dbConnect from '@/lib/db';
import Product from '@/models/Product';

// GET - Fetch all products
export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await dbConnect();

    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const status = searchParams.get('status');
    const search = searchParams.get('search');

    const query: Record<string, unknown> = {};

    if (category && category !== '') {
      query.category = category;
    }

    if (status && status !== '') {
      query.status = status;
    }

    if (search && search !== '') {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { sku: { $regex: search, $options: 'i' } },
        { brand: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } },
      ];
    }

    const products = await Product.find(query).sort({ createdAt: -1 });

    return NextResponse.json({ products }, { status: 200 });
  } catch (error: unknown) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// POST - Create a new product
export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await dbConnect();

    const body = await req.json();
    const {
      name,
      description,
      shortDescription,
      sku,
      mrp,
      sellingPrice,
      discount,
      category,
      subCategory,
      brand,
      stock,
      lowStockThreshold,
      images,
      status,
      featured,
      tags,
      weight,
      dimensions,
      shippingRequired,
      taxable,
      taxRate,
      metaTitle,
      metaDescription,
    } = body;

    // Validation
    if (!name || !description || !sku || mrp === undefined || sellingPrice === undefined || !category) {
      return NextResponse.json(
        { error: 'Missing required fields: name, description, sku, mrp, sellingPrice, category' },
        { status: 400 }
      );
    }

    // Check if SKU already exists
    const existingProduct = await Product.findOne({ sku: sku.toUpperCase() });
    if (existingProduct) {
      return NextResponse.json(
        { error: 'A product with this SKU already exists' },
        { status: 400 }
      );
    }

    const product = await Product.create({
      name,
      description,
      shortDescription: shortDescription || '',
      sku: sku.toUpperCase(),
      mrp,
      sellingPrice,
      discount: discount || 0,
      category,
      subCategory: subCategory || '',
      brand: brand || '',
      stock: stock || 0,
      lowStockThreshold: lowStockThreshold || 10,
      images: images || [],
      status: status || 'active',
      featured: featured || false,
      tags: tags || [],
      weight: weight || 0,
      dimensions: dimensions || { length: 0, width: 0, height: 0 },
      shippingRequired: shippingRequired !== undefined ? shippingRequired : true,
      taxable: taxable !== undefined ? taxable : true,
      taxRate: taxRate || 18,
      metaTitle: metaTitle || '',
      metaDescription: metaDescription || '',
    });

    return NextResponse.json(
      { message: 'Product created successfully', product },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error('Error creating product:', error);
    
    // Handle mongoose validation errors
    if (error instanceof Error && error.name === 'ValidationError') {
      return NextResponse.json(
        { error: 'Validation failed', details: error.message },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to create product', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}