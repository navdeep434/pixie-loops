"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  Plus, Search, Edit, Trash2, Eye,
  FileText, Image as ImageIcon, Calendar,
  Globe, Lock, RefreshCw,
} from "lucide-react";
import { Card, Heading, Text, Button, Loading } from "@/components/elements";
import { useDialog } from "@/components/elements";
import apiClient from "@/lib/api/client";

type ContentItem = {
  id: number;
  key: string;
  title: string | null;
  body: string | null;
  image: string | null;
  status: boolean;
  created_at: string;
  updated_at: string;
};

const getStatusConfig = (status: boolean) =>
  status
    ? { color: "bg-green-100 text-green-700", Icon: Globe,  label: "Published" }
    : { color: "bg-gray-100 text-gray-600",   Icon: Lock,   label: "Draft"     };

// Derive a display type from the key for visual grouping
const getKeyMeta = (key: string) => {
  if (key.includes("banner")) return { color: "bg-pink-100 text-pink-700",     label: "Banner" };
  if (key.includes("faq"))    return { color: "bg-green-100 text-green-700",   label: "FAQ"    };
  if (key.includes("blog"))   return { color: "bg-purple-100 text-purple-700", label: "Blog"   };
  return                             { color: "bg-blue-100 text-blue-700",     label: "Page"   };
};

export default function ContentPage() {
  const dialog = useDialog();

  const [items, setItems]               = useState<ContentItem[]>([]);
  const [loading, setLoading]           = useState(true);
  const [searchQuery, setSearchQuery]   = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const fetchContent = useCallback(async () => {
    setLoading(true);
    try {
      const data = await apiClient.get<any>("/admin/contents");
      setItems(data.data ?? data.contents ?? []);
    } catch (err: any) {
      await dialog.warn(err.message || "Failed to load content.", "Error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchContent(); }, [fetchContent]);

  const handleDelete = async (id: number, title: string) => {
    const confirmed = await dialog.danger(
      <>Delete <strong>"{title || id}"</strong>? This cannot be undone.</>,
      "Delete Content"
    );
    if (!confirmed) return;
    try {
      await apiClient.delete(`/admin/contents/${id}`);
      await dialog.success(`"${title || id}" has been deleted.`, "Deleted");
      fetchContent();
    } catch (err: any) {
      await dialog.warn(err.message || "Failed to delete content.", "Error");
    }
  };

  const filtered = items.filter((item) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch = !q
      || item.key.toLowerCase().includes(q)
      || (item.title ?? "").toLowerCase().includes(q);
    const matchesStatus =
      statusFilter === "all"
        ? true
        : statusFilter === "published"
        ? item.status
        : !item.status;
    return matchesSearch && matchesStatus;
  });

  const publishedCount = items.filter((i) => i.status).length;
  const draftCount     = items.filter((i) => !i.status).length;
  const totalViews     = 0; // Not in API — omit or extend later

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Heading level={2} className="text-gray-900">Content Management</Heading>
          <Text variant="small" className="text-gray-600 mt-1">Create and manage your website content</Text>
        </div>
        <div className="flex gap-3">
          <Button variant="ghost" onClick={fetchContent} aria-label="Refresh" className="p-2.5 border border-gray-200">
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          </Button>
          <Link href="/admin/content/new">
            <Button variant="primary" className="gap-2">
              <Plus className="h-5 w-5" /> Create Content
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: "Total Content", value: items.length,    color: "text-gray-900",   Icon: FileText, bg: "from-purple-500 to-pink-500"   },
          { label: "Published",     value: publishedCount,  color: "text-green-600",  Icon: Globe,    bg: "from-green-500 to-emerald-500"  },
          { label: "Drafts",        value: draftCount,      color: "text-yellow-600", Icon: Lock,     bg: "from-yellow-500 to-orange-500"  },
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

      {/* Filters */}
      <Card variant="elevated" className="p-5">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              id="content-search"
              type="text"
              placeholder="Search by title or key..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search content"
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <select
            id="content-status-filter"
            aria-label="Filter by status"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="all">All Status</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>
        </div>
      </Card>

      {/* Table */}
      <Card variant="elevated" className="overflow-hidden">
        {loading ? (
          <Loading />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  {["Title / Key", "Type", "Status", "Last Modified", "Actions"].map((h) => (
                    <th key={h} className={`px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider ${h === "Actions" ? "text-right" : "text-left"}`}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((item) => {
                  const meta   = getKeyMeta(item.key);
                  const status = getStatusConfig(item.status);
                  const StatusIcon = status.Icon;
                  return (
                    <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`h-10 w-10 rounded-lg flex items-center justify-center flex-shrink-0 ${meta.color}`}>
                            {item.image
                              ? <ImageIcon className="h-5 w-5" />
                              : <FileText className="h-5 w-5" />}
                          </div>
                          <div>
                            <Text className="font-semibold text-gray-900">{item.title || "(no title)"}</Text>
                            <Text variant="small" className="text-gray-400 font-mono">{item.key}</Text>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${meta.color}`}>
                          {meta.label}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium ${status.color}`}>
                          <StatusIcon className="h-3.5 w-3.5" />
                          {status.label}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          <Text variant="small" className="text-gray-600">
                            {new Date(item.updated_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                          </Text>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-1">
                          <Link href={`/admin/content/${item.id}/edit`}>
                            <Button variant="ghost" aria-label={`Edit ${item.title || item.key}`} className="p-2 text-blue-600 hover:bg-blue-50">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Button
                            variant="ghost"
                            onClick={() => handleDelete(item.id, item.title || item.key)}
                            aria-label={`Delete ${item.title || item.key}`}
                            className="p-2 text-red-600 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {filtered.length === 0 && !loading && (
              <div className="text-center py-16">
                <FileText className="h-12 w-12 text-gray-200 mx-auto mb-4" />
                <Heading level={4} className="text-gray-900 mb-1" align="center">No content found</Heading>
                <Text className="text-gray-500" align="center">Try adjusting your search or filters</Text>
              </div>
            )}
          </div>
        )}
      </Card>

      {/* Quick Create */}
      <Card variant="elevated" className="p-6">
        <Heading level={4} className="text-gray-900 mb-4">Quick Create</Heading>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "New Page",     Icon: FileText,  from: "from-blue-50 to-indigo-50",    iconColor: "text-blue-600",   key: "page"   },
            { label: "New Blog Post",Icon: FileText,  from: "from-purple-50 to-pink-50",    iconColor: "text-purple-600", key: "blog"   },
            { label: "New Banner",   Icon: ImageIcon, from: "from-pink-50 to-rose-50",      iconColor: "text-pink-600",   key: "banner" },
            { label: "New FAQ",      Icon: FileText,  from: "from-green-50 to-emerald-50",  iconColor: "text-green-600",  key: "faq"    },
          ].map(({ label, Icon, from, iconColor, key }) => (
            <Link key={key} href={`/admin/content/new?type=${key}`}>
              <Button
                variant="ghost"
                className={`w-full flex-col h-auto py-6 bg-gradient-to-br ${from} hover:shadow-md border-0 group`}
              >
                <Icon className={`h-8 w-8 ${iconColor} mb-2 group-hover:scale-110 transition-transform`} />
                <Text className="font-semibold text-gray-900 text-sm">{label}</Text>
              </Button>
            </Link>
          ))}
        </div>
      </Card>
    </div>
  );
}