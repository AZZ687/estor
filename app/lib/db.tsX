// lib/db.ts
import mysql from 'mysql2/promise';

export const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'estore',
});

// دوال CRUD للمنتجات
export async function getProducts() {
  const [rows] = await db.query('SELECT * FROM products');
  return rows;
}

export async function getProductById(id: number) {
  const [rows] = await db.query('SELECT * FROM products WHERE id = ?', [id]);
  return Array.isArray(rows) && rows.length > 0 ? rows[0] : null;
}

export async function createProduct(product: { name: string; price: number; quantity: number }) {
  const [result]: any = await db.query(
    'INSERT INTO products (name, price, quantity) VALUES (?, ?, ?)',
    [product.name, product.price, product.quantity]
  );
  return { id: result.insertId, ...product };
}

export async function updateProduct(id: number, product: { name?: string; price?: number; quantity?: number }) {
  const fields = [];
  const values = [];
  if (product.name !== undefined) { fields.push('name = ?'); values.push(product.name); }
  if (product.price !== undefined) { fields.push('price = ?'); values.push(product.price); }
  if (product.quantity !== undefined) { fields.push('quantity = ?'); values.push(product.quantity); }
  if (fields.length === 0) return null;
  values.push(id);
  await db.query(`UPDATE products SET ${fields.join(', ')} WHERE id = ?`, values);
  return getProductById(id);
}

export async function deleteProduct(id: number) {
  await db.query('DELETE FROM products WHERE id = ?', [id]);
  return { id };
}
