"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, Save, Trash2, Upload, X, Plus, Package, Tag, Settings2 } from "lucide-react";
import { API_URL } from "@/lib/api/config";
import { useDialog } from "@/components/elements";
import apiClient from "@/lib/api/client";
import ProductOptionsManager, { OptionForm, OptionValueForm } from "../../ProductOptionsManager";
import Loading from "@/components/elements/loading";

type Category = { id: number; name: string };
type ProductForm = {
  name: string; description: string; price: string; compare_at_price: string;
  sku: string; stock: string; category_id: string; status: string; tags: string[];
};

function buildOptionsPayload(options: OptionForm[]) {
  return options.map((o) => ({
    ...(o.id ? { id: o.id } : {}),
    name: o.name, type: o.type, is_required: o.is_required,
    min_value:      o.min_value      ? parseInt(o.min_value)        : null,
    max_value:      o.max_value      ? parseInt(o.max_value)        : null,
    price_per_unit: o.price_per_unit ? parseFloat(o.price_per_unit) : null,
    values: o.values.filter((v) => v.label.trim()).map((v) => ({
      ...(v.id ? { id: v.id } : {}),
      label: v.label,
      value: v.value || v.label.toLowerCase().replace(/\s+/g, "_"),
      price_modifier: parseFloat(v.price_modifier) || 0,
    })),
  }));
}

