"use client";

import { useState } from "react";
import {
  TrendingUp,
  TrendingDown,
  Package,
  ShoppingCart,
  Users,
  Heart,
  DollarSign,
  Eye,
  Star,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { Card, Heading, Text, Button } from "@/components/elements";
import Link from "next/link";

type StatCard = {
  title: string;
  value: string;
  change: number;
  trend: "up" | "down";
  icon: React.ElementType;
  color: string;
};

type RecentOrder = {
  id: string;
  customer: string;
  product: string;
  amount: number;
  status: "pending" | "processing" | "completed" | "cancelled";
  date: string;
};

type TopProduct = {
  id: number;
  name: string;
  sales: number;
  revenue: number;
  image: string;
};

export default function AdminDashboard() {
  const stats: StatCard[] = [
    {
      title: "Total Revenue",
      value: "₹45,231",
      change: 12.5,
      trend: "up",
      icon: DollarSign,
      color: "purple",
    },
    {
      title: "Total Orders",
      value: "328",
      change: 8.2,
      trend: "up",
      icon: ShoppingCart,
      color: "blue",
    },
    {
      title: "Total Products",
      value: "156",
      change: 3.1,
      trend: "up",
      icon: Package,
      color: "pink",
    },
    {
      title: "Total Customers",
      value: "892",
      change: 15.3,
      trend: "up",
      icon: Users,
      color: "green",
    },
    {
      title: "Custom Requests",
      value: "23",
      change: -2.4,
      trend: "down",
      icon: Heart,
      color: "rose",
    },
    {
      title: "Store Views",
      value: "12,459",
      change: 18.7,
      trend: "up",
      icon: Eye,
      color: "indigo",
    },
  ];

  const recentOrders: RecentOrder[] = [
    {
      id: "#ORD-1234",
      customer: "Sarah Johnson",
      product: "Cozy Crochet Blanket",
      amount: 2499,
      status: "completed",
      date: "2 hours ago",
    },
    {
      id: "#ORD-1235",
      customer: "Mike Chen",
      product: "Amigurumi Teddy Bear",
      amount: 899,
      status: "processing",
      date: "4 hours ago",
    },
    {
      id: "#ORD-1236",
      customer: "Emily Davis",
      product: "Crochet Tote Bag",
      amount: 1299,
      status: "pending",
      date: "5 hours ago",
    },
    {
      id: "#ORD-1237",
      customer: "Alex Kumar",
      product: "Baby Blanket Set",
      amount: 1899,
      status: "completed",
      date: "1 day ago",
    },
    {
      id: "#ORD-1238",
      customer: "Lisa Wang",
      product: "Custom Pillow Cover",
      amount: 1599,
      status: "processing",
      date: "1 day ago",
    },
  ];

  const topProducts: TopProduct[] = [
    {
      id: 1,
      name: "Cozy Crochet Blanket",
      sales: 45,
      revenue: 112455,
      image: "🧶",
    },
    {
      id: 2,
      name: "Amigurumi Bear",
      sales: 38,
      revenue: 34162,
      image: "🧸",
    },
    {
      id: 3,
      name: "Crochet Tote Bag",
      sales: 32,
      revenue: 41568,
      image: "👜",
    },
    {
      id: 4,
      name: "Baby Blanket",
      sales: 28,
      revenue: 53172,
      image: "👶",
    },
  ];

  const getStatusColor = (status: RecentOrder["status"]) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-700";
      case "processing":
        return "bg-blue-100 text-blue-700";
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      case "cancelled":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getColorClasses = (color: string) => {
    const colors: { [key: string]: string } = {
      purple: "from-purple-500 to-purple-600",
      blue: "from-blue-500 to-blue-600",
      pink: "from-pink-500 to-pink-600",
      green: "from-green-500 to-green-600",
      rose: "from-rose-500 to-rose-600",
      indigo: "from-indigo-500 to-indigo-600",
    };
    return colors[color] || colors.purple;
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <Heading level={2} className="text-gray-900">
            Dashboard Overview
          </Heading>
          <Text variant="small" className="text-gray-600 mt-1">
            Welcome back! Here's what's happening with your store today.
          </Text>
        </div>
        <div className="flex gap-3">
          <Link href="/admin/products/new">
            <Button size="sm">Add Product</Button>
          </Link>
          <Link href="/admin/orders">
            <Button variant="outline" size="sm">
              View Orders
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          const TrendIcon = stat.trend === "up" ? ArrowUpRight : ArrowDownRight;

          return (
            <Card key={index} variant="elevated" className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <Text variant="small" className="text-gray-600 font-medium">
                    {stat.title}
                  </Text>
                  <Heading level={3} className="text-gray-900 mt-2">
                    {stat.value}
                  </Heading>
                  <div className="flex items-center gap-1 mt-3">
                    <TrendIcon
                      className={`h-4 w-4 ${
                        stat.trend === "up" ? "text-green-600" : "text-red-600"
                      }`}
                    />
                    <Text
                      variant="small"
                      className={`font-semibold ${
                        stat.trend === "up" ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {Math.abs(stat.change)}%
                    </Text>
                    <Text variant="small" className="text-gray-500">
                      vs last month
                    </Text>
                  </div>
                </div>
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${getColorClasses(
                    stat.color
                  )} shadow-lg`}
                >
                  <Icon className="h-6 w-6 text-white" />
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Recent Orders & Top Products */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <Card variant="elevated" className="lg:col-span-2 p-6">
          <div className="flex items-center justify-between mb-6">
            <Heading level={4} className="text-gray-900">
              Recent Orders
            </Heading>
            <Link href="/admin/orders">
              <Button variant="ghost" size="sm">
                View All
              </Button>
            </Link>
          </div>
          <div className="space-y-4">
            {recentOrders.map((order) => (
              <div
                key={order.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <Text className="font-semibold text-gray-900">
                      {order.id}
                    </Text>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        order.status
                      )}`}
                    >
                      {order.status}
                    </span>
                  </div>
                  <Text variant="small" className="text-gray-600 mt-1">
                    {order.customer} • {order.product}
                  </Text>
                  <Text variant="small" className="text-gray-500 mt-1">
                    {order.date}
                  </Text>
                </div>
                <Heading level={5} className="text-purple-600">
                  ₹{order.amount}
                </Heading>
              </div>
            ))}
          </div>
        </Card>

        {/* Top Products */}
        <Card variant="elevated" className="p-6">
          <div className="flex items-center justify-between mb-6">
            <Heading level={4} className="text-gray-900">
              Top Products
            </Heading>
            <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
          </div>
          <div className="space-y-4">
            {topProducts.map((product, index) => (
              <div
                key={product.id}
                className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-purple-100 to-pink-100 text-2xl">
                  {product.image}
                </div>
                <div className="flex-1 min-w-0">
                  <Text className="font-semibold text-gray-900 truncate">
                    {product.name}
                  </Text>
                  <div className="flex items-center gap-2 mt-1">
                    <Text variant="small" className="text-gray-600">
                      {product.sales} sales
                    </Text>
                    <span className="text-gray-400">•</span>
                    <Text variant="small" className="text-green-600 font-semibold">
                      ₹{product.revenue.toLocaleString()}
                    </Text>
                  </div>
                </div>
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-100 text-purple-700 font-bold text-sm">
                  #{index + 1}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card variant="elevated" className="p-6">
        <Heading level={4} className="text-gray-900 mb-4">
          Quick Actions
        </Heading>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link href="/admin/products/new">
            <button className="flex flex-col items-center justify-center p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg hover:shadow-lg transition-all group">
              <Package className="h-8 w-8 text-purple-600 mb-2 group-hover:scale-110 transition-transform" />
              <Text className="font-semibold text-gray-900">Add Product</Text>
            </button>
          </Link>
          <Link href="/admin/orders">
            <button className="flex flex-col items-center justify-center p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg hover:shadow-lg transition-all group">
              <ShoppingCart className="h-8 w-8 text-blue-600 mb-2 group-hover:scale-110 transition-transform" />
              <Text className="font-semibold text-gray-900">View Orders</Text>
            </button>
          </Link>
          <Link href="/admin/customers">
            <button className="flex flex-col items-center justify-center p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg hover:shadow-lg transition-all group">
              <Users className="h-8 w-8 text-green-600 mb-2 group-hover:scale-110 transition-transform" />
              <Text className="font-semibold text-gray-900">Customers</Text>
            </button>
          </Link>
          <Link href="/admin/analytics">
            <button className="flex flex-col items-center justify-center p-6 bg-gradient-to-br from-rose-50 to-pink-50 rounded-lg hover:shadow-lg transition-all group">
              <TrendingUp className="h-8 w-8 text-rose-600 mb-2 group-hover:scale-110 transition-transform" />
              <Text className="font-semibold text-gray-900">Analytics</Text>
            </button>
          </Link>
        </div>
      </Card>
    </div>
  );
}