import { NextResponse } from 'next/server';
import { getProductById, updateProduct, deleteProduct } from '../../../lib/db';

// جلب منتج واحد
export async function GET(_req: Request, { params }: { params: { id: string } }) {
  try {
    const id = Number(params.id);
    const product = await getProductById(id);
    if (!product) return NextResponse.json({ message: 'Not found' }, { status: 404 });
    return NextResponse.json(product);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Server Error' }, { status: 500 });
  }
}

// تحديث منتج
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const id = Number(params.id);
    const body = await req.json();
    const product = await updateProduct(id, body);
    if (!product) return NextResponse.json({ message: 'Not found or no fields to update' }, { status: 404 });
    return NextResponse.json(product);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Server Error' }, { status: 500 });
  }
}

// حذف منتج
export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  try {
    const id = Number(params.id);
    await deleteProduct(id);
    return NextResponse.json({ id });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Server Error' }, { status: 500 });
  }
}
