"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  Search, Download, Eye, CheckCircle, Clock, XCircle,
  Package, Truck, MoreVertical, Calendar, DollarSign, RefreshCw,
} from "lucide-react";
import { Card, Heading, Text, Button, Loading } from "@/components/elements";
import { useToast } from "@/components/elements/useToast";
import apiClient from "@/lib/api/client";

type Order = {
  id: number;
  order_number: string;
  total_amount: number;
  order_status: "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled";
  payment_status: "pending" | "paid" | "failed" | "refunded";
  created_at: string;
  customer: {
    id: number;
    name: string;
    email: string;
    phone?: string;
  };
  payment?: {
    method: string;
    transaction_id?: string;
    amount: number;
    status: string;
  } | null;
};

const STATUS_CONFIG = {
  pending:    { color: "bg-yellow-100 text-yellow-700 border-yellow-200", icon: Clock,         label: "Pending"    },
  confirmed:  { color: "bg-blue-100 text-blue-700 border-blue-200",       icon: CheckCircle,   label: "Confirmed"  },
  processing: { color: "bg-indigo-100 text-indigo-700 border-indigo-200", icon: Package,       label: "Processing" },
  shipped:    { color: "bg-purple-100 text-purple-700 border-purple-200", icon: Truck,         label: "Shipped"    },
  delivered:  { color: "bg-green-100 text-green-700 border-green-200",    icon: CheckCircle,   label: "Delivered"  },
  cancelled:  { color: "bg-red-100 text-red-700 border-red-200",          icon: XCircle,       label: "Cancelled"  },
};

const PAYMENT_COLOR = {
  paid:     "bg-green-100 text-green-700",
  pending:  "bg-yellow-100 text-yellow-700",
  failed:   "bg-red-100 text-red-700",
  refunded: "bg-gray-100 text-gray-600",
};

const ORDER_STATUSES  = ["all", "pending", "confirmed", "processing", "shipped", "delivered", "cancelled"];
const PAYMENT_STATUSES = ["all", "paid", "pending", "failed", "refunded"];

export default function OrdersPage() {
  const { showToast } = useToast();

  const [orders, setOrders]               = useState<Order[]>([]);
  const [loading, setLoading]             = useState(true);
  const [searchQuery, setSearchQuery]     = useState("");
  const [selectedStatus, setSelectedStatus]   = useState("all");
  const [selectedPayment, setSelectedPayment] = useState("all");

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchQuery)                 params.set("search", searchQuery);
      if (selectedStatus !== "all")    params.set("order_status", selectedStatus);
      if (selectedPayment !== "all")   params.set("payment_status", selectedPayment);

      const data = await apiClient.get<{ data: Order[] }>(`/admin/orders?${params}`);
      setOrders(data.data ?? []);
    } catch (err: any) {
      showToast(err.message || "Failed to load orders", "error");
    } finally {
      setLoading(false);
    }
  }, [searchQuery, selectedStatus, selectedPayment]);

  useEffect(() => {
    const t = setTimeout(() => fetchOrders(), 400);
    return () => clearTimeout(t);
  }, [fetchOrders]);

  const handleExport = () => {
    showToast("Exporting orders to CSV...", "success");
  };

  const totalRevenue    = orders.reduce((sum, o) => sum + o.total_amount, 0);
  const pendingOrders   = orders.filter((o) => o.order_status === "pending").length;
  const processingOrders = orders.filter((o) => o.order_status === "processing").length;

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Heading level={2} className="text-gray-900">Orders</Heading>
          <Text variant="small" className="text-gray-600 mt-1">Manage and track your customer orders</Text>
        </div>
        <div className="flex gap-3">
          <Button
            variant="ghost"
            onClick={fetchOrders}
            aria-label="Refresh orders"
            className="border border-gray-200 gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          </Button>
          <Button variant="outline" onClick={handleExport} className="gap-2">
            <Download className="h-5 w-5" />
            Export
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: "Total Orders",   value: orders.length,    color: "text-gray-900",   gradient: "from-purple-500 to-pink-500",   icon: Package      },
          { label: "Total Revenue",  value: `₹${totalRevenue.toLocaleString("en-IN")}`, color: "text-green-600", gradient: "from-green-500 to-emerald-500", icon: DollarSign },
          { label: "Pending",        value: pendingOrders,    color: "text-yellow-600", gradient: "from-yellow-500 to-orange-500", icon: Clock        },
          { label: "Processing",     value: processingOrders, color: "text-blue-600",   gradient: "from-blue-500 to-indigo-500",   icon: Package      },
        ].map(({ label, value, color, gradient, icon: Icon }) => (
          <Card key={label} variant="bordered" className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <Text variant="small" className="text-gray-600">{label}</Text>
                <Heading level={3} className={`${color} mt-1`}>{value}</Heading>
              </div>
              <div className={`h-12 w-12 rounded-lg bg-gradient-to-br ${gradient} flex items-center justify-center`}>
                <Icon className="h-6 w-6 text-white" />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <Card variant="elevated" className="p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by order number, customer name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <select
            aria-label="Filter by order status"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            {ORDER_STATUSES.map((s) => (
              <option key={s} value={s}>
                {s === "all" ? "All Status" : s.charAt(0).toUpperCase() + s.slice(1)}
              </option>
            ))}
          </select>
          <select
            aria-label="Filter by payment status"
            value={selectedPayment}
            onChange={(e) => setSelectedPayment(e.target.value)}
            className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            {PAYMENT_STATUSES.map((s) => (
              <option key={s} value={s}>
                {s === "all" ? "All Payments" : s.charAt(0).toUpperCase() + s.slice(1)}
              </option>
            ))}
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
                  {["Order ID", "Customer", "Date", "Total", "Payment", "Status", "Actions"].map((h) => (
                    <th key={h} className={`px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider ${h === "Actions" ? "text-right" : "text-left"}`}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {orders.map((order) => {
                  const statusCfg = STATUS_CONFIG[order.order_status] ?? STATUS_CONFIG.pending;
                  const StatusIcon = statusCfg.icon;
                  return (
                    <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <Text className="font-semibold text-purple-600">{order.order_number}</Text>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <Text className="font-semibold text-gray-900">{order.customer.name}</Text>
                          <Text variant="small" className="text-gray-500">{order.customer.email}</Text>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-gray-700">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          <Text>{new Date(order.created_at).toLocaleDateString("en-IN")}</Text>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <Text className="font-semibold text-gray-900">₹{order.total_amount.toLocaleString("en-IN")}</Text>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${PAYMENT_COLOR[order.payment_status] ?? "bg-gray-100 text-gray-600"}`}>
                          {order.payment_status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border ${statusCfg.color}`}>
                          <StatusIcon className="h-4 w-4" />
                          <span className="text-xs font-medium">{statusCfg.label}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <Link href={`/admin/orders/${order.id}`}>
                            <Button variant="ghost" aria-label={`View order ${order.order_number}`} className="p-2 text-purple-600 hover:bg-purple-50">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </Link>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {orders.length === 0 && !loading && (
              <div className="text-center py-12">
                <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <Heading level={4} className="text-gray-900 mb-2" align="center">No orders found</Heading>
                <Text className="text-gray-600" align="center">Try adjusting your search or filters</Text>
              </div>
            )}
          </div>
        )}
      </Card>
    </div>
  );
}