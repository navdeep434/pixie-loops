"use client";

import { useState } from "react";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  Tag,
  Package,
  TrendingUp,
  MoreVertical,
} from "lucide-react";
import { Card, Heading, Text, Button } from "@/components/elements";
import { useToast } from "@/components/elements/useToast";

type Category = {
  id: number;
  name: string;
  slug: string;
  description: string;
  icon: string;
  productCount: number;
  status: "active" | "inactive";
  color: string;
};

export default function CategoriesPage() {
  const { showToast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);

  const categories: Category[] = [
    {
      id: 1,
      name: "Blankets",
      slug: "blankets",
      description: "Cozy handmade crochet blankets for all seasons",
      icon: "🧶",
      productCount: 45,
      status: "active",
      color: "purple",
    },
    {
      id: 2,
      name: "Toys",
      slug: "toys",
      description: "Adorable amigurumi toys and stuffed animals",
      icon: "🧸",
      productCount: 38,
      status: "active",
      color: "pink",
    },
    {
      id: 3,
      name: "Bags",
      slug: "bags",
      description: "Stylish crochet bags and totes",
      icon: "👜",
      productCount: 32,
      status: "active",
      color: "blue",
    },
    {
      id: 4,
      name: "Home Decor",
      slug: "home-decor",
      description: "Beautiful decorative items for your home",
      icon: "🏠",
      productCount: 28,
      status: "active",
      color: "green",
    },
    {
      id: 5,
      name: "Baby Items",
      slug: "baby-items",
      description: "Soft and safe crochet items for babies",
      icon: "👶",
      productCount: 22,
      status: "active",
      color: "yellow",
    },
    {
      id: 6,
      name: "Pet Accessories",
      slug: "pet-accessories",
      description: "Custom crochet items for your furry friends",
      icon: "🐾",
      productCount: 15,
      status: "inactive",
      color: "orange",
    },
  ];

  const handleDelete = (categoryId: number, categoryName: string) => {
    if (confirm(`Are you sure you want to delete "${categoryName}"?`)) {
      showToast(`Category "${categoryName}" deleted successfully`, "success");
    }
  };

  const handleToggleStatus = (categoryId: number, categoryName: string, currentStatus: string) => {
    const newStatus = currentStatus === "active" ? "inactive" : "active";
    showToast(`Category "${categoryName}" is now ${newStatus}`, "success");
  };

  const filteredCategories = categories.filter((category) => {
    return (
      category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      category.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const totalProducts = categories.reduce((sum, cat) => sum + cat.productCount, 0);
  const activeCategories = categories.filter(c => c.status === "active").length;

  const getColorClasses = (color: string) => {
    const colors: { [key: string]: string } = {
      purple: "from-purple-500 to-purple-600",
      pink: "from-pink-500 to-pink-600",
      blue: "from-blue-500 to-blue-600",
      green: "from-green-500 to-green-600",
      yellow: "from-yellow-500 to-yellow-600",
      orange: "from-orange-500 to-orange-600",
    };
    return colors[color] || colors.purple;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Heading level={2} className="text-gray-900">
            Categories
          </Heading>
          <Text variant="small" className="text-gray-600 mt-1">
            Organize your products into categories
          </Text>
        </div>
        <Button onClick={() => setShowAddModal(true)} className="gap-2">
          <Plus className="h-5 w-5" />
          Add Category
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card variant="bordered" className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <Text variant="small" className="text-gray-600">Total Categories</Text>
              <Heading level={3} className="text-gray-900 mt-1">{categories.length}</Heading>
            </div>
            <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <Tag className="h-6 w-6 text-white" />
            </div>
          </div>
        </Card>

        <Card variant="bordered" className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <Text variant="small" className="text-gray-600">Active Categories</Text>
              <Heading level={3} className="text-green-600 mt-1">{activeCategories}</Heading>
            </div>
            <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
          </div>
        </Card>

        <Card variant="bordered" className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <Text variant="small" className="text-gray-600">Total Products</Text>
              <Heading level={3} className="text-blue-600 mt-1">{totalProducts}</Heading>
            </div>
            <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center">
              <Package className="h-6 w-6 text-white" />
            </div>
          </div>
        </Card>
      </div>

      {/* Search */}
      <Card variant="elevated" className="p-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search categories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>
      </Card>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCategories.map((category) => (
          <Card key={category.id} variant="elevated" className="overflow-hidden hover:shadow-xl transition-all">
            {/* Category Header */}
            <div className={`h-32 bg-gradient-to-br ${getColorClasses(category.color)} flex items-center justify-center text-6xl relative`}>
              {category.icon}
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

            {/* Category Content */}
            <div className="p-6">
              <Heading level={4} className="text-gray-900 mb-2">
                {category.name}
              </Heading>
              <Text variant="small" className="text-gray-600 mb-4 line-clamp-2">
                {category.description}
              </Text>

              {/* Stats */}
              <div className="flex items-center gap-4 mb-4 pb-4 border-b border-gray-200">
                <div className="flex items-center gap-2">
                  <Package className="h-4 w-4 text-gray-400" />
                  <Text variant="small" className="text-gray-600">
                    {category.productCount} products
                  </Text>
                </div>
                <div className="flex items-center gap-2">
                  <Tag className="h-4 w-4 text-gray-400" />
                  <Text variant="small" className="text-gray-600">
                    {category.slug}
                  </Text>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 gap-2"
                  onClick={() => handleToggleStatus(category.id, category.name, category.status)}
                >
                  <Eye className="h-4 w-4" />
                  {category.status === "active" ? "Deactivate" : "Activate"}
                </Button>
                <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                  <Edit className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDelete(category.id, category.name)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {filteredCategories.length === 0 && (
        <Card variant="elevated" className="p-12">
          <div className="text-center">
            <Tag className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <Heading level={4} className="text-gray-900 mb-2">No categories found</Heading>
            <Text className="text-gray-600">Try adjusting your search</Text>
          </div>
        </Card>
      )}

      {/* Add Category Modal Placeholder */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card variant="elevated" className="w-full max-w-md mx-4 p-6">
            <Heading level={4} className="text-gray-900 mb-4">Add New Category</Heading>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category Name
                </label>
                <input
                  type="text"
                  placeholder="e.g., Blankets"
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Category description..."
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                />
              </div>
              <div className="flex gap-3">
                <Button onClick={() => setShowAddModal(false)} variant="outline" className="flex-1">
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    showToast("Category added successfully!", "success");
                    setShowAddModal(false);
                  }}
                  className="flex-1"
                >
                  Add Category
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}