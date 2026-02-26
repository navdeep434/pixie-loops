"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Search, Star, MessageSquare, Eye, Trash2,
  CheckCircle, XCircle, TrendingUp, RefreshCw, Package,
} from "lucide-react";
import { Card, Heading, Text, Button, Loading } from "@/components/elements";
import { useToast } from "@/components/elements/useToast";
import apiClient from "@/lib/api/client";
import Link from "next/link";

type Review = {
  id: number;
  rating: number;
  comment?: string;
  status: "active" | "inactive";
  created_at: string;
  customer: {
    id: number;
    name: string;
    email: string;
  };
  product: {
    id: number;
    name: string;
    slug?: string;
  };
};

function StarRow({ rating }: { rating: number }) {
  return (
    <div className="flex">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star key={s} className={`h-4 w-4 ${s <= rating ? "fill-amber-400 text-amber-400" : "text-gray-300"}`} />
      ))}
    </div>
  );
}

export default function ReviewsPage() {
  const { showToast } = useToast();

  const [reviews, setReviews]             = useState<Review[]>([]);
  const [loading, setLoading]             = useState(true);
  const [searchQuery, setSearchQuery]     = useState("");
  const [selectedRating, setSelectedRating] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");

  const fetchReviews = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchQuery)                params.set("search", searchQuery);
      if (selectedRating !== "all")   params.set("rating", selectedRating);
      if (selectedStatus !== "all")   params.set("status", selectedStatus);

      const data = await apiClient.get<{ data: Review[] }>(`/admin/reviews?${params}`);
      setReviews(data.data ?? []);
    } catch (err: any) {
      showToast(err.message || "Failed to load reviews", "error");
    } finally {
      setLoading(false);
    }
  }, [searchQuery, selectedRating, selectedStatus]);

  useEffect(() => {
    const t = setTimeout(() => fetchReviews(), 400);
    return () => clearTimeout(t);
  }, [fetchReviews]);

  const handleStatusUpdate = async (id: number, status: "active" | "inactive") => {
    try {
      const data = await apiClient.put<{ review: Review }>(`/admin/reviews/${id}`, { status });
      setReviews((prev) => prev.map((r) => r.id === id ? data.review : r));
      showToast(`Review ${status === "active" ? "approved" : "rejected"}`, status === "active" ? "success" : "error");
    } catch (err: any) {
      showToast(err.message || "Failed to update review", "error");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this review? This cannot be undone.")) return;
    try {
      await apiClient.delete(`/admin/reviews/${id}`);
      setReviews((prev) => prev.filter((r) => r.id !== id));
      showToast("Review deleted", "success");
    } catch {
      showToast("Failed to delete review", "error");
    }
  };

  const totalReviews   = reviews.length;
  const pendingReviews = reviews.filter((r) => r.status === "inactive").length;
  const avgRating      = totalReviews > 0
    ? (reviews.reduce((s, r) => s + r.rating, 0) / totalReviews).toFixed(1)
    : "0.0";
  const approvedPct    = totalReviews > 0
    ? Math.round((reviews.filter((r) => r.status === "active").length / totalReviews) * 100)
    : 0;

  const ratingDistribution = [5, 4, 3, 2, 1].map((rating) => {
    const count = reviews.filter((r) => r.rating === rating).length;
    return { rating, count, percentage: totalReviews > 0 ? Math.round((count / totalReviews) * 100) : 0 };
  });

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Heading level={2} className="text-gray-900">Reviews & Ratings</Heading>
          <Text variant="small" className="text-gray-600 mt-1">Manage customer feedback and product reviews</Text>
        </div>
        <Button variant="ghost" onClick={fetchReviews} aria-label="Refresh reviews" className="border border-gray-200 p-2">
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card variant="bordered" className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <Text variant="small" className="text-gray-600">Average Rating</Text>
              <div className="flex items-center gap-2 mt-1">
                <Heading level={3} className="text-gray-900">{avgRating}</Heading>
                <div className="flex">
                  {[1,2,3,4,5].map((s) => (
                    <Star key={s} className={`h-4 w-4 ${s <= Math.floor(parseFloat(avgRating)) ? "fill-amber-400 text-amber-400" : "text-gray-300"}`} />
                  ))}
                </div>
              </div>
            </div>
            <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
              <Star className="h-6 w-6 text-white fill-white" />
            </div>
          </div>
        </Card>

        <Card variant="bordered" className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <Text variant="small" className="text-gray-600">Total Reviews</Text>
              <Heading level={3} className="text-gray-900 mt-1">{totalReviews}</Heading>
            </div>
            <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <MessageSquare className="h-6 w-6 text-white" />
            </div>
          </div>
        </Card>

        <Card variant="bordered" className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <Text variant="small" className="text-gray-600">Pending Approval</Text>
              <Heading level={3} className="text-yellow-600 mt-1">{pendingReviews}</Heading>
              <Text variant="small" className="text-gray-500 mt-1">Needs action</Text>
            </div>
            <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center">
              <Eye className="h-6 w-6 text-white" />
            </div>
          </div>
        </Card>

        <Card variant="bordered" className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <Text variant="small" className="text-gray-600">Approval Rate</Text>
              <Heading level={3} className="text-green-600 mt-1">{approvedPct}%</Heading>
            </div>
            <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

        {/* Rating Distribution */}
        <Card variant="elevated" className="p-6 h-fit">
          <Heading level={4} className="text-gray-900 mb-4">Distribution</Heading>
          <div className="space-y-3">
            {ratingDistribution.map(({ rating, count, percentage }) => (
              <div key={rating} className="flex items-center gap-3">
                <div className="flex items-center gap-1 w-10 flex-shrink-0">
                  <Text variant="small" className="font-medium text-gray-700">{rating}</Text>
                  <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                </div>
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div
                    className="h-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-full transition-all"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <Text variant="small" className="text-gray-500 w-6 text-right">{count}</Text>
              </div>
            ))}
          </div>
        </Card>

        {/* Reviews List */}
        <Card variant="elevated" className="lg:col-span-3 p-6">

          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search reviews..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <select
              aria-label="Filter by rating"
              value={selectedRating}
              onChange={(e) => setSelectedRating(e.target.value)}
              className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="all">All Ratings</option>
              {[5,4,3,2,1].map((r) => <option key={r} value={r}>{r} Stars</option>)}
            </select>
            <select
              aria-label="Filter by status"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="all">All Status</option>
              <option value="active">Approved</option>
              <option value="inactive">Pending</option>
            </select>
          </div>

          {/* List */}
          {loading ? (
            <Loading />
          ) : reviews.length === 0 ? (
            <div className="text-center py-16">
              <Package className="h-12 w-12 text-gray-200 mx-auto mb-4" />
              <Text className="text-gray-400 font-medium" align="center">No reviews found</Text>
            </div>
          ) : (
            <div className="space-y-4">
              {reviews.map((review) => (
                <div key={review.id} className="p-5 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-start gap-3">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                        {review.customer.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <Text className="font-semibold text-gray-900">{review.customer.name}</Text>
                        <Text variant="small" className="text-gray-500">{review.customer.email}</Text>
                        {review.product && (
                          <Link href={`/admin/products/${review.product.id}`}>
                            <Text variant="small" className="text-purple-600 hover:underline">
                              {review.product.name}
                            </Text>
                          </Link>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <StarRow rating={review.rating} />
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        review.status === "active" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                      }`}>
                        {review.status === "active" ? "Approved" : "Pending"}
                      </span>
                    </div>
                  </div>

                  {review.comment && (
                    <Text className="text-gray-700 mb-3 leading-relaxed">{review.comment}</Text>
                  )}

                  <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                    <Text variant="small" className="text-gray-400">
                      {new Date(review.created_at).toLocaleDateString("en-IN", {
                        day: "numeric", month: "short", year: "numeric",
                      })}
                    </Text>

                    <div className="flex items-center gap-2">
                      {review.status === "inactive" && (
                        <>
                          <Button
                            size="sm"
                            onClick={() => handleStatusUpdate(review.id, "active")}
                            className="gap-1.5 bg-green-600 hover:bg-green-700 text-white"
                          >
                            <CheckCircle className="h-3.5 w-3.5" />
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleStatusUpdate(review.id, "inactive")}
                            className="gap-1.5 text-red-600 border-red-200 hover:bg-red-50"
                          >
                            <XCircle className="h-3.5 w-3.5" />
                            Reject
                          </Button>
                        </>
                      )}
                      {review.status === "active" && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleStatusUpdate(review.id, "inactive")}
                          className="gap-1.5 text-orange-600 hover:bg-orange-50 text-xs"
                        >
                          <XCircle className="h-3.5 w-3.5" />
                          Unpublish
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        onClick={() => handleDelete(review.id)}
                        aria-label="Delete review"
                        className="p-2 text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}