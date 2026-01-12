"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Plus,
  Search,
  Filter,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  Copy,
  Package,
} from "lucide-react";
import { Card, Heading, Text, Button } from "@/components/elements";
import { useToast } from "@/components/elements/useToast";

type Product = {
  id: number;
  name: string;
  category: string;
  price: number;
  stock: number;
  status: "active" | "draft" | "archived";
  image: string;
  sales: number;
};

export default function ProductsPage() {
  const { showToast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [showFilters, setShowFilters] = useState(false);

  const products: Product[] = [
    {
      id: 1,
      name: "Cozy Crochet Blanket",
      category: "Blankets",
      price: 2499,
      stock: 15,
      status: "active",
      image: "🧶",
      sales: 45,
    },
    {
      id: 2,
      name: "Amigurumi Teddy Bear",
      category: "Toys",
      price: 899,
      stock: 28,
      status: "active",
      image: "🧸",
      sales: 38,
    },
    {
      id: 3,
      name: "Crochet Tote Bag",
      category: "Bags",
      price: 1299,
      stock: 20,
      status: "active",
      image: "👜",
      sales: 32,
    },
    {
      id: 4,
      name: "Baby Blanket Set",
      category: "Blankets",
      price: 1899,
      stock: 12,
      status: "active",
      image: "👶",
      sales: 28,
    },
    {
      id: 5,
      name: "Custom Pillow Cover",
      category: "Home Decor",
      price: 1599,
      stock: 8,
      status: "draft",
      image: "🛋️",
      sales: 15,
    },
    {
      id: 6,
      name: "Amigurumi Unicorn",
      category: "Toys",
      price: 999,
      stock: 0,
      status: "active",
      image: "🦄",
      sales: 22,
    },
  ];

  const categories = ["all", "Blankets", "Toys", "Bags", "Home Decor"];
  const statuses = ["all", "active", "draft", "archived"];

  const getStatusColor = (status: Product["status"]) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-700";
      case "draft":
        return "bg-yellow-100 text-yellow-700";
      case "archived":
        return "bg-gray-100 text-gray-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const handleDelete = (productId: number, productName: string) => {
    if (confirm(`Are you sure you want to delete "${productName}"?`)) {
      showToast(`Product "${productName}" deleted successfully`, "success");
    }
  };

  const handleDuplicate = (productName: string) => {
    showToast(`Product "${productName}" duplicated successfully`, "success");
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory;
    const matchesStatus = selectedStatus === "all" || product.status === selectedStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Heading level={2} className="text-gray-900">
            Products
          </Heading>
          <Text variant="small" className="text-gray-600 mt-1">
            Manage your crochet product inventory
          </Text>
        </div>
        <Link href="/admin/products/new">
          <Button className="gap-2">
            <Plus className="h-5 w-5" />
            Add Product
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card variant="bordered" className="p-4">
          <Text variant="small" className="text-gray-600">Total Products</Text>
          <Heading level={3} className="text-gray-900 mt-1">{products.length}</Heading>
        </Card>
        <Card variant="bordered" className="p-4">
          <Text variant="small" className="text-gray-600">Active Products</Text>
          <Heading level={3} className="text-green-600 mt-1">
            {products.filter(p => p.status === "active").length}
          </Heading>
        </Card>
        <Card variant="bordered" className="p-4">
          <Text variant="small" className="text-gray-600">Low Stock</Text>
          <Heading level={3} className="text-orange-600 mt-1">
            {products.filter(p => p.stock < 10).length}
          </Heading>
        </Card>
        <Card variant="bordered" className="p-4">
          <Text variant="small" className="text-gray-600">Out of Stock</Text>
          <Heading level={3} className="text-red-600 mt-1">
            {products.filter(p => p.stock === 0).length}
          </Heading>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card variant="elevated" className="p-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat === "all" ? "All Categories" : cat}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            {statuses.map((status) => (
              <option key={status} value={status}>
                {status === "all" ? "All Status" : status.charAt(0).toUpperCase() + status.slice(1)}
              </option>
            ))}
          </select>

          <Button variant="outline" className="gap-2">
            <Filter className="h-4 w-4" />
            More Filters
          </Button>
        </div>
      </Card>

      {/* Products Table */}
      <Card variant="elevated" className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Stock
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Sales
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-purple-100 to-pink-100 text-2xl">
                        {product.image}
                      </div>
                      <div>
                        <Text className="font-semibold text-gray-900">{product.name}</Text>
                        <Text variant="small" className="text-gray-500">ID: #{product.id}</Text>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <Text className="text-gray-700">{product.category}</Text>
                  </td>
                  <td className="px-6 py-4">
                    <Text className="font-semibold text-gray-900">₹{product.price}</Text>
                  </td>
                  <td className="px-6 py-4">
                    <Text className={`font-semibold ${
                      product.stock === 0 ? "text-red-600" :
                      product.stock < 10 ? "text-orange-600" :
                      "text-gray-900"
                    }`}>
                      {product.stock} units
                    </Text>
                  </td>
                  <td className="px-6 py-4">
                    <Text className="text-gray-700">{product.sales} sold</Text>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(product.status)}`}>
                      {product.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
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
                        onClick={() => handleDuplicate(product.name)}
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
              ))}
            </tbody>
          </table>
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <Heading level={4} className="text-gray-900 mb-2">No products found</Heading>
            <Text className="text-gray-600">Try adjusting your search or filters</Text>
          </div>
        )}
      </Card>
    </div>
  );
}