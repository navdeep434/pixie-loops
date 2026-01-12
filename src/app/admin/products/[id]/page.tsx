"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Save,
  Trash2,
  Upload,
  X,
  Plus,
  DollarSign,
  Package,
  Tag,
  FileText,
} from "lucide-react";
import { Card, Heading, Text, Button } from "@/components/elements";
import { useToast } from "@/components/elements/useToast";

export default function ProductDetailPage() {
  const router = useRouter();
  const { showToast } = useToast();

  const [productData, setProductData] = useState({
    name: "Cozy Crochet Blanket",
    description: "Beautiful handmade crochet blanket perfect for your living room or bedroom. Made with premium soft yarn in various colors.",
    price: 2499,
    compareAtPrice: 3499,
    sku: "CCB-001",
    barcode: "123456789",
    stock: 15,
    category: "Blankets",
    status: "active",
    tags: ["blanket", "cozy", "handmade", "crochet"],
    images: ["🧶", "🎨", "💝"],
  });

  const [newTag, setNewTag] = useState("");

  const handleSave = () => {
    showToast("Product updated successfully!", "success");
    router.push("/admin/products");
  };

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this product?")) {
      showToast("Product deleted successfully", "success");
      router.push("/admin/products");
    }
  };

  const addTag = () => {
    if (newTag && !productData.tags.includes(newTag)) {
      setProductData({
        ...productData,
        tags: [...productData.tags, newTag],
      });
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setProductData({
      ...productData,
      tags: productData.tags.filter((tag) => tag !== tagToRemove),
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </button>
          <div>
            <Heading level={2} className="text-gray-900">
              Edit Product
            </Heading>
            <Text variant="small" className="text-gray-600 mt-1">
              Update product information and settings
            </Text>
          </div>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={handleDelete} className="gap-2 text-red-600 border-red-600 hover:bg-red-50">
            <Trash2 className="h-5 w-5" />
            Delete
          </Button>
          <Button onClick={handleSave} className="gap-2">
            <Save className="h-5 w-5" />
            Save Changes
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <Card variant="elevated" className="p-6">
            <Heading level={4} className="text-gray-900 mb-4">
              Basic Information
            </Heading>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Name *
                </label>
                <input
                  type="text"
                  value={productData.name}
                  onChange={(e) =>
                    setProductData({ ...productData, name: e.target.value })
                  }
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  rows={5}
                  value={productData.description}
                  onChange={(e) =>
                    setProductData({ ...productData, description: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                />
              </div>
            </div>
          </Card>

          {/* Pricing */}
          <Card variant="elevated" className="p-6">
            <Heading level={4} className="text-gray-900 mb-4 flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-purple-600" />
              Pricing
            </Heading>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                    ₹
                  </span>
                  <input
                    type="number"
                    value={productData.price}
                    onChange={(e) =>
                      setProductData({ ...productData, price: Number(e.target.value) })
                    }
                    className="w-full pl-8 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Compare at Price
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                    ₹
                  </span>
                  <input
                    type="number"
                    value={productData.compareAtPrice}
                    onChange={(e) =>
                      setProductData({
                        ...productData,
                        compareAtPrice: Number(e.target.value),
                      })
                    }
                    className="w-full pl-8 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {productData.compareAtPrice > productData.price && (
              <div className="mt-3 p-3 bg-green-50 rounded-lg border border-green-200">
                <Text variant="small" className="text-green-700 font-medium">
                  Savings: ₹{productData.compareAtPrice - productData.price} (
                  {Math.round(
                    ((productData.compareAtPrice - productData.price) /
                      productData.compareAtPrice) *
                      100
                  )}
                  % off)
                </Text>
              </div>
            )}
          </Card>

          {/* Inventory */}
          <Card variant="elevated" className="p-6">
            <Heading level={4} className="text-gray-900 mb-4 flex items-center gap-2">
              <Package className="h-5 w-5 text-purple-600" />
              Inventory
            </Heading>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  SKU
                </label>
                <input
                  type="text"
                  value={productData.sku}
                  onChange={(e) =>
                    setProductData({ ...productData, sku: e.target.value })
                  }
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Barcode
                </label>
                <input
                  type="text"
                  value={productData.barcode}
                  onChange={(e) =>
                    setProductData({ ...productData, barcode: e.target.value })
                  }
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Stock *
                </label>
                <input
                  type="number"
                  value={productData.stock}
                  onChange={(e) =>
                    setProductData({ ...productData, stock: Number(e.target.value) })
                  }
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="mt-3">
              {productData.stock === 0 && (
                <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                  <Text variant="small" className="text-red-700 font-medium">
                    ⚠️ Product is out of stock
                  </Text>
                </div>
              )}
              {productData.stock > 0 && productData.stock < 10 && (
                <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                  <Text variant="small" className="text-yellow-700 font-medium">
                    ⚠️ Low stock warning
                  </Text>
                </div>
              )}
            </div>
          </Card>

          {/* Product Images */}
          <Card variant="elevated" className="p-6">
            <Heading level={4} className="text-gray-900 mb-4">
              Product Images
            </Heading>
            <div className="grid grid-cols-4 gap-4">
              {productData.images.map((img, index) => (
                <div
                  key={index}
                  className="relative aspect-square bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg flex items-center justify-center text-4xl group"
                >
                  {img}
                  <button
                    onClick={() =>
                      setProductData({
                        ...productData,
                        images: productData.images.filter((_, i) => i !== index),
                      })
                    }
                    className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
              <button className="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center hover:border-purple-500 hover:bg-purple-50 transition-all">
                <Upload className="h-6 w-6 text-gray-400 mb-1" />
                <Text variant="small" className="text-gray-500">
                  Upload
                </Text>
              </button>
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status */}
          <Card variant="elevated" className="p-6">
            <Heading level={4} className="text-gray-900 mb-4">
              Status
            </Heading>
            <select
              value={productData.status}
              onChange={(e) =>
                setProductData({ ...productData, status: e.target.value })
              }
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="active">Active</option>
              <option value="draft">Draft</option>
              <option value="archived">Archived</option>
            </select>
          </Card>

          {/* Organization */}
          <Card variant="elevated" className="p-6">
            <Heading level={4} className="text-gray-900 mb-4 flex items-center gap-2">
              <Tag className="h-5 w-5 text-purple-600" />
              Organization
            </Heading>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  value={productData.category}
                  onChange={(e) =>
                    setProductData({ ...productData, category: e.target.value })
                  }
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="Blankets">Blankets</option>
                  <option value="Toys">Toys</option>
                  <option value="Bags">Bags</option>
                  <option value="Home Decor">Home Decor</option>
                  <option value="Baby Items">Baby Items</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tags
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                    placeholder="Add tag..."
                    className="flex-1 px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                  <Button size="sm" onClick={addTag}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {productData.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm"
                    >
                      {tag}
                      <button
                        onClick={() => removeTag(tag)}
                        className="hover:text-purple-900"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </Card>

          {/* Preview */}
          <Card variant="elevated" className="p-6">
            <Heading level={4} className="text-gray-900 mb-4">
              Preview
            </Heading>
            <div className="space-y-3">
              <div className="aspect-square bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg flex items-center justify-center text-6xl">
                {productData.images[0] || "🧶"}
              </div>
              <div>
                <Text className="font-semibold text-gray-900">
                  {productData.name}
                </Text>
                <div className="flex items-center gap-2 mt-1">
                  <Text className="font-bold text-purple-600">
                    ₹{productData.price}
                  </Text>
                  {productData.compareAtPrice > productData.price && (
                    <Text
                      variant="small"
                      className="text-gray-500 line-through"
                    >
                      ₹{productData.compareAtPrice}
                    </Text>
                  )}
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}