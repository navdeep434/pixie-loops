"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, Edit, Trash2, Package, Tag, Settings2, Copy } from "lucide-react";
import { useDialog } from "@/components/elements";
import apiClient from "@/lib/api/client";
import { Button } from "@/components/elements";
import Loading from "@/components/elements/loading";

type Category   = { id: number; name: string };
type OptionValue = { id?: number; label: string; value: string; price_modifier: number };
type Option = {
  id?: number; name: string; type: "radio" | "dropdown" | "number" | "checkbox";
  is_required: boolean; min_value?: number | null; max_value?: number | null;
  price_per_unit?: number | null; values: OptionValue[];
};
type Product = {
  id: number; name: string; description?: string; price: number;
  compare_at_price?: number | null; sku?: string; stock: number;
  category?: Category; status: "active" | "draft" | "archived";
  tags?: string[]; images: { id?: number; url: string }[];
  options?: Option[]; sales_count?: number; created_at?: string; updated_at?: string;
};

const STATUS_COLORS = {
  active:   "bg-green-100 text-green-700 border-green-200",
  draft:    "bg-yellow-100 text-yellow-700 border-yellow-200",
  archived: "bg-gray-100 text-gray-600 border-gray-200",
};

export default function ViewProductPage() {
  const router = useRouter();
  const params = useParams();
  const id     = params?.id as string;
  const dialog = useDialog();

  const [product, setProduct]   = useState<Product | null>(null);
  const [loading, setLoading]   = useState(true);
  const [acting, setActing]     = useState(false);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => { fetchProduct(); }, [id]);

  const fetchProduct = async () => {
    try {
      const data = await apiClient.get<{ product?: Product; data?: Product }>(`/admin/products/${id}`);
      const p = data.product ?? data.data ?? (data as any);
      setProduct({ ...p, images: (p.images ?? []).map((img: any) => typeof img === "string" ? { url: img } : img) });
    } catch (err: any) {
      await dialog.warn(err.message || "Failed to load product.", "Load Error");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    const confirmed = await dialog.danger(
      <>Permanently delete <strong>"{product?.name}"</strong>? All images and options will also be removed. This cannot be undone.</>,
      "Delete Product"
    );
    if (!confirmed) return;

    setActing(true);
    try {
      await apiClient.delete(`/admin/products/${id}`);
      await dialog.success("Product has been deleted.", "Deleted");
      router.push("/admin/products");
    } catch {
      setActing(false);
      await dialog.warn("Failed to delete product. Please try again.", "Error");
    }
  };

  const handleDuplicate = async () => {
    const confirmed = await dialog.show({
      title:        "Duplicate Product",
      message:      <>Create a copy of <strong>"{product?.name}"</strong>? The duplicate will be saved as a draft.</>,
      variant:      "info",
      confirmLabel: "Yes, Duplicate",
    });
    if (!confirmed) return;

    setActing(true);
    try {
      await apiClient.post(`/admin/products/${id}/duplicate`);
      await dialog.success(`"${product?.name}" has been duplicated as a draft.`, "Duplicated");
      router.push("/admin/products");
    } catch {
      setActing(false);
      await dialog.warn("Failed to duplicate product.", "Error");
    }
  };

  if (loading || acting) return <Loading />;

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center h-96 gap-4">
        <Package className="h-16 w-16 text-gray-200" />
        <p className="text-gray-500 font-medium">Product not found</p>
        <Button variant="outline" onClick={() => router.push("/admin/products")}>Back to Products</Button>
      </div>
    );
  }

  const price        = product.price;
  const comparePrice = product.compare_at_price ?? 0;
  const discount     = comparePrice > price ? Math.round(((comparePrice - price) / comparePrice) * 100) : 0;

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => router.back()} aria-label="Go back" className="p-2 hover:bg-gray-100">
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </Button>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{product.name}</h2>
            <p className="text-sm text-gray-500 mt-0.5">Product ID: #{product.id}</p>
          </div>
        </div>
        <div className="flex gap-3">
          <Button variant="ghost" onClick={handleDuplicate} aria-label="Duplicate product" className="flex items-center gap-2 border border-gray-200">
            <Copy className="h-4 w-4" /> Duplicate
          </Button>
          <Button variant="ghost" onClick={handleDelete} aria-label="Delete product" className="flex items-center gap-2 border border-red-200 text-red-600 hover:bg-red-50">
            <Trash2 className="h-4 w-4" /> Delete
          </Button>
          <Button variant="primary" onClick={() => router.push(`/admin/products/${id}/edit`)} className="flex items-center gap-2">
            <Edit className="h-4 w-4" /> Edit Product
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* ── Left ─────────────────────────────────────────────── */}
        <div className="lg:col-span-2 space-y-6">

          {/* Images */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <h4 className="font-semibold text-gray-900 mb-4">Product Images</h4>
            {product.images.length > 0 ? (
              <div className="space-y-3">
                <div className="aspect-video rounded-xl overflow-hidden bg-gradient-to-br from-purple-50 to-pink-50">
                  <img src={product.images[activeImage]?.url} alt={product.name} className="w-full h-full object-cover" />
                </div>
                {product.images.length > 1 && (
                  <div className="flex gap-3 overflow-x-auto pb-1">
                    {product.images.map((img, i) => (
                      <button key={i} onClick={() => setActiveImage(i)} aria-label={`View image ${i + 1}`}
                        className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${activeImage === i ? "border-purple-500 ring-2 ring-purple-200" : "border-gray-200"}`}>
                        <img src={img.url} alt="" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="aspect-video rounded-xl bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center">
                <Package className="h-20 w-20 text-purple-200" />
              </div>
            )}
          </div>

          {/* Basic Info */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <h4 className="font-semibold text-gray-900 mb-4">Basic Information</h4>
            <div className="space-y-4">
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Name</p>
                <p className="text-gray-900 font-medium">{product.name}</p>
              </div>
              {product.description && (
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Description</p>
                  <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">{product.description}</p>
                </div>
              )}
            </div>
          </div>

          {/* Pricing */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <h4 className="font-semibold text-gray-900 mb-4">Pricing</h4>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Price</p>
                <p className="text-2xl font-bold text-purple-600">₹{price.toLocaleString("en-IN")}</p>
              </div>
              {comparePrice > 0 && (
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Compare at Price</p>
                  <p className="text-2xl font-bold text-gray-400 line-through">₹{comparePrice.toLocaleString("en-IN")}</p>
                </div>
              )}
            </div>
            {discount > 0 && (
              <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
                <p className="text-sm text-green-700 font-medium">Customers save ₹{(comparePrice - price).toLocaleString("en-IN")} ({discount}% off)</p>
              </div>
            )}
          </div>

          {/* Inventory */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Package className="h-5 w-5 text-purple-600" />Inventory
            </h4>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">SKU</p>
                <p className="text-gray-900 font-mono text-sm">{product.sku || <span className="text-gray-400 font-sans">—</span>}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Stock</p>
                <p className={`text-2xl font-bold ${product.stock === 0 ? "text-red-600" : product.stock < 10 ? "text-orange-600" : "text-gray-900"}`}>
                  {product.stock} units
                </p>
                {product.stock === 0 && <p className="text-xs text-red-600 mt-1">Out of stock</p>}
                {product.stock > 0 && product.stock < 10 && <p className="text-xs text-orange-600 mt-1">Low stock</p>}
              </div>
              {product.sales_count !== undefined && (
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Total Sold</p>
                  <p className="text-2xl font-bold text-gray-900">{product.sales_count}</p>
                </div>
              )}
            </div>
          </div>

          {/* Options */}
          {product.options && product.options.length > 0 && (
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Settings2 className="h-5 w-5 text-purple-600" />Product Options
                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full ml-auto font-normal">
                  {product.options.length} option{product.options.length !== 1 ? "s" : ""}
                </span>
              </h4>
              <div className="space-y-4">
                {product.options.map((option, i) => (
                  <div key={i} className="border border-gray-100 rounded-xl p-4 bg-gray-50">
                    <div className="flex items-center gap-3 mb-3">
                      <p className="font-medium text-gray-900">{option.name}</p>
                      <span className="text-xs px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full">{option.type}</span>
                      {option.is_required && <span className="text-xs px-2 py-0.5 bg-red-100 text-red-600 rounded-full">Required</span>}
                    </div>
                    {option.type === "number" ? (
                      <div className="grid grid-cols-3 gap-3 text-sm">
                        <div><p className="text-xs text-gray-500 mb-0.5">Min</p><p className="font-medium text-gray-900">{option.min_value ?? "—"}</p></div>
                        <div><p className="text-xs text-gray-500 mb-0.5">Max</p><p className="font-medium text-gray-900">{option.max_value ?? "—"}</p></div>
                        <div><p className="text-xs text-gray-500 mb-0.5">Price/unit</p><p className="font-medium text-gray-900">{option.price_per_unit ? `₹${option.price_per_unit}` : "—"}</p></div>
                      </div>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {option.values.map((val, j) => (
                          <div key={j} className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm">
                            <span className="text-gray-900 font-medium">{val.label}</span>
                            {val.price_modifier !== 0 && (
                              <span className={`text-xs font-medium ${val.price_modifier > 0 ? "text-green-600" : "text-red-600"}`}>
                                {val.price_modifier > 0 ? "+" : ""}₹{val.price_modifier}
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ── Sidebar ───────────────────────────────────────────── */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <h4 className="font-semibold text-gray-900 mb-4">Status</h4>
            <span className={`inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-semibold border ${STATUS_COLORS[product.status]}`}>
              {product.status.charAt(0).toUpperCase() + product.status.slice(1)}
            </span>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Tag className="h-5 w-5 text-purple-600" />Organization
            </h4>
            <div className="space-y-4">
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Category</p>
                {product.category
                  ? <span className="inline-block px-3 py-1 bg-purple-50 text-purple-700 rounded-lg text-sm font-medium">{product.category.name}</span>
                  : <p className="text-gray-400 text-sm">Uncategorized</p>}
              </div>
              {product.tags && product.tags.length > 0 && (
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Tags</p>
                  <div className="flex flex-wrap gap-2">
                    {product.tags.map((tag) => (
                      <span key={tag} className="px-2.5 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">{tag}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {(product.created_at || product.updated_at) && (
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h4 className="font-semibold text-gray-900 mb-4">Details</h4>
              <div className="space-y-3">
                {product.created_at && (
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-0.5">Created</p>
                    <p className="text-sm text-gray-700">{new Date(product.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</p>
                  </div>
                )}
                {product.updated_at && (
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-0.5">Last Updated</p>
                    <p className="text-sm text-gray-700">{new Date(product.updated_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <h4 className="font-semibold text-gray-900 mb-4">Quick Actions</h4>
            <div className="space-y-2">
              <Button variant="primary" onClick={() => router.push(`/admin/products/${id}/edit`)} className="w-full justify-center gap-2">
                <Edit className="h-4 w-4" /> Edit Product
              </Button>
              <Button variant="ghost" onClick={handleDuplicate} className="w-full justify-center gap-2 border border-gray-200">
                <Copy className="h-4 w-4" /> Duplicate
              </Button>
              <Button variant="ghost" onClick={handleDelete} className="w-full justify-center gap-2 border border-red-200 text-red-600 hover:bg-red-50">
                <Trash2 className="h-4 w-4" /> Delete Product
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}