function apiOptionsToForm(apiOptions: any[]): OptionForm[] {
  return (apiOptions ?? []).map((o) => ({
    id: o.id, name: o.name ?? "", type: o.type ?? "radio", is_required: o.is_required ?? false,
    min_value: o.min_value != null ? String(o.min_value) : "",
    max_value: o.max_value != null ? String(o.max_value) : "",
    price_per_unit: o.price_per_unit != null ? String(o.price_per_unit) : "",
    values: (o.values ?? []).map((v: any): OptionValueForm => ({
      id: v.id, label: v.label ?? "", value: v.value ?? "",
      price_modifier: v.price_modifier != null ? String(v.price_modifier) : "0",
    })),
    open: false,
  }));
}

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const id     = params?.id as string;
  const dialog = useDialog();

  const [form, setForm] = useState<ProductForm>({
    name: "", description: "", price: "", compare_at_price: "",
    sku: "", stock: "", category_id: "", status: "active", tags: [],
  });
  const [options, setOptions]       = useState<OptionForm[]>([]);
  const [images, setImages]         = useState<{ id?: number; url: string }[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading]       = useState(true);
  const [saving, setSaving]         = useState(false);
  const [newTag, setNewTag]         = useState("");

  useEffect(() => { Promise.all([fetchProduct(), fetchCategories()]); }, [id]);

  const fetchProduct = async () => {
    try {
      const data = await apiClient.get<any>(`/admin/products/${id}`);
      const p = data.product ?? data.data ?? data;
      setForm({
        name: p.name ?? "", description: p.description ?? "",
        price: String(p.price ?? ""), compare_at_price: String(p.compare_at_price ?? ""),
        sku: p.sku ?? "", stock: String(p.stock ?? ""),
        category_id: String(p.category?.id ?? p.category_id ?? ""),
        status: p.status ?? "active", tags: p.tags ?? [],
      });
      setImages((p.images ?? []).map((img: any) =>
        typeof img === "string" ? { url: img } : { id: img.id, url: img.url }
      ));
      if (p.options) setOptions(apiOptionsToForm(p.options));
    } catch (err: any) {
      await dialog.warn(err.message || "Failed to load product.", "Load Error");
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const data = await apiClient.get<any>(`/admin/categories`);
      setCategories(data.data ?? data.categories ?? data ?? []);
    } catch { /* non-critical */ }
  };

  const handleSave = async () => {
    if (!form.name || !form.price || !form.stock) {
      await dialog.warn("Please fill in Name, Price, and Stock before saving.", "Missing Fields");
      return;
    }

    const confirmed = await dialog.show({
      title:        "Save Changes",
      message:      <>Save all changes to <strong>"{form.name}"</strong>? This will update the product immediately.</>,
      variant:      "info",
      confirmLabel: "Yes, Save",
      cancelLabel:  "Keep Editing",
    });
    if (!confirmed) return;

    setSaving(true);
    try {
      await apiClient.put(`/admin/products/${id}`, {
        name: form.name, description: form.description || null,
        price: parseFloat(form.price),
        compare_at_price: form.compare_at_price ? parseFloat(form.compare_at_price) : null,
        sku: form.sku || null, stock: parseInt(form.stock),
        category_id: form.category_id ? parseInt(form.category_id) : null,
        status: form.status, options: buildOptionsPayload(options),
      });
      await dialog.success(<><strong>"{form.name}"</strong> has been updated successfully!</>, "Saved");
      router.push("/admin/products");
    } catch (err: any) {
      setSaving(false);
      await dialog.warn(err.message || "Failed to update product. Please try again.", "Save Error");
    }
  };

  const handleDelete = async () => {
    const confirmed = await dialog.danger(
      <>Permanently delete <strong>"{form.name}"</strong>? This cannot be undone and will remove all images and options.</>,
      "Delete Product"
    );
    if (!confirmed) return;

    setSaving(true);
    try {
      await apiClient.delete(`/admin/products/${id}`);
      await dialog.success("Product has been deleted.", "Deleted");
      router.push("/admin/products");
    } catch {
      setSaving(false);
      await dialog.warn("Failed to delete product. Please try again.", "Error");
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const fd = new FormData();
    fd.append("image", file);
    try {
      const xsrf = document.cookie.split("; ").find((c) => c.startsWith("XSRF-TOKEN="))?.split("=")[1];
      const res = await fetch(`${API_URL}/admin/products/${id}/images`, {
        method: "POST", credentials: "include",
        headers: xsrf ? { "X-XSRF-TOKEN": decodeURIComponent(xsrf) } : {},
        body: fd,
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setImages((prev) => [...prev, { id: data.id, url: data.url }]);
    } catch {
      await dialog.warn("Failed to upload image. Please try again.", "Upload Error");
    }
  };

  const handleRemoveImage = async (i: number) => {
    const img = images[i];
    if (img.id) {
      const confirmed = await dialog.danger("Remove this image from the product?", "Remove Image");
      if (!confirmed) return;
      try {
        await apiClient.delete(`/admin/products/${id}/images/${img.id}`);
      } catch {
        await dialog.warn("Failed to remove image.", "Error");
        return;
      }
    }
    setImages((prev) => prev.filter((_, j) => j !== i));
  };

  const addTag = () => {
    const tag = newTag.trim();
    if (tag && !form.tags.includes(tag)) { setForm({ ...form, tags: [...form.tags, tag] }); setNewTag(""); }
  };

  const price        = parseFloat(form.price) || 0;
  const comparePrice = parseFloat(form.compare_at_price) || 0;
  const stock        = parseInt(form.stock) || 0;
  const discount     = comparePrice > price ? Math.round(((comparePrice - price) / comparePrice) * 100) : 0;

  if (loading || saving) return <Loading />;

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={() => router.back()} aria-label="Go back" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </button>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Edit Product</h2>
            <p className="text-sm text-gray-600 mt-1">Update product information</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button onClick={handleDelete}
            className="flex items-center gap-2 px-4 py-2.5 border border-red-300 text-red-600 hover:bg-red-50 font-semibold rounded-lg transition-all">
            <Trash2 className="h-4 w-4" /> Delete
          </button>
          <button onClick={handleSave}
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-lg shadow-md transition-all">
            <Save className="h-4 w-4" /> Save Changes
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* ── Left ─────────────────────────────────────────────── */}
        <div className="lg:col-span-2 space-y-6">

          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <h4 className="font-semibold text-gray-900 mb-4">Basic Information</h4>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Product Name *</label>
                <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea rows={4} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <h4 className="font-semibold text-gray-900 mb-4">Pricing</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Price *</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">₹</span>
                  <input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })}
                    className="w-full pl-8 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Compare at Price</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">₹</span>
                  <input type="number" value={form.compare_at_price} onChange={(e) => setForm({ ...form, compare_at_price: e.target.value })}
                    className="w-full pl-8 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" />
                </div>
              </div>
            </div>
            {discount > 0 && (
              <div className="mt-3 p-3 bg-green-50 rounded-lg border border-green-200">
                <p className="text-sm text-green-700 font-medium">Savings: ₹{(comparePrice - price).toLocaleString("en-IN")} ({discount}% off)</p>
              </div>
            )}
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Package className="h-5 w-5 text-purple-600" /> Inventory
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">SKU</label>
                <input type="text" value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Stock *</label>
                <input type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" />
              </div>
            </div>
            {stock === 0 && <p className="mt-2 text-xs text-red-600">⚠️ Product is out of stock</p>}
            {stock > 0 && stock < 10 && <p className="mt-2 text-xs text-orange-600">⚠️ Low stock warning</p>}
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-1">
              <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                <Settings2 className="h-5 w-5 text-purple-600" />Product Options
              </h4>
              <span className="text-xs text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full">
                {options.length} option{options.length !== 1 ? "s" : ""}
              </span>
            </div>
            <p className="text-xs text-gray-500 mb-4">Existing options are loaded and synced on save.</p>
            <ProductOptionsManager options={options} onChange={setOptions} />
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <h4 className="font-semibold text-gray-900 mb-4">Product Images</h4>
            <div className="grid grid-cols-4 gap-4">
              {images.map((img, i) => (
                <div key={i} className="relative aspect-square rounded-lg overflow-hidden bg-gray-100 group">
                  <img src={img.url} alt={`Product image ${i + 1}`} className="w-full h-full object-cover" />
                  <button onClick={() => handleRemoveImage(i)} aria-label={`Remove image ${i + 1}`}
                    className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
              <label className="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center hover:border-purple-500 hover:bg-purple-50 transition-all cursor-pointer">
                <Upload className="h-6 w-6 text-gray-400 mb-1" />
                <span className="text-xs text-gray-500">Upload</span>
                <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
              </label>
            </div>
          </div>
        </div>

        {/* ── Sidebar ───────────────────────────────────────────── */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <h4 className="font-semibold text-gray-900 mb-4">Status</h4>
            <select aria-label="Product status" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500">
              <option value="active">Active</option>
              <option value="draft">Draft</option>
              <option value="archived">Archived</option>
            </select>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Tag className="h-5 w-5 text-purple-600" /> Organization
            </h4>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select aria-label="Product category" value={form.category_id} onChange={(e) => setForm({ ...form, category_id: e.target.value })}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500">
                  <option value="">Select category</option>
                  {categories.map((cat) => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
                <div className="flex gap-2 mb-2">
                  <input type="text" value={newTag} onChange={(e) => setNewTag(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag())} placeholder="Add tag..."
                    className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm" />
                  <button onClick={addTag} aria-label="Add tag" className="p-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {form.tags.map((tag) => (
                    <span key={tag} className="inline-flex items-center gap-1 px-2.5 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                      {tag}
                      <button onClick={() => setForm({ ...form, tags: form.tags.filter((t) => t !== tag) })} aria-label={`Remove tag ${tag}`}>
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <h4 className="font-semibold text-gray-900 mb-4">Preview</h4>
            <div className="space-y-3">
              <div className="aspect-square bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg overflow-hidden flex items-center justify-center">
                {images[0] ? <img src={images[0].url} alt="Preview" className="w-full h-full object-cover" /> : <Package className="h-12 w-12 text-purple-300" />}
              </div>
              <p className="font-semibold text-gray-900 text-sm">{form.name || "Product Name"}</p>
              <div className="flex items-center gap-2">
                <span className="font-bold text-purple-600">₹{form.price || "0"}</span>
                {discount > 0 && <span className="text-xs text-gray-400 line-through">₹{form.compare_at_price}</span>}
              </div>
              {options.length > 0 && (
                <p className="text-xs text-purple-600 bg-purple-50 px-2.5 py-1 rounded-full font-medium inline-block">
                  {options.length} customization option{options.length !== 1 ? "s" : ""}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}