"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Package, ShoppingCart, Users, DollarSign, Eye,
  Star, ArrowUpRight, ArrowDownRight, TrendingUp,
  AlertTriangle, MessageSquare, RefreshCw,
} from "lucide-react";
import { Card, Heading, Text, Button, Loading } from "@/components/elements";
import apiClient from "@/lib/api/client";
import { useDialog } from "@/components/elements";

type Stats = {
  total_revenue: number;
  total_orders: number;
  total_products: number;
  total_customers: number;
  revenue_growth: number;
  orders_growth: number;
  revenue_this_month: number;
  orders_this_month: number;
};

type RecentOrder = {
  id: number;
  customer: string;
  email: string;
  total: number;
  status: "pending" | "processing" | "completed" | "cancelled";
  created_at: string;
};

type TopProduct = {
  id: number;
  name: string;
  sales_count: number;
  revenue: number;
  stock: number;
  image: string | null;
};

type RevenuePoint = { month: string; revenue: number };

type LowStockItem = { id: number; name: string; stock: number; image: string | null };

type RecentReview = {
  id: number;
  customer: string;
  product: string;
  rating: number;
  comment: string;
  created_at: string;
};

type DashboardData = {
  stats: Stats;
  recent_orders: RecentOrder[];
  top_products: TopProduct[];
  revenue_chart: RevenuePoint[];
  order_statuses: Record<string, number>;
  low_stock: LowStockItem[];
  recent_reviews: RecentReview[];
};

const STATUS_COLORS: Record<string, string> = {
  completed:  "bg-green-100 text-green-700",
  processing: "bg-blue-100 text-blue-700",
  pending:    "bg-yellow-100 text-yellow-700",
  cancelled:  "bg-red-100 text-red-700",
};

const STAT_META = [
  { key: "total_revenue",   label: "Total Revenue",    format: (v: number) => `₹${v.toLocaleString("en-IN")}`, growthKey: "revenue_growth", Icon: DollarSign, bg: "from-purple-500 to-purple-600" },
  { key: "total_orders",    label: "Total Orders",     format: (v: number) => v.toLocaleString(),               growthKey: "orders_growth",  Icon: ShoppingCart, bg: "from-blue-500 to-blue-600"   },
  { key: "total_products",  label: "Total Products",   format: (v: number) => v.toLocaleString(),               growthKey: null,             Icon: Package,    bg: "from-pink-500 to-pink-600"     },
  { key: "total_customers", label: "Total Customers",  format: (v: number) => v.toLocaleString(),               growthKey: null,             Icon: Users,      bg: "from-green-500 to-green-600"   },
];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1,2,3,4,5].map((s) => (
        <Star key={s} className={`h-3 w-3 ${s <= rating ? "text-yellow-400 fill-yellow-400" : "text-gray-200 fill-gray-200"}`} />
      ))}
    </div>
  );
}

function BarChart({ data }: { data: RevenuePoint[] }) {
  const max = Math.max(...data.map((d) => d.revenue), 1);
  return (
    <div className="flex items-end gap-2 h-28">
      {data.map((d, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-1">
          <div
            className="w-full rounded-t-md bg-gradient-to-t from-purple-500 to-pink-400 transition-all"
            style={{ height: `${Math.max((d.revenue / max) * 100, 4)}%` }}
            title={`₹${d.revenue.toLocaleString("en-IN")}`}
          />
          <Text variant="small" className="text-gray-400 text-[10px] leading-none">
            {d.month.split(" ")[0]}
          </Text>
        </div>
      ))}
    </div>
  );
}

