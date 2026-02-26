"use client";

import { useState, useEffect, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft, ShoppingBag, Heart, ChevronLeft, ChevronRight, Share2, Package,
} from "lucide-react";
import { Product } from "../types";
import ProductOptions from "./ProductOptions";
import { SelectedOptions, calcTotalPrice, validateOptions, buildCartPayload } from "./priceUtils";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api";

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id     = params?.id as string;

  const [product, setProduct]             = useState<Product | null>(null);
  const [loading, setLoading]             = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity]           = useState(1);
  const [selected, setSelected]           = useState<SelectedOptions>({});
  const [optionErrors, setOptionErrors]   = useState<string[]>([]);
  const [inWishlist, setInWishlist]       = useState(false);
  const [addedToCart, setAddedToCart]     = useState(false);
  const [toast, setToast]                 = useState<{ msg: string; type: "success" | "error" } | null>(null);

  useEffect(() => { fetchProduct(); }, [id]);

  const fetchProduct = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/products/${id}`);
      if (!res.ok) throw new Error();
      const data = await res.json();
      setProduct(data.product ?? data.data ?? data);
    } catch {
      showToast("Failed to load product", "error");
    } finally {
      setLoading(false);
    }
  };

  const showToast = (msg: string, type: "success" | "error" = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  // ─── Live price ───────────────────────────────────────────────────────────

  const totalPrice = useMemo(() => {
    if (!product) return 0;
    return calcTotalPrice(product.final_price, product.options ?? [], selected);
  }, [product, selected]);

  const hasOptions = (product?.options?.length ?? 0) > 0;

  // ─── Option change ────────────────────────────────────────────────────────

  const handleOptionChange = (optionId: number, value: SelectedOptions[number]) => {
    setSelected((prev) => ({ ...prev, [optionId]: value }));
    if (product) {
      const opt = product.options?.find((o) => o.id === optionId);
      if (opt) setOptionErrors((prev) => prev.filter((e) => e !== opt.name));
    }
  };

  // ─── Add to cart ──────────────────────────────────────────────────────────

  const handleAddToCart = () => {
    if (!product) return;
    const missing = validateOptions(product.options ?? [], selected);
    if (missing.length > 0) {
      setOptionErrors(missing);
      showToast(`Please select: ${missing.join(", ")}`, "error");
      return;
    }
    setOptionErrors([]);
    const payload = buildCartPayload(product.id, quantity, product.options ?? [], selected);
    console.log("Cart payload:", payload);
    // TODO: POST payload to /api/cart
    setAddedToCart(true);
    showToast(`${product.name} added to cart! 🛒`);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  // images array — url can be string or null
  const images: { id: number; url: string | null; is_primary: boolean }[] =
    (product?.images ?? []).map((img) => ({ ...img, url: img.url ?? null }));
  const displayImages = images.length > 0 ? images : [{ id: 0, url: null, is_primary: true }];

  // ─── Loading / not found ──────────────────────────────────────────────────

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Package className="h-16 w-16 text-gray-200 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-700">Product not found</h2>
          <button
            onClick={() => router.back()}
            className="mt-4 text-purple-600 hover:underline text-sm"
          >
            Go back
          </button>
        </div>
      </div>
    );
  }

  const discount = product.sale_price && product.price > product.sale_price
    ? Math.round(((product.price - product.sale_price) / product.price) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50">

      {/* Toast */}
      {toast && (
        <div className={`fixed bottom-6 right-6 z-50 px-5 py-3 rounded-xl shadow-xl text-white text-sm font-medium ${
          toast.type === "success" ? "bg-green-500" : "bg-red-500"
        }`}>
          {toast.msg}
        </div>
      )}

      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">

        {/* Back */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8 text-sm font-medium group"
        >
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          Back to Shop
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

          {/* ── Images ───────────────────────────────────────────────────── */}
          <div className="space-y-4">
            <div className="relative aspect-square bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              {displayImages[selectedImage]?.url ? (
                <img
                  src={displayImages[selectedImage].url!}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50">
                  <Package className="h-24 w-24 text-purple-200" />
                </div>
              )}

              {displayImages.length > 1 && (
                <>
                  <button
                    onClick={() => setSelectedImage((p) => Math.max(0, p - 1))}
                    disabled={selectedImage === 0}
                    aria-label="Previous image"
                    className="absolute left-3 top-1/2 -translate-y-1/2 p-2 bg-white/90 rounded-full shadow-md disabled:opacity-30 hover:bg-white transition"
                  >
                    <ChevronLeft className="h-5 w-5 text-gray-700" />
                  </button>
                  <button
                    onClick={() => setSelectedImage((p) => Math.min(displayImages.length - 1, p + 1))}
                    disabled={selectedImage === displayImages.length - 1}
                    aria-label="Next image"
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-white/90 rounded-full shadow-md disabled:opacity-30 hover:bg-white transition"
                  >
                    <ChevronRight className="h-5 w-5 text-gray-700" />
                  </button>
                </>
              )}

              {!product.in_stock && (
                <div className="absolute top-4 left-4 px-3 py-1 bg-gray-900 text-white text-xs font-semibold rounded-full">
                  Out of Stock
                </div>
              )}
            </div>

            {displayImages.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-1">
                {displayImages.map((img, i) => (
                  <button
                    key={img.id}
                    onClick={() => setSelectedImage(i)}
                    aria-label={`View image ${i + 1}`}
                    className={`flex-shrink-0 h-16 w-16 rounded-xl overflow-hidden border-2 transition-all ${
                      selectedImage === i ? "border-purple-500 shadow-md" : "border-gray-100 hover:border-purple-300"
                    }`}
                  >
                    {img.url ? (
                      <img src={img.url} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-purple-50 flex items-center justify-center">
                        <Package className="h-6 w-6 text-purple-300" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ── Details ──────────────────────────────────────────────────── */}
          <div className="space-y-6">

            {product.category && (
              <span className="inline-block text-xs text-purple-600 bg-purple-50 border border-purple-100 px-3 py-1 rounded-full font-medium">
                {product.category.name}
              </span>
            )}

            <div>
              <h1 className="text-3xl font-bold text-gray-900 leading-tight">{product.name}</h1>
              {product.description && (
                <p className="mt-3 text-gray-600 leading-relaxed">{product.description}</p>
              )}
            </div>

            {/* Price box */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <p className="text-xs text-gray-500 mb-1 font-medium uppercase tracking-wide">
                {hasOptions ? "Total Price" : "Price"}
              </p>
              <div className="flex items-baseline gap-3">
                <span className="text-4xl font-bold text-purple-600">
                  ₹{totalPrice.toLocaleString("en-IN")}
                </span>
                {discount > 0 && (
                  <span className="text-lg text-gray-400 line-through">
                    ₹{product.price.toLocaleString("en-IN")}
                  </span>
                )}
              </div>
              {hasOptions && totalPrice !== product.final_price && (
                <p className="mt-1 text-xs text-gray-500">
                  Base: ₹{product.final_price.toLocaleString("en-IN")} + selected options
                </p>
              )}
              {discount > 0 && (
                <span className="mt-2 inline-block px-2.5 py-1 bg-red-50 text-red-600 text-xs font-semibold rounded-full">
                  {discount}% OFF
                </span>
              )}
            </div>

            {/* Stock */}
            <div className="flex items-center gap-2">
              <div className={`h-2.5 w-2.5 rounded-full ${product.in_stock ? "bg-green-500" : "bg-red-400"}`} />
              <span className={`text-sm font-medium ${product.in_stock ? "text-green-700" : "text-red-600"}`}>
                {product.in_stock
                  ? product.stock < 10 ? `Only ${product.stock} left` : "In Stock"
                  : "Out of Stock"}
              </span>
            </div>

            {/* Dynamic Options */}
            {hasOptions && (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <h3 className="font-semibold text-gray-900 mb-4">Customize Your Order</h3>
                <ProductOptions
                  options={product.options!}
                  selected={selected}
                  onChange={handleOptionChange}
                  errors={optionErrors}
                />
              </div>
            )}

            {/* Quantity */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Quantity</label>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  aria-label="Decrease quantity"
                  className="h-10 w-10 rounded-lg border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 flex items-center justify-center text-lg font-semibold transition-colors"
                >
                  −
                </button>
                <span className="w-12 text-center font-semibold text-gray-900">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                  disabled={quantity >= product.stock}
                  aria-label="Increase quantity"
                  className="h-10 w-10 rounded-lg border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 flex items-center justify-center text-lg font-semibold transition-colors disabled:opacity-40"
                >
                  +
                </button>
                {quantity > 1 && (
                  <span className="text-sm text-gray-500">
                    Total: ₹{(totalPrice * quantity).toLocaleString("en-IN")}
                  </span>
                )}
              </div>
            </div>

            {/* Validation errors */}
            {optionErrors.length > 0 && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl">
                <p className="text-sm text-red-600 font-medium">
                  Please select: {optionErrors.join(", ")}
                </p>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={handleAddToCart}
                disabled={!product.in_stock}
                className={`flex-1 flex items-center justify-center gap-2.5 py-3.5 rounded-xl font-semibold text-white transition-all shadow-md ${
                  addedToCart
                    ? "bg-green-500"
                    : product.in_stock
                    ? "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                    : "bg-gray-300 cursor-not-allowed"
                }`}
              >
                <ShoppingBag className="h-5 w-5" />
                {addedToCart ? "Added!" : product.in_stock ? "Add to Cart" : "Out of Stock"}
              </button>

              <button
                onClick={() => {
                  setInWishlist(!inWishlist);
                  showToast(inWishlist ? "Removed from wishlist" : `${product.name} added to wishlist! 💖`);
                }}
                aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
                className={`p-3.5 rounded-xl border-2 transition-all ${
                  inWishlist
                    ? "border-pink-400 bg-pink-50 text-pink-500"
                    : "border-gray-200 bg-white text-gray-500 hover:border-pink-300"
                }`}
              >
                <Heart className={`h-5 w-5 ${inWishlist ? "fill-pink-500" : ""}`} />
              </button>

              <button
                onClick={() => { navigator.clipboard.writeText(window.location.href); showToast("Link copied!"); }}
                aria-label="Share product"
                className="p-3.5 rounded-xl border-2 border-gray-200 bg-white text-gray-500 hover:border-gray-300 transition-all"
              >
                <Share2 className="h-5 w-5" />
              </button>
            </div>

            {/* SKU */}
            {product.sku && (
              <p className="text-xs text-gray-400">SKU: {product.sku}</p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}