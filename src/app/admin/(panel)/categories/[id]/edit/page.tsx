"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, Save, Trash2 } from "lucide-react";
import { useDialog } from "@/components/elements";
import apiClient from "@/lib/api/client";
import { Button, Card, Heading, Text } from "@/components/elements";
import Loading from "@/components/elements/loading";


type CategoryForm = { name: string; description: string; status: string };

export default function EditCategoryPage() {
  const router = useRouter();
  const params = useParams();
  const id     = params?.id as string;
  const dialog = useDialog();

  const [form, setForm] = useState<CategoryForm>({ name: "", description: "", status: "active" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving]   = useState(false);

  useEffect(() => { fetchCategory(); }, [id]);

  const fetchCategory = async () => {
    try {
      const data = await apiClient.get<any>(`/admin/categories/${id}`);
      const c = data.category ?? data;
      setForm({
        name:        c.name        ?? "",
        description: c.description ?? "",
        status:      c.status      ?? "active",
      });
    } catch (err: any) {
      await dialog.warn(err.message || "Failed to load category.", "Load Error");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!form.name.trim()) {
      await dialog.warn("Category name is required.", "Missing Field");
      return;
    }
    const confirmed = await dialog.show({
      title:        "Save Changes",
      message:      <>Save changes to <strong>"{form.name}"</strong>?</>,
      variant:      "info",
      confirmLabel: "Save",
      cancelLabel:  "Keep Editing",
    });
    if (!confirmed) return;

    setSaving(true);
    try {
      await apiClient.put(`/admin/categories/${id}`, {
        name:        form.name,
        description: form.description || null,
        status:      form.status === "active",
      });
      await dialog.success(`"${form.name}" updated successfully.`, "Saved");
      router.push("/admin/categories");
    } catch (err: any) {
      setSaving(false);
      await dialog.warn(err.message || "Failed to update category.", "Error");
    }
  };

  const handleDelete = async () => {
    const confirmed = await dialog.danger(
      <>Permanently delete <strong>"{form.name}"</strong>? This cannot be undone.</>,
      "Delete Category"
    );
    if (!confirmed) return;

    setSaving(true);
    try {
      await apiClient.delete(`/admin/categories/${id}`);
      await dialog.success("Category deleted.", "Deleted");
      router.push("/admin/categories");
    } catch (err: any) {
      setSaving(false);
      await dialog.warn(err.message || "Failed to delete category.", "Error");
    }
  };

  if (loading || saving) return <Loading />;

  return (
    <div className="space-y-6 max-w-2xl mx-auto">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => router.back()} aria-label="Go back" className="p-2 hover:bg-gray-100">
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </Button>
          <div>
            <Heading level={2} className="text-gray-900">Edit Category</Heading>
            <Text variant="small" className="text-gray-600 mt-1">Update category details</Text>
          </div>
        </div>
        <div className="flex gap-3">
          <Button
            variant="ghost"
            onClick={handleDelete}
            className="gap-2 border border-red-200 text-red-600 hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4" /> Delete
          </Button>
          <Button variant="primary" onClick={handleSave} className="gap-2">
            <Save className="h-4 w-4" /> Save Changes
          </Button>
        </div>
      </div>

      {/* Form */}
      <Card variant="elevated" className="p-6 space-y-5">
        <Heading level={4} className="text-gray-900">Category Details</Heading>

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
            aria-label="Category status"
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value })}
            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          <Text variant="small" className="text-gray-500 mt-1.5">
            {form.status === "active"
              ? "Category is visible and products can be assigned to it."
              : "Category is hidden from the storefront."}
          </Text>
        </div>
      </Card>

      {/* Preview */}
      <Card variant="elevated" className="p-6">
        <Heading level={4} className="text-gray-900 mb-4">Preview</Heading>
        <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
          <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-2xl font-bold text-white/40 flex-shrink-0 select-none">
            {form.name.charAt(0).toUpperCase() || "?"}
          </div>
          <div className="flex-1 min-w-0">
            <Text className="font-semibold text-gray-900">{form.name || "Category Name"}</Text>
            <Text variant="small" className="text-gray-500 truncate">{form.description || "No description"}</Text>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-semibold flex-shrink-0 ${
            form.status === "active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"
          }`}>
            {form.status}
          </span>
        </div>
      </Card>
    </div>
  );
}