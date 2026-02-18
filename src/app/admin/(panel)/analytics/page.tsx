"use client";

import { useState } from "react";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingCart,
  Users,
  Package,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  Download,
} from "lucide-react";
import { Card, Heading, Text, Button } from "@/components/elements";

type TimeRange = "7d" | "30d" | "90d" | "1y";

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState<TimeRange>("30d");

  const stats = [
    {
      title: "Total Revenue",
      value: "₹1,24,567",
      change: 12.5,
      trend: "up" as const,
      icon: DollarSign,
      color: "from-green-500 to-emerald-500",
    },
    {
      title: "Total Orders",
      value: "328",
      change: 8.2,
      trend: "up" as const,
      icon: ShoppingCart,
      color: "from-blue-500 to-indigo-500",
    },
    {
      title: "New Customers",
      value: "156",
      change: 15.3,
      trend: "up" as const,
      icon: Users,
      color: "from-purple-500 to-pink-500",
    },
    {
      title: "Products Sold",
      value: "892",
      change: -2.4,
      trend: "down" as const,
      icon: Package,
      color: "from-orange-500 to-rose-500",
    },
  ];

  const salesData = [
    { month: "Jan", revenue: 15000, orders: 45 },
    { month: "Feb", revenue: 18000, orders: 52 },
    { month: "Mar", revenue: 22000, orders: 68 },
    { month: "Apr", revenue: 19000, orders: 58 },
    { month: "May", revenue: 25000, orders: 75 },
    { month: "Jun", revenue: 28000, orders: 82 },
  ];

  const topProducts = [
    { name: "Cozy Crochet Blanket", sales: 145, revenue: 362355, trend: 12 },
    { name: "Amigurumi Bear", sales: 128, revenue: 115072, trend: 8 },
    { name: "Crochet Tote Bag", sales: 98, revenue: 127302, trend: -3 },
    { name: "Baby Blanket", sales: 87, revenue: 165213, trend: 15 },
    { name: "Pillow Cover Set", sales: 76, revenue: 121524, trend: 5 },
  ];

  const categoryBreakdown = [
    { category: "Blankets", percentage: 35, color: "bg-purple-500" },
    { category: "Toys", percentage: 28, color: "bg-pink-500" },
    { category: "Bags", percentage: 18, color: "bg-blue-500" },
    { category: "Home Decor", percentage: 12, color: "bg-green-500" },
    { category: "Others", percentage: 7, color: "bg-gray-400" },
  ];

  const customerInsights = [
    { metric: "Avg Order Value", value: "₹2,456", change: 8.2 },
    { metric: "Repeat Customer Rate", value: "34.5%", change: 5.3 },
    { metric: "Customer Lifetime Value", value: "₹8,923", change: 12.1 },
    { metric: "Cart Abandonment Rate", value: "23.4%", change: -3.2 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Heading level={2} className="text-gray-900">
            Analytics & Reports
          </Heading>
          <Text variant="small" className="text-gray-600 mt-1">
            Track your business performance and growth metrics
          </Text>
        </div>
        <div className="flex gap-3">
          <div className="flex gap-2 bg-white border border-gray-200 rounded-lg p-1">
            {(["7d", "30d", "90d", "1y"] as TimeRange[]).map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  timeRange === range
                    ? "bg-purple-600 text-white shadow-sm"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                {range === "7d" && "7 Days"}
                {range === "30d" && "30 Days"}
                {range === "90d" && "90 Days"}
                {range === "1y" && "1 Year"}
              </button>
            ))}
          </div>
          <Button variant="outline" className="gap-2">
            <Download className="h-5 w-5" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          const TrendIcon = stat.trend === "up" ? ArrowUpRight : ArrowDownRight;

          return (
            <Card key={index} variant="elevated" className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className={`h-12 w-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <div className={`flex items-center gap-1 px-2 py-1 rounded-full ${
                  stat.trend === "up" ? "bg-green-100" : "bg-red-100"
                }`}>
                  <TrendIcon className={`h-4 w-4 ${stat.trend === "up" ? "text-green-600" : "text-red-600"}`} />
                  <Text variant="small" className={`font-semibold ${stat.trend === "up" ? "text-green-600" : "text-red-600"}`}>
                    {Math.abs(stat.change)}%
                  </Text>
                </div>
              </div>
              <Text variant="small" className="text-gray-600 mb-1">
                {stat.title}
              </Text>
              <Heading level={3} className="text-gray-900">
                {stat.value}
              </Heading>
              <Text variant="small" className="text-gray-500 mt-2">
                vs previous period
              </Text>
            </Card>
          );
        })}
      </div>

      {/* Sales Chart & Top Products */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales Overview */}
        <Card variant="elevated" className="lg:col-span-2 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <Heading level={4} className="text-gray-900">Sales Overview</Heading>
              <Text variant="small" className="text-gray-600 mt-1">Monthly revenue and orders</Text>
            </div>
            <div className="flex gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                <Text variant="small" className="text-gray-600">Revenue</Text>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-pink-500"></div>
                <Text variant="small" className="text-gray-600">Orders</Text>
              </div>
            </div>
          </div>
          
          {/* Simple Bar Chart */}
          <div className="space-y-4">
            {salesData.map((data, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <Text variant="small" className="font-medium text-gray-700 w-12">{data.month}</Text>
                  <div className="flex-1 ml-4 flex gap-2">
                    <div className="flex-1 bg-gray-100 rounded-full h-8 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-end pr-2"
                        style={{ width: `${(data.revenue / 30000) * 100}%` }}
                      >
                        <Text variant="small" className="text-white font-semibold">
                          ₹{(data.revenue / 1000).toFixed(0)}k
                        </Text>
                      </div>
                    </div>
                    <div className="w-20 bg-gray-100 rounded-full h-8 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center"
                        style={{ width: `${(data.orders / 100) * 100}%` }}
                      >
                        <Text variant="small" className="text-white font-semibold">{data.orders}</Text>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Category Breakdown */}
        <Card variant="elevated" className="p-6">
          <Heading level={4} className="text-gray-900 mb-6">Category Sales</Heading>
          <div className="space-y-4">
            {categoryBreakdown.map((cat, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <Text variant="small" className="font-medium text-gray-700">{cat.category}</Text>
                  <Text variant="small" className="font-semibold text-gray-900">{cat.percentage}%</Text>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-full ${cat.color} rounded-full transition-all duration-500`}
                    style={{ width: `${cat.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Top Products & Customer Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Products */}
        <Card variant="elevated" className="p-6">
          <Heading level={4} className="text-gray-900 mb-6">Top Performing Products</Heading>
          <div className="space-y-4">
            {topProducts.map((product, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 text-white font-bold">
                    #{index + 1}
                  </div>
                  <div>
                    <Text className="font-semibold text-gray-900">{product.name}</Text>
                    <Text variant="small" className="text-gray-600">{product.sales} sales</Text>
                  </div>
                </div>
                <div className="text-right">
                  <Text className="font-semibold text-purple-600">₹{product.revenue.toLocaleString()}</Text>
                  <div className="flex items-center justify-end gap-1">
                    {product.trend > 0 ? (
                      <TrendingUp className="h-4 w-4 text-green-600" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-red-600" />
                    )}
                    <Text variant="small" className={product.trend > 0 ? "text-green-600" : "text-red-600"}>
                      {Math.abs(product.trend)}%
                    </Text>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Customer Insights */}
        <Card variant="elevated" className="p-6">
          <Heading level={4} className="text-gray-900 mb-6">Customer Insights</Heading>
          <div className="grid grid-cols-1 gap-4">
            {customerInsights.map((insight, index) => (
              <div key={index} className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg border border-purple-100">
                <div className="flex items-center justify-between">
                  <Text variant="small" className="text-gray-600">{insight.metric}</Text>
                  <div className={`flex items-center gap-1 ${insight.change > 0 ? "text-green-600" : "text-red-600"}`}>
                    {insight.change > 0 ? (
                      <TrendingUp className="h-4 w-4" />
                    ) : (
                      <TrendingDown className="h-4 w-4" />
                    )}
                    <Text variant="small" className="font-semibold">
                      {Math.abs(insight.change)}%
                    </Text>
                  </div>
                </div>
                <Heading level={4} className="text-gray-900 mt-2">{insight.value}</Heading>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}