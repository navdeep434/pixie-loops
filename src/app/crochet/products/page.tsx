import ProductsClient from "./ProductsClient";
import { Category, Product } from "./types";

export const metadata = {
  title: "Shop All Products | PixieLoops",
  description: "Browse our collection of handmade crochet products - blankets, toys, bags, and more",
};

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api";

async function getCategories(): Promise<Category[]> {
  try {
    const res = await fetch(`${API_URL}/categories`, { next: { revalidate: 60 } });
    if (!res.ok) return [];
    const data = await res.json();
    return data.data ?? [];
  } catch {
    return [];
  }
}

async function getProducts(): Promise<Product[]> {
  try {
    const res = await fetch(`${API_URL}/products`, { next: { revalidate: 30 } });
    if (!res.ok) return [];
    const data = await res.json();
    return data.data ?? [];
  } catch {
    return [];
  }
}

export default async function ProductsPage() {
  const [categories, products] = await Promise.all([getCategories(), getProducts()]);
  return <ProductsClient categories={categories} products={products} />;
}