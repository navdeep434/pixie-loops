"use client";

import { useState } from "react";
import {
  Search,
  Star,
  ThumbsUp,
  MessageSquare,
  Eye,
  Trash2,
  CheckCircle,
  XCircle,
  Filter,
  TrendingUp,
} from "lucide-react";
import { Card, Heading, Text, Button } from "@/components/elements";
import { useToast } from "@/components/elements/useToast";

type Review = {
  id: number;
  customer: {
    name: string;
    avatar: string;
    verified: boolean;
  };
  product: string;
  rating: number;
  comment: string;
  date: string;
  helpful: number;
  status: "pending" | "approved" | "rejected";
  images?: string[];
};

export default function ReviewsPage() {
  const { showToast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRating, setSelectedRating] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");

  const reviews: Review[] = [
    {
      id: 1,
      customer: {
        name: "Sarah Johnson",
        avatar: "👩",
        verified: true,
      },
      product: "Cozy Crochet Blanket",
      rating: 5,
      comment: "Absolutely beautiful blanket! The quality is amazing and it's so soft. Perfect for my living room. Highly recommend!",
      date: "2024-01-10",
      helpful: 12,
      status: "approved",
      images: ["📷", "📷"],
    },
    {
      id: 2,
      customer: {
        name: "Mike Chen",
        avatar: "👨",
        verified: true,
      },
      product: "Amigurumi Teddy Bear",
      rating: 5,
      comment: "My daughter loves this teddy bear! It's well-made and the attention to detail is incredible. Worth every penny.",
      date: "2024-01-09",
      helpful: 8,
      status: "approved",
    },
    {
      id: 3,
      customer: {
        name: "Emily Davis",
        avatar: "👩‍🦰",
        verified: false,
      },
      product: "Crochet Tote Bag",
      rating: 4,
      comment: "Great bag, very sturdy. Only wish it was slightly larger. Otherwise, perfect for daily use!",
      date: "2024-01-08",
      helpful: 5,
      status: "approved",
    },
    {
      id: 4,
      customer: {
        name: "Alex Kumar",
        avatar: "👨‍💼",
        verified: true,
      },
      product: "Baby Blanket Set",
      rating: 5,
      comment: "Perfect gift for a baby shower! The colors are beautiful and it's so soft. The recipient loved it!",
      date: "2024-01-07",
      helpful: 3,
      status: "pending",
    },
    {
      id: 5,
      customer: {
        name: "Lisa Wang",
        avatar: "👩‍💻",
        verified: false,
      },
      product: "Custom Pillow Cover",
      rating: 3,
      comment: "Nice product but took longer than expected to arrive. Quality is good though.",
      date: "2024-01-06",
      helpful: 1,
      status: "pending",
    },
  ];

  const ratings = ["all", "5", "4", "3", "2", "1"];
  const statuses = ["all", "pending", "approved", "rejected"];

  const handleApprove = (reviewId: number) => {
    showToast("Review approved successfully", "success");
  };

  const handleReject = (reviewId: number) => {
    showToast("Review rejected", "error");
  };

  const handleDelete = (reviewId: number) => {
    if (confirm("Are you sure you want to delete this review?")) {
      showToast("Review deleted successfully", "success");
    }
  };

  const filteredReviews = reviews.filter((review) => {
    const matchesSearch =
      review.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      review.product.toLowerCase().includes(searchQuery.toLowerCase()) ||
      review.comment.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRating = selectedRating === "all" || review.rating.toString() === selectedRating;
    const matchesStatus = selectedStatus === "all" || review.status === selectedStatus;
    return matchesSearch && matchesRating && matchesStatus;
  });

  const avgRating = (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1);
  const totalReviews = reviews.length;
  const pendingReviews = reviews.filter(r => r.status === "pending").length;
  const ratingDistribution = [5, 4, 3, 2, 1].map(rating => ({
    rating,
    count: reviews.filter(r => r.rating === rating).length,
    percentage: Math.round((reviews.filter(r => r.rating === rating).length / totalReviews) * 100),
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Heading level={2} className="text-gray-900">
            Reviews & Ratings
          </Heading>
          <Text variant="small" className="text-gray-600 mt-1">
            Manage customer feedback and product reviews
          </Text>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card variant="bordered" className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <Text variant="small" className="text-gray-600">Average Rating</Text>
              <div className="flex items-center gap-2 mt-1">
                <Heading level={3} className="text-gray-900">{avgRating}</Heading>
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < Math.floor(parseFloat(avgRating))
                          ? "fill-amber-400 text-amber-400"
                          : "text-gray-300"
                      }`}
                    />
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
              <Text variant="small" className="text-green-600 mt-1">+12% this month</Text>
            </div>
            <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <MessageSquare className="h-6 w-6 text-white" />
            </div>
          </div>
        </Card>

        <Card variant="bordered" className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <Text variant="small" className="text-gray-600">Pending Review</Text>
              <Heading level={3} className="text-yellow-600 mt-1">{pendingReviews}</Heading>
              <Text variant="small" className="text-gray-600 mt-1">Needs approval</Text>
            </div>
            <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center">
              <Eye className="h-6 w-6 text-white" />
            </div>
          </div>
        </Card>

        <Card variant="bordered" className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <Text variant="small" className="text-gray-600">Response Rate</Text>
              <Heading level={3} className="text-green-600 mt-1">94%</Heading>
              <Text variant="small" className="text-green-600 mt-1">+5% increase</Text>
            </div>
            <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Rating Distribution */}
        <Card variant="elevated" className="p-6">
          <Heading level={4} className="text-gray-900 mb-4">Rating Distribution</Heading>
          <div className="space-y-3">
            {ratingDistribution.map((item) => (
              <div key={item.rating} className="flex items-center gap-3">
                <div className="flex items-center gap-1 w-12">
                  <Text variant="small" className="font-medium text-gray-700">{item.rating}</Text>
                  <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                </div>
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div
                    className="h-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-full"
                    style={{ width: `${item.percentage}%` }}
                  ></div>
                </div>
                <Text variant="small" className="text-gray-600 w-12 text-right">
                  {item.count}
                </Text>
              </div>
            ))}
          </div>
        </Card>

        {/* Reviews List */}
        <Card variant="elevated" className="lg:col-span-3 p-6">
          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search reviews..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>

            <select
              value={selectedRating}
              onChange={(e) => setSelectedRating(e.target.value)}
              className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              {ratings.map((rating) => (
                <option key={rating} value={rating}>
                  {rating === "all" ? "All Ratings" : `${rating} Stars`}
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

          {/* Reviews */}
          <div className="space-y-4">
            {filteredReviews.map((review) => (
              <div key={review.id} className="p-5 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start gap-3">
                    <div className="h-12 w-12 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-2xl">
                      {review.customer.avatar}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <Text className="font-semibold text-gray-900">{review.customer.name}</Text>
                        {review.customer.verified && (
                          <CheckCircle className="h-4 w-4 text-green-600 fill-green-600" />
                        )}
                      </div>
                      <Text variant="small" className="text-gray-500">{review.product}</Text>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < review.rating
                              ? "fill-amber-400 text-amber-400"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      review.status === "approved" ? "bg-green-100 text-green-700" :
                      review.status === "pending" ? "bg-yellow-100 text-yellow-700" :
                      "bg-red-100 text-red-700"
                    }`}>
                      {review.status}
                    </span>
                  </div>
                </div>

                <Text className="text-gray-700 mb-3">{review.comment}</Text>

                {review.images && review.images.length > 0 && (
                  <div className="flex gap-2 mb-3">
                    {review.images.map((img, idx) => (
                      <div key={idx} className="h-16 w-16 bg-gray-200 rounded-lg flex items-center justify-center text-2xl">
                        {img}
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                  <div className="flex items-center gap-4">
                    <Text variant="small" className="text-gray-500">
                      {new Date(review.date).toLocaleDateString()}
                    </Text>
                    <div className="flex items-center gap-1">
                      <ThumbsUp className="h-4 w-4 text-gray-400" />
                      <Text variant="small" className="text-gray-600">{review.helpful} helpful</Text>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    {review.status === "pending" && (
                      <>
                        <Button
                          size="sm"
                          onClick={() => handleApprove(review.id)}
                          className="gap-2 bg-green-600 hover:bg-green-700"
                        >
                          <CheckCircle className="h-4 w-4" />
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleReject(review.id)}
                          className="gap-2 text-red-600 border-red-600 hover:bg-red-50"
                        >
                          <XCircle className="h-4 w-4" />
                          Reject
                        </Button>
                      </>
                    )}
                    <button
                      onClick={() => handleDelete(review.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}