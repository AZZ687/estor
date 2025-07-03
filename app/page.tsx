"use client";


import Image from "next/image";

import { useEffect, useState } from 'react';

type Product = {
  id: number;
  name: string;
  price: number;
  quantity: number;
};


export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [newProduct, setNewProduct] = useState({ name: '', price: '', quantity: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  // متغيرات التعديل
  const [editId, setEditId] = useState<number | null>(null);
  const [editProduct, setEditProduct] = useState({ name: '', price: '', quantity: '' });

  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => setProducts(data));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewProduct({ ...newProduct, [e.target.name]: e.target.value });
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newProduct.name,
          price: Number(newProduct.price),
          quantity: Number(newProduct.quantity),
        }),
      });
      if (!res.ok) throw new Error('فشل في الإضافة');
      const added = await res.json();
      setProducts((prev) => [...prev, added]);
      setNewProduct({ name: '', price: '', quantity: '' });
    } catch (err: any) {
      setError(err.message || 'خطأ غير متوقع');
    }
    setLoading(false);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('هل أنت متأكد من حذف المنتج؟')) return;
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('فشل في الحذف');
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (err: any) {
      setError(err.message || 'خطأ غير متوقع');
    }
    setLoading(false);
  };

  // دوال التعديل
  const startEdit = (product: Product) => {
    setEditId(product.id);
    setEditProduct({ name: product.name, price: String(product.price), quantity: String(product.quantity) });
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditProduct({ ...editProduct, [e.target.name]: e.target.value });
  };

  const handleEditSave = async (e: React.FormEvent, id: number) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: editProduct.name,
          price: Number(editProduct.price),
          quantity: Number(editProduct.quantity),
        }),
      });
      if (!res.ok) throw new Error('فشل في التعديل');
      const updated = await res.json();
      setProducts((prev) => prev.map((p) => (p.id === id ? updated : p)));
      setEditId(null);
    } catch (err: any) {
      setError(err.message || 'خطأ غير متوقع');
    }
    setLoading(false);
  };

  const cancelEdit = () => {
    setEditId(null);
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-start p-8 bg-background font-sans">
      <h1 className="text-3xl font-bold mb-8 text-foreground">product list</h1>

      <form onSubmit={handleAdd} className="mb-8 flex flex-col md:flex-row gap-4 w-full max-w-3xl">
        <input
          name="name"
          value={newProduct.name}
          onChange={handleChange}
          placeholder="اسم المنتج"
          className="border rounded px-3 py-2 flex-1"
          required
        />
        <input
          name="price"
          value={newProduct.price}
          onChange={handleChange}
          placeholder="السعر"
          type="number"
          className="border rounded px-3 py-2 w-32"
          required
        />
        <input
          name="quantity"
          value={newProduct.quantity}
          onChange={handleChange}
          placeholder="الكمية"
          type="number"
          className="border rounded px-3 py-2 w-32"
          required
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          disabled={loading}
        >
          {loading ? 'جاري الإضافة...' : 'إضافة'}
        </button>
      </form>

      {error && <div className="mb-4 text-red-600">{error}</div>}

      <div className="overflow-x-auto w-full max-w-3xl">
        <table className="w-full border border-gray-300 rounded-lg shadow-md bg-white dark:bg-zinc-900">
          <thead className="bg-gray-100 dark:bg-zinc-800">
            <tr>
              <th className="py-3 px-4 border-b border-gray-300 text-center">ID<br /><span className="text-xs text-gray-400">رقم المنتج</span></th>
              <th className="py-3 px-4 border-b border-gray-300 text-center">الاسم<br /><span className="text-xs text-gray-400">Product Name</span></th>
              <th className="py-3 px-4 border-b border-gray-300 text-center">السعر<br /><span className="text-xs text-gray-400">Price</span></th>
              <th className="py-3 px-4 border-b border-gray-300 text-center">الكمية<br /><span className="text-xs text-gray-400">Quantity</span></th>
              <th className="py-3 px-4 border-b border-gray-300 text-center">تعديل<br /><span className="text-xs text-gray-400">Edit</span></th>
              <th className="py-3 px-4 border-b border-gray-300 text-center">حذف<br /><span className="text-xs text-gray-400">Delete</span></th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-6 px-4 text-center text-gray-500 dark:text-gray-400 border-b border-gray-200">لا توجد بيانات</td>
              </tr>
            ) : (
              products.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50 dark:hover:bg-zinc-800 transition">
                  <td className="py-2 px-4 border-b border-gray-200 text-center font-mono">{product.id}</td>
                  <td className="py-2 px-4 border-b border-gray-200 text-center">{product.name}</td>
                  <td className="py-2 px-4 border-b border-gray-200 text-center">{product.price}</td>
                  <td className="py-2 px-4 border-b border-gray-200 text-center">{product.quantity}</td>
                  <td className="py-2 px-4 border-b border-gray-200 text-center">
                    {editId === product.id ? (
                      <form onSubmit={(e) => handleEditSave(e, product.id)} className="flex flex-col md:flex-row gap-2 items-center">
                        <input
                          name="name"
                          value={editProduct.name}
                          onChange={handleEditChange}
                          className="border rounded px-2 py-1 w-24"
                          required
                        />
                        <input
                          name="price"
                          value={editProduct.price}
                          onChange={handleEditChange}
                          type="number"
                          className="border rounded px-2 py-1 w-16"
                          required
                        />
                        <input
                          name="quantity"
                          value={editProduct.quantity}
                          onChange={handleEditChange}
                          type="number"
                          className="border rounded px-2 py-1 w-16"
                          required
                        />
                        <button type="submit" className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 mr-1" disabled={loading}>حفظ</button>
                        <button type="button" className="text-gray-500 hover:underline" onClick={cancelEdit} disabled={loading}>إلغاء</button>
                      </form>
                    ) : (
                      <button
                        onClick={() => startEdit(product)}
                        className="text-blue-600 hover:underline"
                        disabled={loading}
                      >
                        تعديل
                      </button>
                    )}
                  </td>
                  <td className="py-2 px-4 border-b border-gray-200 text-center">
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="text-red-600 hover:underline"
                      disabled={loading}
                    >
                      حذف
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}

// إزالة الأكواد الزائدة خارج الدالة
