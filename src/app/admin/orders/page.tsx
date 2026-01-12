"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Search,
  Filter,
  Download,
  Eye,
  CheckCircle,
  Clock,
  XCircle,
  Package,
  Truck,
  MoreVertical,
  Calendar,
  DollarSign,
} from "lucide-react";
import { Card, Heading, Text, Button } from "@/components/elements";
import { useToast } from "@/components/elements/useToast";

type Order = {
  id: string;
  customer: {
    name: string;
    email: string;
    avatar: string;
  };
  items: number;
  total: number;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  date: string;
  paymentStatus: "paid" | "pending" | "failed";
};

export default function OrdersPage() {
  const { showToast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedPayment, setSelectedPayment] = useState("all");

  const orders: Order[] = [
    {
      id: "ORD-1238",
      customer: {
        name: "Sarah Johnson",
        email: "sarah.j@email.com",
        avatar: "👩",
      },
      items: 2,
      total: 3398,
      status: "delivered",
      date: "2024-01-10",
      paymentStatus: "paid",
    },
    {
      id: "ORD-1237",
      customer: {
        name: "Mike Chen",
        email: "mike.chen@email.com",
        avatar: "👨",
      },
      items: 1,
      total: 899,
      status: "shipped",
      date: "2024-01-10",
      paymentStatus: "paid",
    },
    {
      id: "ORD-1236",
      customer: {
        name: "Emily Davis",
        email: "emily.d@email.com",
        avatar: "👩‍🦰",
      },
      items: 3,
      total: 4197,
      status: "processing",
      date: "2024-01-09",
      paymentStatus: "paid",
    },
    {
      id: "ORD-1235",
      customer: {
        name: "Alex Kumar",
        email: "alex.k@email.com",
        avatar: "👨‍💼",
      },
      items: 1,
      total: 1899,
      status: "pending",
      date: "2024-01-09",
      paymentStatus: "pending",
    },
    {
      id: "ORD-1234",
      customer: {
        name: "Lisa Wang",
        email: "lisa.w@email.com",
        avatar: "👩‍💻",
      },
      items: 2,
      total: 2898,
      status: "cancelled",
      date: "2024-01-08",
      paymentStatus: "failed",
    },
    {
      id: "ORD-1233",
      customer: {
        name: "David Brown",
        email: "david.b@email.com",
        avatar: "👨‍🦱",
      },
      items: 4,
      total: 5996,
      status: "delivered",
      date: "2024-01-07",
      paymentStatus: "paid",
    },
  ];

  const statuses = ["all", "pending", "processing", "shipped", "delivered", "cancelled"];
  const paymentStatuses = ["all", "paid", "pending", "failed"];

  const getStatusConfig = (status: Order["status"]) => {
    const configs = {
      pending: {
        color: "bg-yellow-100 text-yellow-700 border-yellow-200",
        icon: Clock,
        label: "Pending",
      },
      processing: {
        color: "bg-blue-100 text-blue-700 border-blue-200",
        icon: Package,
        label: "Processing",
      },
      shipped: {
        color: "bg-purple-100 text-purple-700 border-purple-200",
        icon: Truck,
        label: "Shipped",
      },
      delivered: {
        color: "bg-green-100 text-green-700 border-green-200",
        icon: CheckCircle,
        label: "Delivered",
      },
      cancelled: {
        color: "bg-red-100 text-red-700 border-red-200",
        icon: XCircle,
        label: "Cancelled",
      },
    };
    return configs[status];
  };

  const getPaymentColor = (status: Order["paymentStatus"]) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-700";
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      case "failed":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const handleStatusUpdate = (orderId: string, newStatus: Order["status"]) => {
    showToast(`Order ${orderId} updated to ${newStatus}`, "success");
  };

  const handleExport = () => {
    showToast("Exporting orders to CSV...", "success");
  };

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatus === "all" || order.status === selectedStatus;
    const matchesPayment = selectedPayment === "all" || order.paymentStatus === selectedPayment;
    return matchesSearch && matchesStatus && matchesPayment;
  });

  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
  const pendingOrders = orders.filter((o) => o.status === "pending").length;
  const processingOrders = orders.filter((o) => o.status === "processing").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Heading level={2} className="text-gray-900">
            Orders
          </Heading>
          <Text variant="small" className="text-gray-600 mt-1">
            Manage and track your customer orders
          </Text>
        </div>
        <Button onClick={handleExport} variant="outline" className="gap-2">
          <Download className="h-5 w-5" />
          Export
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card variant="bordered" className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <Text variant="small" className="text-gray-600">Total Orders</Text>
              <Heading level={3} className="text-gray-900 mt-1">{orders.length}</Heading>
            </div>
            <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <Package className="h-6 w-6 text-white" />
            </div>
          </div>
        </Card>

        <Card variant="bordered" className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <Text variant="small" className="text-gray-600">Total Revenue</Text>
              <Heading level={3} className="text-green-600 mt-1">₹{totalRevenue.toLocaleString()}</Heading>
            </div>
            <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
              <DollarSign className="h-6 w-6 text-white" />
            </div>
          </div>
        </Card>

        <Card variant="bordered" className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <Text variant="small" className="text-gray-600">Pending</Text>
              <Heading level={3} className="text-yellow-600 mt-1">{pendingOrders}</Heading>
            </div>
            <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center">
              <Clock className="h-6 w-6 text-white" />
            </div>
          </div>
        </Card>

        <Card variant="bordered" className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <Text variant="small" className="text-gray-600">Processing</Text>
              <Heading level={3} className="text-blue-600 mt-1">{processingOrders}</Heading>
            </div>
            <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center">
              <Package className="h-6 w-6 text-white" />
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
                placeholder="Search by order ID, customer name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>

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

          <select
            value={selectedPayment}
            onChange={(e) => setSelectedPayment(e.target.value)}
            className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            {paymentStatuses.map((status) => (
              <option key={status} value={status}>
                {status === "all" ? "All Payments" : status.charAt(0).toUpperCase() + status.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </Card>

      {/* Orders Table */}
      <Card variant="elevated" className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Items
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Payment
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
              {filteredOrders.map((order) => {
                const statusConfig = getStatusConfig(order.status);
                const StatusIcon = statusConfig.icon;

                return (
                  <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <Text className="font-semibold text-purple-600">{order.id}</Text>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-xl">
                          {order.customer.avatar}
                        </div>
                        <div>
                          <Text className="font-semibold text-gray-900">{order.customer.name}</Text>
                          <Text variant="small" className="text-gray-500">{order.customer.email}</Text>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-gray-700">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <Text>{new Date(order.date).toLocaleDateString()}</Text>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Text className="text-gray-700">{order.items} items</Text>
                    </td>
                    <td className="px-6 py-4">
                      <Text className="font-semibold text-gray-900">₹{order.total.toLocaleString()}</Text>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPaymentColor(order.paymentStatus)}`}>
                        {order.paymentStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border ${statusConfig.color}`}>
                        <StatusIcon className="h-4 w-4" />
                        <span className="text-xs font-medium">{statusConfig.label}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link href={`/admin/orders/${order.id}`}>
                          <button className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors">
                            <Eye className="h-4 w-4" />
                          </button>
                        </Link>
                        <div className="relative group">
                          <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                            <MoreVertical className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredOrders.length === 0 && (
          <div className="text-center py-12">
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <Heading level={4} className="text-gray-900 mb-2">No orders found</Heading>
            <Text className="text-gray-600">Try adjusting your search or filters</Text>
          </div>
        )}
      </Card>
    </div>
  );
}