export default function AdminDashboard() {
  const dialog = useDialog();
  const [data, setData]       = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboard = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get<{ success: boolean; data: DashboardData }>("/admin/dashboard");
      setData(res.data);
    } catch (err: any) {
      await dialog.warn(err.message || "Failed to load dashboard.", "Error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchDashboard(); }, []);

  if (loading || !data) {
    return (
      <Loading />
    );
  }

  const { stats, recent_orders, top_products, revenue_chart, low_stock, recent_reviews, order_statuses } = data;

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Heading level={2} className="text-gray-900">Dashboard Overview</Heading>
          <Text variant="small" className="text-gray-600 mt-1">
            Here's what's happening with your store today.
          </Text>
        </div>
        <div className="flex gap-3">
          <Button variant="ghost" onClick={fetchDashboard} aria-label="Refresh dashboard" className="p-2.5 border border-gray-200">
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          </Button>
          <Link href="/admin/products/new">
            <Button variant="primary" className="gap-2"><Package className="h-4 w-4" /> Add Product</Button>
          </Link>
          <Link href="/admin/orders">
            <Button variant="ghost" className="gap-2 border border-gray-200"><ShoppingCart className="h-4 w-4" /> Orders</Button>
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {STAT_META.map(({ key, label, format, growthKey, Icon, bg }) => {
          const value  = stats[key as keyof Stats] as number;
          const growth = growthKey ? stats[growthKey as keyof Stats] as number : null;
          const up     = (growth ?? 0) >= 0;
          const TrendIcon = up ? ArrowUpRight : ArrowDownRight;
          return (
            <Card key={key} variant="elevated" className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <Text variant="small" className="text-gray-500 font-medium">{label}</Text>
                  <Heading level={3} className="text-gray-900 mt-1">{format(value)}</Heading>
                  {growth !== null && (
                    <div className="flex items-center gap-1 mt-2">
                      <TrendIcon className={`h-3.5 w-3.5 ${up ? "text-green-600" : "text-red-500"}`} />
                      <Text variant="small" className={`font-semibold ${up ? "text-green-600" : "text-red-500"}`}>
                        {Math.abs(growth)}%
                      </Text>
                      <Text variant="small" className="text-gray-400">vs last month</Text>
                    </div>
                  )}
                </div>
                <div className={`h-11 w-11 rounded-xl bg-gradient-to-br ${bg} flex items-center justify-center shadow-md flex-shrink-0`}>
                  <Icon className="h-5 w-5 text-white" />
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Revenue chart + Order statuses */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card variant="elevated" className="lg:col-span-2 p-6">
          <div className="flex items-center justify-between mb-4">
            <Heading level={4} className="text-gray-900">Revenue (last 6 months)</Heading>
            <Text variant="small" className="text-gray-500">
              This month: ₹{stats.revenue_this_month.toLocaleString("en-IN")}
            </Text>
          </div>
          <BarChart data={revenue_chart} />
        </Card>

        <Card variant="elevated" className="p-6">
          <Heading level={4} className="text-gray-900 mb-4">Order Breakdown</Heading>
          <div className="space-y-3">
            {Object.entries(order_statuses).map(([status, count]) => {
              const total = Object.values(order_statuses).reduce((a, b) => a + b, 0);
              const pct   = total ? Math.round((count / total) * 100) : 0;
              return (
                <div key={status}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[status] ?? "bg-gray-100 text-gray-700"}`}>
                        {status}
                      </span>
                    </div>
                    <Text variant="small" className="text-gray-600 font-medium">{count}</Text>
                  </div>
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-purple-500 to-pink-400 rounded-full" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      {/* Recent Orders + Top Products */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        <Card variant="elevated" className="lg:col-span-2 p-6">
          <div className="flex items-center justify-between mb-5">
            <Heading level={4} className="text-gray-900">Recent Orders</Heading>
            <Link href="/admin/orders">
              <Button variant="ghost" className="text-sm border border-gray-200">View All</Button>
            </Link>
          </div>
          <div className="space-y-3">
            {recent_orders.map((order) => (
              <Link key={order.id} href={`/admin/orders/${order.id}`}>
                <div className="flex items-center justify-between p-3.5 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors cursor-pointer">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <Text className="font-semibold text-gray-900 text-sm">#{order.id}</Text>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[order.status] ?? "bg-gray-100 text-gray-700"}`}>
                        {order.status}
                      </span>
                    </div>
                    <Text variant="small" className="text-gray-500 truncate mt-0.5">{order.customer}</Text>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <Text className="font-bold text-purple-600 text-sm">₹{Number(order.total).toLocaleString("en-IN")}</Text>
                    <Text variant="small" className="text-gray-400">
                      {new Date(order.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                    </Text>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </Card>

        <Card variant="elevated" className="p-6">
          <div className="flex items-center justify-between mb-5">
            <Heading level={4} className="text-gray-900">Top Products</Heading>
            <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
          </div>
          <div className="space-y-3">
            {top_products.map((product, i) => (
              <Link key={product.id} href={`/admin/products/${product.id}`}>
                <div className="flex items-center gap-3 p-3 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors cursor-pointer">
                  <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center flex-shrink-0 overflow-hidden">
                    {product.image
                      ? <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
                      : <Package className="h-5 w-5 text-purple-400" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <Text className="font-semibold text-gray-900 text-sm truncate">{product.name}</Text>
                    <Text variant="small" className="text-gray-500">{product.sales_count} sold · ₹{Number(product.revenue).toLocaleString("en-IN")}</Text>
                  </div>
                  <div className="h-7 w-7 rounded-full bg-purple-100 text-purple-700 font-bold text-xs flex items-center justify-center flex-shrink-0">
                    #{i + 1}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </Card>
      </div>

      {/* Low Stock + Recent Reviews */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        <Card variant="elevated" className="p-6">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <Heading level={4} className="text-gray-900">Low Stock Alerts</Heading>
              {low_stock.length > 0 && (
                <span className="h-5 w-5 rounded-full bg-red-100 text-red-600 text-xs font-bold flex items-center justify-center">
                  {low_stock.length}
                </span>
              )}
            </div>
            <Link href="/admin/products"><Button variant="ghost" className="text-sm border border-gray-200">Manage</Button></Link>
          </div>
          {low_stock.length === 0 ? (
            <div className="text-center py-8">
              <Package className="h-10 w-10 text-gray-200 mx-auto mb-2" />
              <Text className="text-gray-400">All products are well stocked</Text>
            </div>
          ) : (
            <div className="space-y-3">
              {low_stock.map((item) => (
                <Link key={item.id} href={`/admin/products/${item.id}/edit`}>
                  <div className="flex items-center gap-3 p-3 bg-red-50 hover:bg-red-100 rounded-xl transition-colors cursor-pointer">
                    <div className="h-9 w-9 rounded-lg bg-red-100 flex items-center justify-center flex-shrink-0 overflow-hidden">
                      {item.image
                        ? <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                        : <AlertTriangle className="h-4 w-4 text-red-500" />}
                    </div>
                    <Text className="flex-1 font-medium text-gray-900 text-sm truncate">{item.name}</Text>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold flex-shrink-0 ${item.stock === 0 ? "bg-red-200 text-red-700" : "bg-orange-100 text-orange-700"}`}>
                      {item.stock === 0 ? "Out" : `${item.stock} left`}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </Card>

        <Card variant="elevated" className="p-6">
          <div className="flex items-center justify-between mb-5">
            <Heading level={4} className="text-gray-900">Recent Reviews</Heading>
            <Link href="/admin/reviews"><Button variant="ghost" className="text-sm border border-gray-200">View All</Button></Link>
          </div>
          <div className="space-y-3">
            {recent_reviews.map((review) => (
              <div key={review.id} className="p-3 bg-gray-50 rounded-xl">
                <div className="flex items-center justify-between mb-1">
                  <Text className="font-semibold text-gray-900 text-sm">{review.customer}</Text>
                  <StarRating rating={review.rating} />
                </div>
                <Text variant="small" className="text-gray-500 truncate">{review.product}</Text>
                {review.comment && (
                  <Text variant="small" className="text-gray-600 mt-1 line-clamp-2">{review.comment}</Text>
                )}
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card variant="elevated" className="p-6">
        <Heading level={4} className="text-gray-900 mb-4">Quick Actions</Heading>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Add Product",  Icon: Package,      from: "from-purple-50 to-pink-50",   iconColor: "text-purple-600", href: "/admin/products/new" },
            { label: "View Orders",  Icon: ShoppingCart, from: "from-blue-50 to-indigo-50",   iconColor: "text-blue-600",   href: "/admin/orders"       },
            { label: "Customers",    Icon: Users,        from: "from-green-50 to-emerald-50", iconColor: "text-green-600",  href: "/admin/customers"    },
            { label: "Analytics",    Icon: TrendingUp,   from: "from-rose-50 to-pink-50",     iconColor: "text-rose-600",   href: "/admin/analytics"    },
          ].map(({ label, Icon, from, iconColor, href }) => (
            <Link key={href} href={href}>
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