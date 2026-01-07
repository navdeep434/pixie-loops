import ProductsClient from "./ProductsClient";
import { Category, Product } from "./types";

export const metadata = {
  title: "Shop All Products | PixieLoops",
  description: "Browse our collection of handmade crochet products - blankets, toys, bags, and more",
};

async function getCategories(): Promise<Category[]> {
  // 🔁 Replace with API later
  return [
    {
      id: 1,
      name: "Home Decor",
      icon: "🏠",
      children: [
        { id: 11, name: "Blankets", icon: "🧣" },
        { id: 12, name: "Cushion Covers", icon: "🛋️" },
        { id: 13, name: "Table Runners", icon: "🍽️" },
        { id: 14, name: "Wall Hangings", icon: "🖼️" },
      ],
    },
    {
      id: 2,
      name: "Accessories",
      icon: "👜",
      children: [
        { id: 21, name: "Bags", icon: "👜" },
        { id: 22, name: "Pouches", icon: "💼" },
        { id: 23, name: "Scarves", icon: "🧣" },
        { id: 24, name: "Hats", icon: "🎩" },
      ],
    },
    {
      id: 3,
      name: "Toys",
      icon: "🧸",
      children: [
        { id: 31, name: "Amigurumi", icon: "🐰" },
        { id: 32, name: "Keychains", icon: "🔑" },
        { id: 33, name: "Baby Toys", icon: "👶" },
      ],
    },
    {
      id: 4,
      name: "Clothing",
      icon: "👕",
      children: [
        { id: 41, name: "Sweaters", icon: "🧥" },
        { id: 42, name: "Cardigans", icon: "🧥" },
      ],
    },
  ];
}

async function getProducts(): Promise<Product[]> {
  return [
    { 
      id: 1, 
      name: "Cozy Baby Blanket", 
      price: 2499, 
      categoryId: 11,
      icon: "🧣",
      description: "Soft and warm baby blanket",
      badge: "handmade" as const,
      inStock: true,
      rating: 4.9,
    },
    { 
      id: 2, 
      name: "Bohemian Tote Bag", 
      price: 1499, 
      categoryId: 21,
      icon: "👜",
      description: "Spacious and stylish tote",
      badge: "best" as const,
      inStock: true,
      rating: 4.8,
    },
    { 
      id: 3, 
      name: "Adorable Bunny Amigurumi", 
      price: 1299, 
      categoryId: 31,
      icon: "🐰",
      description: "Cute handcrafted bunny toy",
      badge: "new" as const,
      inStock: true,
      rating: 5.0,
    },
    { 
      id: 4, 
      name: "Rainbow Cushion Cover", 
      price: 899, 
      categoryId: 12,
      icon: "🌈",
      description: "Colorful cushion cover",
      badge: "sale" as const,
      inStock: true,
      rating: 4.7,
    },
    { 
      id: 5, 
      name: "Vintage Table Runner", 
      price: 1599, 
      categoryId: 13,
      icon: "✨",
      description: "Elegant crochet table runner",
      badge: "handmade" as const,
      inStock: true,
      rating: 4.9,
    },
    { 
      id: 6, 
      name: "Cute Bear Keychain", 
      price: 399, 
      categoryId: 32,
      icon: "🧸",
      description: "Adorable bear keychain",
      badge: "new" as const,
      inStock: true,
      rating: 4.8,
    },
    { 
      id: 7, 
      name: "Cozy Winter Scarf", 
      price: 1199, 
      categoryId: 23,
      icon: "🧣",
      description: "Warm and stylish scarf",
      inStock: false,
      rating: 4.9,
    },
    { 
      id: 8, 
      name: "Elegant Pouch Set", 
      price: 799, 
      categoryId: 22,
      icon: "💼",
      description: "Set of 3 crochet pouches",
      badge: "best" as const,
      inStock: true,
      rating: 4.6,
    },
  ];
}

export default async function ProductsPage() {
  const categories = await getCategories();
  const products = await getProducts();

  return (
    <ProductsClient
      categories={categories}
      products={products}
    />
  );
}