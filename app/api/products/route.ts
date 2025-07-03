import { NextResponse } from 'next/server';
import { getProducts, createProduct } from '../../lib/db';

// جلب جميع المنتجات
export async function GET() {
  try {
    const rows = await getProducts();
    return NextResponse.json(rows);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Server Error' }, { status: 500 });
  }
}

// إضافة منتج جديد
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, price, quantity } = body;
    if (!name || price === undefined || quantity === undefined) {
      return NextResponse.json({ message: 'Missing fields' }, { status: 400 });
    }
    const product = await createProduct({ name, price, quantity });
    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Server Error' }, { status: 500 });
  }
}
