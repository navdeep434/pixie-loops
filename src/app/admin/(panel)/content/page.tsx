"use client";

import { useState } from "react";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  FileText,
  Image as ImageIcon,
  Video,
  Calendar,
  MoreVertical,
  Globe,
  Lock,
} from "lucide-react";
import { Card, Heading, Text, Button } from "@/components/elements";
import { useToast } from "@/components/elements/useToast";

type ContentItem = {
  id: number;
  title: string;
  type: "page" | "blog" | "banner" | "faq";
  status: "published" | "draft" | "scheduled";
  author: string;
  lastModified: string;
  views: number;
  slug: string;
};

export default function ContentPage() {
  const { showToast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");

  const contentItems: ContentItem[] = [
    {
      id: 1,
      title: "About Us - Our Story",
      type: "page",
      status: "published",
      author: "Admin",
      lastModified: "2024-01-10",
      views: 1245,
      slug: "about-us",
    },
    {
      id: 2,
      title: "How to Care for Your Crochet Items",
      type: "blog",
      status: "published",
      author: "Admin",
      lastModified: "2024-01-09",
      views: 892,
      slug: "care-guide",
    },
    {
      id: 3,
      title: "Winter Sale 2024 Banner",
      type: "banner",
      status: "scheduled",
      author: "Admin",
      lastModified: "2024-01-08",
      views: 0,
      slug: "winter-sale-banner",
    },
    {
      id: 4,
      title: "Shipping & Returns Policy",
      type: "page",
      status: "published",
      author: "Admin",
      lastModified: "2024-01-07",
      views: 567,
      slug: "shipping-returns",
    },
    {
      id: 5,
      title: "Top 10 Crochet Gift Ideas",
      type: "blog",
      status: "draft",
      author: "Admin",
      lastModified: "2024-01-06",
      views: 0,
      slug: "gift-ideas-draft",
    },
    {
      id: 6,
      title: "Frequently Asked Questions",
      type: "faq",
      status: "published",
      author: "Admin",
      lastModified: "2024-01-05",
      views: 2134,
      slug: "faq",
    },
  ];

  const types = ["all", "page", "blog", "banner", "faq"];
  const statuses = ["all", "published", "draft", "scheduled"];

  const getTypeIcon = (type: ContentItem["type"]) => {
    switch (type) {
      case "page":
        return FileText;
      case "blog":
        return FileText;
      case "banner":
        return ImageIcon;
      case "faq":
        return FileText;
      default:
        return FileText;
    }
  };

  const getTypeColor = (type: ContentItem["type"]) => {
    switch (type) {
      case "page":
        return "bg-blue-100 text-blue-700";
      case "blog":
        return "bg-purple-100 text-purple-700";
      case "banner":
        return "bg-pink-100 text-pink-700";
      case "faq":
        return "bg-green-100 text-green-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusConfig = (status: ContentItem["status"]) => {
    switch (status) {
      case "published":
        return {
          color: "bg-green-100 text-green-700",
          icon: Globe,
        };
      case "draft":
        return {
          color: "bg-gray-100 text-gray-700",
          icon: Lock,
        };
      case "scheduled":
        return {
          color: "bg-blue-100 text-blue-700",
          icon: Calendar,
        };
      default:
        return {
          color: "bg-gray-100 text-gray-700",
          icon: FileText,
        };
    }
  };

  const handleDelete = (contentId: number, contentTitle: string) => {
    if (confirm(`Are you sure you want to delete "${contentTitle}"?`)) {
      showToast(`Content "${contentTitle}" deleted successfully`, "success");
    }
  };

  const filteredContent = contentItems.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.slug.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === "all" || item.type === selectedType;
    const matchesStatus = selectedStatus === "all" || item.status === selectedStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  const totalViews = contentItems.reduce((sum, item) => sum + item.views, 0);
  const publishedCount = contentItems.filter((i) => i.status === "published").length;
  const draftCount = contentItems.filter((i) => i.status === "draft").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Heading level={2} className="text-gray-900">
            Content Management
          </Heading>
          <Text variant="small" className="text-gray-600 mt-1">
            Create and manage your website content
          </Text>
        </div>
        <Button className="gap-2">
          <Plus className="h-5 w-5" />
          Create Content
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card variant="bordered" className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <Text variant="small" className="text-gray-600">Total Content</Text>
              <Heading level={3} className="text-gray-900 mt-1">{contentItems.length}</Heading>
            </div>
            <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <FileText className="h-6 w-6 text-white" />
            </div>
          </div>
        </Card>

        <Card variant="bordered" className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <Text variant="small" className="text-gray-600">Published</Text>
              <Heading level={3} className="text-green-600 mt-1">{publishedCount}</Heading>
            </div>
            <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
              <Globe className="h-6 w-6 text-white" />
            </div>
          </div>
        </Card>

        <Card variant="bordered" className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <Text variant="small" className="text-gray-600">Drafts</Text>
              <Heading level={3} className="text-yellow-600 mt-1">{draftCount}</Heading>
            </div>
            <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center">
              <Lock className="h-6 w-6 text-white" />
            </div>
          </div>
        </Card>

        <Card variant="bordered" className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <Text variant="small" className="text-gray-600">Total Views</Text>
              <Heading level={3} className="text-blue-600 mt-1">{totalViews.toLocaleString()}</Heading>
            </div>
            <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center">
              <Eye className="h-6 w-6 text-white" />
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card variant="elevated" className="p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search content..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>

          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            {types.map((type) => (
              <option key={type} value={type}>
                {type === "all" ? "All Types" : type.charAt(0).toUpperCase() + type.slice(1)}
              </option>
            ))}
          </select>

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
        </div>
      </Card>

      {/* Content Table */}
      <Card variant="elevated" className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Author
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Last Modified
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Views
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredContent.map((item) => {
                const TypeIcon = getTypeIcon(item.type);
                const statusConfig = getStatusConfig(item.status);
                const StatusIcon = statusConfig.icon;

                return (
                  <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`h-10 w-10 rounded-lg ${getTypeColor(item.type)} flex items-center justify-center`}>
                          <TypeIcon className="h-5 w-5" />
                        </div>
                        <div>
                          <Text className="font-semibold text-gray-900">{item.title}</Text>
                          <Text variant="small" className="text-gray-500">/{item.slug}</Text>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getTypeColor(item.type)}`}>
                        {item.type}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-lg ${statusConfig.color}`}>
                        <StatusIcon className="h-4 w-4" />
                        <span className="text-xs font-medium">{item.status}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Text className="text-gray-700">{item.author}</Text>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <Text variant="small" className="text-gray-600">
                          {new Date(item.lastModified).toLocaleDateString()}
                        </Text>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Eye className="h-4 w-4 text-gray-400" />
                        <Text className="text-gray-700">{item.views.toLocaleString()}</Text>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors">
                          <Eye className="h-4 w-4" />
                        </button>
                        <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id, item.title)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredContent.length === 0 && (
          <div className="text-center py-12">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <Heading level={4} className="text-gray-900 mb-2">No content found</Heading>
            <Text className="text-gray-600">Try adjusting your search or filters</Text>
          </div>
        )}
      </Card>

      {/* Quick Actions */}
      <Card variant="elevated" className="p-6">
        <Heading level={4} className="text-gray-900 mb-4">Quick Actions</Heading>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="flex flex-col items-center justify-center p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg hover:shadow-lg transition-all group">
            <FileText className="h-8 w-8 text-blue-600 mb-2 group-hover:scale-110 transition-transform" />
            <Text className="font-semibold text-gray-900">New Page</Text>
          </button>
          <button className="flex flex-col items-center justify-center p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg hover:shadow-lg transition-all group">
            <FileText className="h-8 w-8 text-purple-600 mb-2 group-hover:scale-110 transition-transform" />
            <Text className="font-semibold text-gray-900">New Blog Post</Text>
          </button>
          <button className="flex flex-col items-center justify-center p-6 bg-gradient-to-br from-pink-50 to-rose-50 rounded-lg hover:shadow-lg transition-all group">
            <ImageIcon className="h-8 w-8 text-pink-600 mb-2 group-hover:scale-110 transition-transform" />
            <Text className="font-semibold text-gray-900">New Banner</Text>
          </button>
          <button className="flex flex-col items-center justify-center p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg hover:shadow-lg transition-all group">
            <FileText className="h-8 w-8 text-green-600 mb-2 group-hover:scale-110 transition-transform" />
            <Text className="font-semibold text-gray-900">New FAQ</Text>
          </button>
        </div>
      </Card>
    </div>
  );
}