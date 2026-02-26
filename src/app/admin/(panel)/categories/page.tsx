"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  Plus, Search, Edit, Trash2, Eye, Tag, Package, TrendingUp, RefreshCw,
} from "lucide-react";
import { Loading, useDialog } from "@/components/elements";
import apiClient from "@/lib/api/client";
import { Button, Card, Heading, Text } from "@/components/elements";

type Category = {
  id: number;
  name: string;
  slug: string;
  description: string;
  status: "active" | "inactive";
  products_count: number;
  parent: { id: number; name: string } | null;
};

type AddForm = { name: string; description: string };

const COLORS = [
  "from-purple-500 to-purple-600", "from-pink-500 to-pink-600",
  "from-blue-500 to-blue-600",   "from-green-500 to-green-600",
  "from-yellow-500 to-yellow-600","from-orange-500 to-orange-600",
  "from-teal-500 to-teal-600",   "from-indigo-500 to-indigo-600",
];

const getColor = (i: number) => COLORS[i % COLORS.length];

export default function CategoriesPage() {
  const dialog = useDialog();

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading]       = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [addForm, setAddForm]       = useState<AddForm>({ name: "", description: "" });
  const [addLoading, setAddLoading] = useState(false);

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.set("search", searchQuery);
      const data = await apiClient.get<any>(`/admin/categories?${params}`);
      setCategories(data.data ?? data.categories ?? []);
    } catch (err: any) {
      await dialog.warn(err.message || "Failed to load categories.", "Error");
    } finally {
      setLoading(false);
    }
  }, [searchQuery]);

  useEffect(() => {
    const t = setTimeout(() => fetchCategories(), 300);
    return () => clearTimeout(t);
  }, [fetchCategories]);

  const handleDelete = async (id: number, name: string) => {
    const confirmed = await dialog.danger(
      <>Delete <strong>"{name}"</strong>? This cannot be undone.</>,
      "Delete Category"
    );
    if (!confirmed) return;
    try {
      await apiClient.delete(`/admin/categories/${id}`);
      await dialog.success(`"${name}" has been deleted.`, "Deleted");
      fetchCategories();
    } catch (err: any) {
      await dialog.warn(err.message || "Failed to delete category.", "Error");
    }
  };

  const handleToggleStatus = async (id: number, name: string, current: string) => {
    const isActive  = current === "active";
    const confirmed = await dialog.show({
      title:        isActive ? "Deactivate Category" : "Activate Category",
      message:      isActive
        ? <>Deactivate <strong>"{name}"</strong>? It will be hidden from the storefront.</>
        : <>Activate <strong>"{name}"</strong>? It will become visible on the storefront.</>,
      variant:      isActive ? "warning" : "info",
      confirmLabel: isActive ? "Deactivate" : "Activate",
    });
    if (!confirmed) return;
    try {
      await apiClient.put(`/admin/categories/${id}`, { status: !isActive });
      await dialog.success(`"${name}" is now ${!isActive ? "active" : "inactive"}.`, "Updated");
      fetchCategories();
    } catch {
      await dialog.warn("Failed to update category status.", "Error");
    }
  };

  const handleAdd = async () => {
    if (!addForm.name.trim()) {
      await dialog.warn("Category name is required.", "Missing Field");
      return;
    }
    const confirmed = await dialog.show({
      title:        "Create Category",
      message:      <>Create a new category called <strong>"{addForm.name}"</strong>?</>,
      variant:      "info",
      confirmLabel: "Create",
    });
    if (!confirmed) return;

    setAddLoading(true);
    try {
      await apiClient.post(`/admin/categories`, {
        name: addForm.name,
        description: addForm.description || null,
      });
      await dialog.success(`"${addForm.name}" has been created.`, "Created");
      setShowAddModal(false);
      setAddForm({ name: "", description: "" });
      fetchCategories();
    } catch (err: any) {
      await dialog.warn(err.message || "Failed to create category.", "Error");
    } finally {
      setAddLoading(false);
    }
  };

  const totalProducts    = categories.reduce((sum, c) => sum + c.products_count, 0);
  const activeCategories = categories.filter((c) => c.status === "active").length;

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Heading level={2} className="text-gray-900">Categories</Heading>
          <Text variant="small" className="text-gray-600 mt-1">Organize your products into categories</Text>
        </div>
        <div className="flex gap-3">
          <Button
            variant="ghost"
            onClick={fetchCategories}
            aria-label="Refresh categories"
            className="p-2.5 border border-gray-200"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          </Button>
          <Button
            variant="primary"
            onClick={() => setShowAddModal(true)}
            className="gap-2"
          >
            <Plus className="h-5 w-5" />
            Add Category
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: "Total Categories", value: categories.length, color: "text-gray-900",  Icon: Tag,       bg: "from-purple-500 to-pink-500"    },
          { label: "Active",           value: activeCategories,  color: "text-green-600", Icon: TrendingUp,bg: "from-green-500 to-emerald-500"  },
          { label: "Total Products",   value: totalProducts,     color: "text-blue-600",  Icon: Package,   bg: "from-blue-500 to-indigo-500"    },
        ].map(({ label, value, color, Icon, bg }) => (
          <Card key={label} variant="bordered" className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <Text variant="small" className="text-gray-600">{label}</Text>
                <Heading level={3} className={`${color} mt-1`}>{value}</Heading>
              </div>
              <div className={`h-12 w-12 rounded-lg bg-gradient-to-br ${bg} flex items-center justify-center`}>
                <Icon className="h-6 w-6 text-white" />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Search */}
      <Card variant="elevated" className="p-5">
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
      </Card>

      {/* Grid */}
      {loading ? (
        <Loading />
      ) : categories.length === 0 ? (
        <div className="text-center py-20">
          <Tag className="h-12 w-12 text-gray-200 mx-auto mb-4" />
          <Heading level={4} className="text-gray-900 mb-1">No categories found</Heading>
          <Text className="text-gray-500">Try adjusting your search or add a new category</Text>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category, index) => (
            <Card key={category.id} variant="elevated" className="overflow-hidden hover:shadow-lg transition-shadow">
              {/* Coloured top band with initial */}
              <div className={`h-28 bg-gradient-to-br ${getColor(index)} flex items-center justify-center relative`}>
                <span className="text-5xl font-bold text-white/30 select-none">
                  {category.name.charAt(0).toUpperCase()}
                </span>
                <div className="absolute top-3 right-3">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                    category.status === "active"
                      ? "bg-white/20 text-white backdrop-blur-sm"
                      : "bg-black/20 text-white/70 backdrop-blur-sm"
                  }`}>
                    {category.status}
                  </span>
                </div>
              </div>

              <div className="p-5">
                <Heading level={4} className="text-gray-900 mb-1">{category.name}</Heading>
                <Text variant="small" className="text-gray-500 line-clamp-2 min-h-[36px] mb-4">
                  {category.description || "No description provided."}
                </Text>

                <div className="flex items-center gap-4 mb-4 pb-4 border-b border-gray-100">
                  <div className="flex items-center gap-1.5">
                    <Package className="h-4 w-4 text-gray-400" />
                    <Text variant="small" className="text-gray-600">{category.products_count} products</Text>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Tag className="h-4 w-4 text-gray-400" />
                    <Text variant="small" className="text-gray-400 truncate max-w-[100px]">{category.slug}</Text>
                  </div>
                </div>

                <div className="flex items-center gap-2 min-w-0">
                  <Button
                    variant="ghost"
                    onClick={() => handleToggleStatus(category.id, category.name, category.status)}
                    className="flex-1 min-w-0 gap-1.5 border border-gray-200 text-gray-700 hover:bg-gray-50 text-sm truncate"
                  >
                    <Eye className="h-4 w-4 flex-shrink-0" />
                    <span className="truncate">
                      {category.status === "active" ? "Deactivate" : "Activate"}
                    </span>
                  </Button>
                  <div className="flex gap-1 flex-shrink-0">
                    <Link href={`/admin/categories/${category.id}/edit`}>
                      <Button variant="ghost" aria-label={`Edit ${category.name}`} className="p-2 text-blue-600 hover:bg-blue-50">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      onClick={() => handleDelete(category.id, category.name)}
                      aria-label={`Delete ${category.name}`}
                      className="p-2 text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowAddModal(false)} aria-hidden="true" />
          <div className="relative w-full sm:max-w-md bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl p-6">
            <Heading level={4} className="text-gray-900 mb-5">Add New Category</Heading>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={addForm.name}
                  onChange={(e) => setAddForm({ ...addForm, name: e.target.value })}
                  onKeyDown={(e) => e.key === "Enter" && handleAdd()}
                  placeholder="e.g. Blankets"
                  autoFocus
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
              <div className="flex gap-3 pt-1">
                <Button
                  variant="ghost"
                  onClick={() => { setShowAddModal(false); setAddForm({ name: "", description: "" }); }}
                  className="flex-1 justify-center border border-gray-200"
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  onClick={handleAdd}
                  disabled={addLoading}
                  className="flex-1 justify-center gap-2"
                >
                  {addLoading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                  {addLoading ? "Creating..." : "Add Category"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}