"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Upload, X, Plus, Package, Tag, RefreshCw, Settings2 } from "lucide-react";
import { API_URL } from "@/lib/api/config";
import { useDialog } from "@/components/elements";
import apiClient from "@/lib/api/client";
import ProductOptionsManager, { OptionForm } from "../ProductOptionsManager";
import Loading from "@/components/elements/loading";

type Category = { id: number; name: string };

type ProductForm = {
  name: string;
  description: string;
  price: string;
  compare_at_price: string;
  sku: string;
  stock: string;
  category_id: string;
  status: string;
  tags: string[];
};

function buildOptionsPayload(options: OptionForm[]) {
  return options.map((o) => ({
    name:           o.name,
    type:           o.type,
    is_required:    o.is_required,
    min_value:      o.min_value      ? parseInt(o.min_value)        : null,
    max_value:      o.max_value      ? parseInt(o.max_value)        : null,
    price_per_unit: o.price_per_unit ? parseFloat(o.price_per_unit) : null,
    values: o.values
      .filter((v) => v.label.trim())
      .map((v) => ({
        label:          v.label,
        value:          v.value || v.label.toLowerCase().replace(/\s+/g, "_"),
        price_modifier: parseFloat(v.price_modifier) || 0,
      })),
  }));
}

export default function NewProductPage() {
  const router = useRouter();
  const dialog = useDialog();

  const [form, setForm] = useState<ProductForm>({
    name: "", description: "", price: "", compare_at_price: "",
    sku: "", stock: "", category_id: "", status: "active", tags: [],
  });
  const [options, setOptions]       = useState<OptionForm[]>([]);
  const [images, setImages]         = useState<{ file: File; preview: string }[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [saving, setSaving]         = useState(false);
  const [newTag, setNewTag]         = useState("");

  useEffect(() => { fetchCategories(); }, []);

  const fetchCategories = async () => {
    try {
      const data = await apiClient.get<any>(`/admin/categories`);
      setCategories(data.data ?? data.categories ?? data ?? []);
    } catch { /* non-critical */ }
  };

  const handleSave = async () => {
    // ── Validation ────────────────────────────────────────────────
    if (!form.name || !form.price || !form.stock || !form.category_id) {
      await dialog.warn(
        "Please fill in all required fields: Name, Price, Stock, and Category.",
        "Missing Fields"
      );
      return;
    }

    // ── Confirm ───────────────────────────────────────────────────
    const confirmed = await dialog.show({
      title:        "Create Product",
      message:      <>Create <strong>"{form.name}"</strong> as a new product? It will be {form.status === "active" ? "visible to customers immediately" : "saved as a draft"}.</>,
      variant:      "info",
      confirmLabel: "Yes, Create",
      cancelLabel:  "Review Again",
    });
    if (!confirmed) return;

    setSaving(true);
    try {
      const res = await fetch(`${API_URL}/admin/products`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          name:             form.name,
          description:      form.description || null,
          price:            parseFloat(form.price),
          compare_at_price: form.compare_at_price ? parseFloat(form.compare_at_price) : null,
          sku:              form.sku || null,
          stock:            parseInt(form.stock),
          category_id:      parseInt(form.category_id),
          status:           form.status,
          options:          buildOptionsPayload(options),
        }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Failed to create product");
      }
      const data  = await res.json();
      const newId = data.product?.id ?? data.id;

      if (images.length > 0 && newId) {
        await Promise.all(images.map(async ({ file }) => {
          const fd = new FormData();
          fd.append("image", file);
          await fetch(`${API_URL}/admin/products/${newId}/images`, {
            method: "POST", credentials: "include", body: fd,
          });
        }));
      }

      await dialog.success(
        <><strong>"{form.name}"</strong> has been created successfully!</>,
        "Product Created"
      );
      router.push("/admin/products");
    } catch (err: any) {
      await dialog.warn(err.message || "Failed to create product. Please try again.", "Error");
    } finally {
      setSaving(false);
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImages((prev) => [...prev, { file, preview: URL.createObjectURL(file) }]);
    e.target.value = "";
  };

  const removeImage = (i: number) => {
    setImages((prev) => { URL.revokeObjectURL(prev[i].preview); return prev.filter((_, j) => j !== i); });
  };

  const addTag = () => {
    const tag = newTag.trim();
    if (tag && !form.tags.includes(tag)) { setForm({ ...form, tags: [...form.tags, tag] }); setNewTag(""); }
  };

  const price        = parseFloat(form.price) || 0;
  const comparePrice = parseFloat(form.compare_at_price) || 0;
  const stock        = parseInt(form.stock) || 0;
  const discount     = comparePrice > price ? Math.round(((comparePrice - price) / comparePrice) * 100) : 0;

  if (saving) return <Loading />;

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={() => router.back()} aria-label="Go back" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </button>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Add Product</h2>
            <p className="text-sm text-gray-600 mt-1">Create a new product listing</p>
          </div>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-lg shadow-md transition-all disabled:opacity-70"
        >
          <Save className="h-4 w-4" />
          Create Product
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* ── Left ───────────────────────────────────────────────── */}
        <div className="lg:col-span-2 space-y-6">

          {/* Basic Info */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <h4 className="font-semibold text-gray-900 mb-4">Basic Information</h4>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text" value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Crochet Tote Bag"
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  rows={4} value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Describe your product..."
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                />
              </div>
            </div>
          </div>

          {/* Pricing */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <h4 className="font-semibold text-gray-900 mb-4">Pricing</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Price <span className="text-red-500">*</span></label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">₹</span>
                  <input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} placeholder="0.00"
                    className="w-full pl-8 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Compare at Price</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">₹</span>
                  <input type="number" value={form.compare_at_price} onChange={(e) => setForm({ ...form, compare_at_price: e.target.value })} placeholder="0.00"
                    className="w-full pl-8 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" />
                </div>
              </div>
            </div>
            {discount > 0 && (
              <div className="mt-3 p-3 bg-green-50 rounded-lg border border-green-200">
                <p className="text-sm text-green-700 font-medium">Savings: ₹{comparePrice - price} ({discount}% off)</p>
              </div>
            )}
          </div>

          {/* Inventory */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Package className="h-5 w-5 text-purple-600" />Inventory
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">SKU</label>
                <input type="text" value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} placeholder="e.g. CTB-001"
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Stock <span className="text-red-500">*</span></label>
                <input type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} placeholder="0"
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" />
              </div>
            </div>
            {stock === 0 && form.stock !== "" && <p className="mt-2 text-xs text-red-600">⚠️ Product will be listed as out of stock</p>}
            {stock > 0 && stock < 10 && <p className="mt-2 text-xs text-orange-600">⚠️ Low stock warning</p>}
          </div>

          {/* Options */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-1">
              <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                <Settings2 className="h-5 w-5 text-purple-600" />Product Options
              </h4>
              <span className="text-xs text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full">
                {options.length} option{options.length !== 1 ? "s" : ""}
              </span>
            </div>
            <p className="text-xs text-gray-500 mb-4">Add customizations like size, colour — each can adjust the price.</p>
            <ProductOptionsManager options={options} onChange={setOptions} />
          </div>

          {/* Images */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <h4 className="font-semibold text-gray-900 mb-1">Product Images</h4>
            <p className="text-xs text-gray-500 mb-4">Images will be uploaded after the product is created.</p>
            <div className="grid grid-cols-4 gap-4">
              {images.map((img, i) => (
                <div key={i} className="relative aspect-square rounded-lg overflow-hidden bg-gray-100 group">
                  <img src={img.preview} alt="" className="w-full h-full object-cover" />
                  <button onClick={() => removeImage(i)} aria-label={`Remove image ${i + 1}`}
                    className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                    <X className="h-3 w-3" />
                  </button>
                  {i === 0 && <span className="absolute bottom-1 left-1 text-[10px] bg-purple-600 text-white px-1.5 py-0.5 rounded font-medium">Primary</span>}
                </div>
              ))}
              <label className="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center hover:border-purple-500 hover:bg-purple-50 transition-all cursor-pointer">
                <Upload className="h-6 w-6 text-gray-400 mb-1" />
                <span className="text-xs text-gray-500">Upload</span>
                <input type="file" accept="image/*" className="hidden" onChange={handleImageSelect} />
              </label>
            </div>
          </div>
        </div>

        {/* ── Right Sidebar ─────────────────────────────────────── */}
        <div className="space-y-6">

          {/* Status */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <h4 className="font-semibold text-gray-900 mb-4">Status</h4>
            <select aria-label="Product status" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500">
              <option value="active">Active</option>
              <option value="draft">Draft</option>
            </select>
            <p className="text-xs text-gray-500 mt-2">
              {form.status === "active" ? "Visible to customers immediately." : "Saved but not visible to customers."}
            </p>
          </div>

          {/* Organization */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Tag className="h-5 w-5 text-purple-600" />Organization
            </h4>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category <span className="text-red-500">*</span></label>
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

          {/* Preview */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <h4 className="font-semibold text-gray-900 mb-4">Preview</h4>
            <div className="space-y-3">
              <div className="aspect-square bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg overflow-hidden flex items-center justify-center">
                {images[0] ? <img src={images[0].preview} alt="" className="w-full h-full object-cover" /> : <Package className="h-12 w-12 text-purple-300" />}
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
              <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium ${form.status === "active" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                {form.status}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}