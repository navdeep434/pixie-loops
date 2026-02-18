"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  Plus, Search, Filter, Edit, Trash2, Eye, Copy, Package, RefreshCw,
} from "lucide-react";
import { useToast } from "@/components/elements/useToast";
import { API_URL } from "@/lib/api/config";

type Product = {
  id: number;
  name: string;
  category: { id: number; name: string } | string;
  price: number;
  compare_at_price?: number;
  stock: number;
  status: "active" | "draft" | "archived";
  images: { url: string }[] | string[];
  sales_count?: number;
  sku?: string;
};

export default function ProductsPage() {
  const { showToast } = useToast();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [categories, setCategories] = useState<string[]>([]);
  const [stats, setStats] = useState({
    total: 0, active: 0, lowStock: 0, outOfStock: 0,
  });

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.set("search", searchQuery);
      if (selectedCategory !== "all") params.set("category", selectedCategory);
      if (selectedStatus !== "all") params.set("status", selectedStatus);

      const response = await fetch(`${API_URL}/admin/products?${params}`, {
        credentials: "include",
        headers: { Accept: "application/json" },
      });

      if (!response.ok) throw new Error("Failed to fetch products");

      const data = await response.json();

      const list: Product[] = data.data ?? data.products ?? data ?? [];
      setProducts(list);

      // Derive stats
      setStats({
        total: list.length,
        active: list.filter((p) => p.status === "active").length,
        lowStock: list.filter((p) => p.stock > 0 && p.stock < 10).length,
        outOfStock: list.filter((p) => p.stock === 0).length,
      });

      // Derive unique categories
      const cats = Array.from(
        new Set(
          list.map((p) =>
            typeof p.category === "object" ? p.category.name : p.category
          )
        )
      );
      setCategories(cats);
    } catch (err: any) {
      showToast(err.message || "Failed to load products", "error");
    } finally {
      setLoading(false);
    }
  }, [searchQuery, selectedCategory, selectedStatus]);

  useEffect(() => {
    const debounce = setTimeout(() => fetchProducts(), 400);
    return () => clearTimeout(debounce);
  }, [fetchProducts]);

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`Delete "${name}"?`)) return;
    try {
      const res = await fetch(`${API_URL}/admin/products/${id}`, {
        method: "DELETE",
        credentials: "include",
        headers: { Accept: "application/json" },
      });
      if (!res.ok) throw new Error("Delete failed");
      showToast(`"${name}" deleted successfully`, "success");
      fetchProducts();
    } catch {
      showToast("Failed to delete product", "error");
    }
  };

  const handleDuplicate = async (id: number, name: string) => {
    try {
      const res = await fetch(`${API_URL}/admin/products/${id}/duplicate`, {
        method: "POST",
        credentials: "include",
        headers: { Accept: "application/json" },
      });
      if (!res.ok) throw new Error("Duplicate failed");
      showToast(`"${name}" duplicated successfully`, "success");
      fetchProducts();
    } catch {
      showToast("Failed to duplicate product", "error");
    }
  };

  const getCategoryName = (cat: Product["category"]) =>
    typeof cat === "object" ? cat.name : cat;

  const getProductImage = (images: Product["images"]) => {
    if (!images?.length) return null;
    const first = images[0];
    return typeof first === "object" ? first.url : first;
  };

  const getStatusColor = (status: Product["status"]) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-700";
      case "draft": return "bg-yellow-100 text-yellow-700";
      case "archived": return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Products</h2>
          <p className="text-sm text-gray-600 mt-1">Manage your crochet product inventory</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={fetchProducts}
            className="p-2.5 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            title="Refresh"
          >
            <RefreshCw className={`h-5 w-5 ${loading ? "animate-spin" : ""}`} />
          </button>
          <Link href="/admin/products/new">
            <button className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-lg shadow-md transition-all">
              <Plus className="h-5 w-5" />
              Add Product
            </button>
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Products", value: stats.total, color: "text-gray-900" },
          { label: "Active", value: stats.active, color: "text-green-600" },
          { label: "Low Stock", value: stats.lowStock, color: "text-orange-600" },
          { label: "Out of Stock", value: stats.outOfStock, color: "text-red-600" },
        ].map(({ label, value, color }) => (
          <div key={label} className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
            <p className="text-sm text-gray-600">{label}</p>
            <p className={`text-2xl font-bold mt-1 ${color}`}>{value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="all">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="draft">Draft</option>
            <option value="archived">Archived</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  {["Product", "Category", "Price", "Stock", "Sales", "Status", "Actions"].map((h) => (
                    <th
                      key={h}
                      className={`px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider ${h === "Actions" ? "text-right" : "text-left"}`}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {products.map((product) => {
                  const img = getProductImage(product.images);
                  const catName = getCategoryName(product.category);
                  return (
                    <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center overflow-hidden flex-shrink-0">
                            {img ? (
                              <img src={img} alt={product.name} className="h-full w-full object-cover" />
                            ) : (
                              <Package className="h-6 w-6 text-purple-400" />
                            )}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900 text-sm">{product.name}</p>
                            <p className="text-xs text-gray-500">ID: #{product.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">{catName}</td>
                      <td className="px-6 py-4">
                        <p className="font-semibold text-gray-900 text-sm">₹{product.price}</p>
                        {product.compare_at_price && product.compare_at_price > product.price && (
                          <p className="text-xs text-gray-400 line-through">₹{product.compare_at_price}</p>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-sm font-semibold ${
                          product.stock === 0 ? "text-red-600" :
                          product.stock < 10 ? "text-orange-600" :
                          "text-gray-900"
                        }`}>
                          {product.stock} units
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {product.sales_count ?? 0} sold
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(product.status)}`}>
                          {product.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-1">
                          <Link href={`/admin/products/${product.id}`}>
                            <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                              <Eye className="h-4 w-4" />
                            </button>
                          </Link>
                          <Link href={`/admin/products/${product.id}/edit`}>
                            <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                              <Edit className="h-4 w-4" />
                            </button>
                          </Link>
                          <button
                            onClick={() => handleDuplicate(product.id, product.name)}
                            className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                          >
                            <Copy className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(product.id, product.name)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {products.length === 0 && !loading && (
              <div className="text-center py-16">
                <Package className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-900 font-semibold">No products found</p>
                <p className="text-sm text-gray-500 mt-1">Try adjusting your search or filters</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}