"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  Plus, Search, Edit, Trash2, Eye, Tag, Package, TrendingUp, RefreshCw,
} from "lucide-react";
import { useToast } from "@/components/elements/useToast";
import { API_URL } from "@/lib/api/config";

type Category = {
  id: number;
  name: string;
  slug: string;
  description: string;
  status: "active" | "inactive";
  products_count: number;
  parent: { id: number; name: string } | null;
};

const ICONS: Record<string, string> = {
  blankets: "🧶", toys: "🧸", bags: "👜", "home-decor": "🏠",
  "baby-items": "👶", "pet-accessories": "🐾",
};
const COLORS = [
  "from-purple-500 to-purple-600", "from-pink-500 to-pink-600",
  "from-blue-500 to-blue-600", "from-green-500 to-green-600",
  "from-yellow-500 to-yellow-600", "from-orange-500 to-orange-600",
  "from-teal-500 to-teal-600", "from-indigo-500 to-indigo-600",
];

export default function CategoriesPage() {
  const { showToast } = useToast();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [addForm, setAddForm] = useState({ name: "", description: "" });
  const [addLoading, setAddLoading] = useState(false);

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.set("search", searchQuery);

      const res = await fetch(`${API_URL}/admin/categories?${params}`, {
        credentials: "include",
        headers: { Accept: "application/json" },
      });
      if (!res.ok) throw new Error("Failed to fetch categories");
      const data = await res.json();
      setCategories(data.data ?? data.categories ?? []);
    } catch (err: any) {
      showToast(err.message || "Failed to load categories", "error");
    } finally {
      setLoading(false);
    }
  }, [searchQuery]);

  useEffect(() => {
    const t = setTimeout(() => fetchCategories(), 300);
    return () => clearTimeout(t);
  }, [fetchCategories]);

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    try {
      const res = await fetch(`${API_URL}/admin/categories/${id}`, {
        method: "DELETE",
        credentials: "include",
        headers: { Accept: "application/json" },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Delete failed");
      showToast(`"${name}" deleted successfully`, "success");
      fetchCategories();
    } catch (err: any) {
      showToast(err.message || "Failed to delete category", "error");
    }
  };

  const handleToggleStatus = async (id: number, name: string, current: string) => {
    const newStatus = current === "active" ? false : true;
    try {
      const res = await fetch(`${API_URL}/admin/categories/${id}`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error("Failed to update status");
      showToast(`"${name}" is now ${newStatus ? "active" : "inactive"}`, "success");
      fetchCategories();
    } catch {
      showToast("Failed to update category status", "error");
    }
  };

  const handleAdd = async () => {
    if (!addForm.name.trim()) {
      showToast("Category name is required", "error");
      return;
    }
    setAddLoading(true);
    try {
      const res = await fetch(`${API_URL}/admin/categories`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ name: addForm.name, description: addForm.description }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to create category");
      showToast("Category created successfully!", "success");
      setShowAddModal(false);
      setAddForm({ name: "", description: "" });
      fetchCategories();
    } catch (err: any) {
      showToast(err.message || "Failed to create category", "error");
    } finally {
      setAddLoading(false);
    }
  };

  const totalProducts = categories.reduce((sum, c) => sum + c.products_count, 0);
  const activeCategories = categories.filter((c) => c.status === "active").length;

  const getIcon = (slug: string) => ICONS[slug] ?? "🏷️";
  const getColor = (index: number) => COLORS[index % COLORS.length];

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Categories</h2>
          <p className="text-sm text-gray-600 mt-1">Organize your products into categories</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={fetchCategories}
            className="p-2.5 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            title="Refresh"
          >
            <RefreshCw className={`h-5 w-5 ${loading ? "animate-spin" : ""}`} />
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-lg shadow-md transition-all"
          >
            <Plus className="h-5 w-5" />
            Add Category
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: "Total Categories", value: categories.length, color: "text-gray-900", icon: <Tag className="h-6 w-6 text-white" />, bg: "from-purple-500 to-pink-500" },
          { label: "Active Categories", value: activeCategories, color: "text-green-600", icon: <TrendingUp className="h-6 w-6 text-white" />, bg: "from-green-500 to-emerald-500" },
          { label: "Total Products", value: totalProducts, color: "text-blue-600", icon: <Package className="h-6 w-6 text-white" />, bg: "from-blue-500 to-indigo-500" },
        ].map(({ label, value, color, icon, bg }) => (
          <div key={label} className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{label}</p>
                <p className={`text-2xl font-bold mt-1 ${color}`}>{value}</p>
              </div>
              <div className={`h-12 w-12 rounded-lg bg-gradient-to-br ${bg} flex items-center justify-center`}>
                {icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search categories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category, index) => (
            <div key={category.id} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-lg transition-all">
              {/* Card Header */}
              <div className={`h-32 bg-gradient-to-br ${getColor(index)} flex items-center justify-center text-6xl relative`}>
                {getIcon(category.slug)}
                <div className="absolute top-3 right-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    category.status === "active"
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-700"
                  }`}>
                    {category.status}
                  </span>
                </div>
              </div>

              {/* Card Content */}
              <div className="p-6">
                <h4 className="font-bold text-gray-900 mb-1">{category.name}</h4>
                <p className="text-sm text-gray-500 mb-4 line-clamp-2 min-h-[40px]">
                  {category.description || "No description provided."}
                </p>

                <div className="flex items-center gap-4 mb-4 pb-4 border-b border-gray-100">
                  <div className="flex items-center gap-1.5">
                    <Package className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600">{category.products_count} products</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Tag className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-500 truncate max-w-[100px]">{category.slug}</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleToggleStatus(category.id, category.name, category.status)}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 border border-gray-200 text-gray-700 hover:bg-gray-50 text-sm font-medium rounded-lg transition-colors"
                  >
                    <Eye className="h-4 w-4" />
                    {category.status === "active" ? "Deactivate" : "Activate"}
                  </button>
                  <Link href={`/admin/categories/${category.id}/edit`}>
                    <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                      <Edit className="h-4 w-4" />
                    </button>
                  </Link>
                  <button
                    onClick={() => handleDelete(category.id, category.name)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}

          {categories.length === 0 && (
            <div className="col-span-3 text-center py-16">
              <Tag className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-900 font-semibold">No categories found</p>
              <p className="text-sm text-gray-500 mt-1">Try adjusting your search or add a new category</p>
            </div>
          )}
        </div>
      )}

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-md p-6 shadow-xl">
            <h4 className="text-lg font-bold text-gray-900 mb-5">Add New Category</h4>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={addForm.name}
                  onChange={(e) => setAddForm({ ...addForm, name: e.target.value })}
                  placeholder="e.g. Blankets"
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  rows={3}
                  value={addForm.description}
                  onChange={(e) => setAddForm({ ...addForm, description: e.target.value })}
                  placeholder="Category description..."
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => { setShowAddModal(false); setAddForm({ name: "", description: "" }); }}
                  className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-700 hover:bg-gray-50 font-medium rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAdd}
                  disabled={addLoading}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-lg transition-all disabled:opacity-70"
                >
                  {addLoading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                  {addLoading ? "Creating..." : "Add Category"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}