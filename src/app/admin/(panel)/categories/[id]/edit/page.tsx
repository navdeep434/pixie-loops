"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, Save, Trash2, RefreshCw } from "lucide-react";
import { useToast } from "@/components/elements/useToast";
import { API_URL } from "@/lib/api/config";

type CategoryForm = {
  name: string;
  description: string;
  status: string;
};

export default function EditCategoryPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;
  const { showToast } = useToast();

  const [form, setForm] = useState<CategoryForm>({ name: "", description: "", status: "active" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchCategory();
  }, [id]);

  const fetchCategory = async () => {
    try {
      const res = await fetch(`${API_URL}/admin/categories/${id}`, {
        credentials: "include",
        headers: { Accept: "application/json" },
      });
      if (!res.ok) throw new Error("Category not found");
      const data = await res.json();
      const c = data.category ?? data;
      setForm({
        name: c.name ?? "",
        description: c.description ?? "",
        status: c.status ?? "active",
      });
    } catch (err: any) {
      showToast(err.message || "Failed to load category", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!form.name.trim()) {
      showToast("Category name is required", "error");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch(`${API_URL}/admin/categories/${id}`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          name: form.name,
          description: form.description || null,
          status: form.status === "active",
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to update");
      showToast("Category updated successfully!", "success");
      setTimeout(() => router.push("/admin/categories"), 800);
    } catch (err: any) {
      showToast(err.message || "Failed to update category", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Delete this category? This cannot be undone.")) return;
    try {
      const res = await fetch(`${API_URL}/admin/categories/${id}`, {
        method: "DELETE",
        credentials: "include",
        headers: { Accept: "application/json" },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Delete failed");
      showToast("Category deleted", "success");
      router.push("/admin/categories");
    } catch (err: any) {
      showToast(err.message || "Failed to delete category", "error");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-2xl mx-auto">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={() => router.back()} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </button>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Edit Category</h2>
            <p className="text-sm text-gray-600 mt-1">Update category details</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleDelete}
            className="flex items-center gap-2 px-4 py-2.5 border border-red-300 text-red-600 hover:bg-red-50 font-semibold rounded-lg transition-all"
          >
            <Trash2 className="h-4 w-4" />
            Delete
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-lg shadow-md transition-all disabled:opacity-70"
          >
            {saving ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm space-y-5">
        <h4 className="font-semibold text-gray-900">Category Details</h4>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
          <textarea
            rows={4}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="Describe this category..."
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
          <select
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value })}
            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          <p className="text-xs text-gray-500 mt-1.5">
            {form.status === "active"
              ? "Category is visible and products can be assigned to it."
              : "Category is hidden from the storefront."}
          </p>
        </div>
      </div>

      {/* Preview */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <h4 className="font-semibold text-gray-900 mb-4">Preview</h4>
        <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg border border-gray-100">
          <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-2xl flex-shrink-0">
            🏷️
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-gray-900">{form.name || "Category Name"}</p>
            <p className="text-sm text-gray-500 truncate">{form.description || "No description"}</p>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-medium flex-shrink-0 ${
            form.status === "active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"
          }`}>
            {form.status}
          </span>
        </div>
      </div>
    </div>
  );
}