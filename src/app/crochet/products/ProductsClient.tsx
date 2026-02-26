"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Category, Product } from "./types";
import CategoryTree from "./CategoryTree";
import { ShoppingBag, Heart, Filter, X, Search, Package } from "lucide-react";

interface Props {
  categories: Category[];
  products: Product[];
}

type SortOption = "default" | "price-low" | "price-high" | "name";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api";

const SORT_OPTIONS: { label: string; value: SortOption }[] = [
  { label: "Default",            value: "default"    },
  { label: "Price: Low to High", value: "price-low"  },
  { label: "Price: High to Low", value: "price-high" },
  { label: "Name: A to Z",       value: "name"       },
];

export default function ProductsClient({ categories, products: initialProducts }: Props) {
  const [products, setProducts]                 = useState<Product[]>(initialProducts);
  const [loading, setLoading]                   = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [sortBy, setSortBy]                     = useState<SortOption>("default");
  const [search, setSearch]                     = useState("");
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [wishlist, setWishlist]                 = useState<number[]>([]);
  const [toast, setToast]                       = useState<{ msg: string; type: "success" | "error" } | null>(null);

  const showToast = (msg: string, type: "success" | "error" = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedCategory)     params.set("category_id", String(selectedCategory));
      if (search)               params.set("search", search);
      if (sortBy !== "default") params.set("sort", sortBy);

      const res = await fetch(`${API_URL}/products?${params}`);
      if (!res.ok) throw new Error();
      const data = await res.json();
      setProducts(data.data ?? []);
    } catch {
      let filtered = initialProducts;
      if (selectedCategory) filtered = filtered.filter((p) => p.category_id === selectedCategory);
      if (search) filtered = filtered.filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase())
      );
      setProducts(filtered);
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, sortBy, search, initialProducts]);

  useEffect(() => {
    const t = setTimeout(() => fetchProducts(), 300);
    return () => clearTimeout(t);
  }, [fetchProducts]);

  const toggleWishlist = (id: number, name: string) => {
    setWishlist((prev) => {
      if (prev.includes(id)) {
        showToast(`${name} removed from wishlist`);
        return prev.filter((i) => i !== id);
      }
      showToast(`${name} added to wishlist! 💖`);
      return [...prev, id];
    });
  };

  const getDiscount = (price: number, salePrice?: number | null) => {
    if (!salePrice || salePrice >= price) return 0;
    return Math.round(((price - salePrice) / price) * 100);
  };

  // ─── Product Card ─────────────────────────────────────────────────────────

  const ProductCard = ({ product }: { product: Product }) => {
    const discount     = getDiscount(product.price, product.sale_price);
    const inWishlist   = wishlist.includes(product.id);
    const displayPrice = product.sale_price ?? product.price;

    return (
      <Link href={`/crochet/products/${product.id}`}>
        <div className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer">

          {/* Image */}
          <div className="relative h-56 bg-gradient-to-br from-purple-50 to-pink-50 overflow-hidden">
            {product.image ? (
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Package className="h-16 w-16 text-purple-200" />
              </div>
            )}

            {/* Badges */}
            <div className="absolute top-3 left-3 flex flex-col gap-1.5">
              {discount > 0 && (
                <span className="px-2 py-1 bg-red-500 text-white text-xs font-bold rounded-full">
                  -{discount}%
                </span>
              )}
              {!product.in_stock && (
                <span className="px-2 py-1 bg-gray-800 text-white text-xs font-medium rounded-full">
                  Out of Stock
                </span>
              )}
            </div>

            {/* Wishlist */}
            <button
              aria-label={`${inWishlist ? "Remove" : "Add"} ${product.name} ${inWishlist ? "from" : "to"} wishlist`}
              onClick={(e) => { e.preventDefault(); toggleWishlist(product.id, product.name); }}
              className="absolute top-3 right-3 rounded-full bg-white/90 backdrop-blur-sm p-2 shadow-md transition hover:scale-110"
            >
              <Heart className={`h-4 w-4 ${inWishlist ? "fill-pink-500 text-pink-500" : "text-gray-400"}`} />
            </button>
          </div>

          {/* Content */}
          <div className="p-5 space-y-3">
            <div>
              <p className="font-semibold text-gray-900 line-clamp-1">{product.name}</p>
              {product.description && (
                <p className="text-sm text-gray-500 line-clamp-2 mt-0.5">{product.description}</p>
              )}
            </div>

            {product.category && (
              <span className="inline-block text-xs text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full font-medium">
                {product.category.name}
              </span>
            )}

            {/* Price + CTA */}
            <div className="flex items-center justify-between pt-2 border-t border-gray-100">
              <div className="flex items-baseline gap-2">
                <span className="text-lg font-bold text-purple-600">
                  ₹{displayPrice.toLocaleString("en-IN")}
                </span>
                {discount > 0 && (
                  <span className="text-sm text-gray-400 line-through">
                    ₹{product.price.toLocaleString("en-IN")}
                  </span>
                )}
              </div>
              <button
                disabled={!product.in_stock}
                aria-label={`Add ${product.name} to cart`}
                onClick={(e) => { e.preventDefault(); showToast(`${product.name} added to cart! 🛒`); }}
                className="flex items-center gap-1.5 px-3 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white text-sm font-semibold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
              >
                <ShoppingBag className="h-4 w-4" />
                {product.in_stock ? "Add" : "N/A"}
              </button>
            </div>
          </div>
        </div>
      </Link>
    );
  };

  // ─── Sidebar ──────────────────────────────────────────────────────────────

  const Sidebar = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-gray-900 text-lg">Categories</h3>
        {selectedCategory && (
          <button
            onClick={() => setSelectedCategory(null)}
            className="text-xs text-purple-600 hover:text-purple-700 font-medium"
          >
            Clear
          </button>
        )}
      </div>
      <CategoryTree
        categories={categories}
        onSelect={setSelectedCategory}
        selectedCategory={selectedCategory}
      />
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50">

      {/* Toast */}
      {toast && (
        <div className={`fixed bottom-6 right-6 z-50 px-5 py-3 rounded-xl shadow-xl text-white text-sm font-medium transition-all ${
          toast.type === "success" ? "bg-green-500" : "bg-red-500"
        }`}>
          {toast.msg}
        </div>
      )}

      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Shop Our Collection</h1>
          <p className="text-lg text-gray-600">Discover handcrafted crochet treasures made with love</p>
        </div>

        {/* Search + Sort bar */}
        <div className="mb-6 flex items-center gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-sm"
            />
          </div>
          <button
            onClick={() => setMobileFilterOpen(true)}
            aria-label="Open filters"
            className="lg:hidden flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl shadow-sm text-gray-700 font-medium"
          >
            <Filter className="h-5 w-5" />
            Filter
          </button>
          <select
            aria-label="Sort products"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="hidden sm:block px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-sm text-gray-700 text-sm"
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">

          {/* Desktop Sidebar */}
          <aside className="hidden lg:block">
            <div className="sticky top-24 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <Sidebar />
            </div>
          </aside>

          {/* Mobile Sidebar */}
          {mobileFilterOpen && (
            <div className="fixed inset-0 z-50 lg:hidden">
              <div className="absolute inset-0 bg-black/50" onClick={() => setMobileFilterOpen(false)} />
              <div className="absolute inset-y-0 left-0 w-80 bg-white shadow-2xl overflow-y-auto">
                <div className="sticky top-0 bg-white border-b border-gray-100 p-4 flex items-center justify-between">
                  <h3 className="font-bold text-gray-900">Filters</h3>
                  <button
                    onClick={() => setMobileFilterOpen(false)}
                    aria-label="Close filters"
                    className="p-2 hover:bg-gray-100 rounded-lg"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
                <div className="p-4">
                  <Sidebar />
                </div>
              </div>
            </div>
          )}

          {/* Product Grid */}
          <section className="lg:col-span-3">
            <div className="mb-5 flex items-center justify-between">
              <p className="text-sm text-gray-600">
                {loading ? "Loading..." : `Showing ${products.length} ${products.length === 1 ? "product" : "products"}`}
              </p>
              <select
                aria-label="Sort products"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="sm:hidden px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                {SORT_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-24">
                <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-24 bg-white rounded-2xl border border-gray-100 shadow-sm">
                <Package className="h-16 w-16 text-gray-200 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-700 mb-2">No products found</h3>
                <p className="text-gray-500 mb-6">Try adjusting your search or filters</p>
                {(selectedCategory || search) && (
                  <button
                    onClick={() => { setSelectedCategory(null); setSearch(""); }}
                    className="px-5 py-2.5 border border-gray-200 text-gray-700 hover:bg-gray-50 rounded-xl font-medium transition-colors"
                  >
                    Clear Filters
                  </button>
                )}
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}