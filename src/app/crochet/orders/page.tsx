"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import {
  Card,
  Heading,
  Text,
  Button,
} from "@/components/elements";
import {
  Package,
  Clock,
  CheckCircle,
  XCircle,
  Truck,
  Eye,
  Download,
  Search,
} from "lucide-react";

// Mock orders data
const ORDERS = [
  {
    id: "ORD-2024-001",
    date: "2024-01-08",
    status: "delivered",
    total: 1299.99,
    items: [
      {
        name: "Handmade Crochet Blanket",
        quantity: 1,
        price: 899.99,
        image: "🧶",
      },
      {
        name: "Amigurumi Bear",
        quantity: 2,
        price: 199.99,
        image: "🧸",
      },
    ],
  },
  {
    id: "ORD-2024-002",
    date: "2024-01-05",
    status: "processing",
    total: 599.99,
    items: [
      {
        name: "Crochet Tote Bag",
        quantity: 1,
        price: 599.99,
        image: "👜",
      },
    ],
  },
  {
    id: "ORD-2024-003",
    date: "2024-01-02",
    status: "shipped",
    total: 1499.99,
    items: [
      {
        name: "Custom Baby Blanket",
        quantity: 1,
        price: 1499.99,
        image: "🧣",
      },
    ],
  },
  {
    id: "ORD-2023-112",
    date: "2023-12-28",
    status: "cancelled",
    total: 399.99,
    items: [
      {
        name: "Crochet Cushion Cover",
        quantity: 2,
        price: 199.99,
        image: "🛋️",
      },
    ],
  },
];

const STATUS_CONFIG = {
  processing: {
    label: "Processing",
    icon: Clock,
    color: "bg-blue-100 text-blue-700 border-blue-200",
    gradient: "from-blue-500 to-blue-600",
  },
  shipped: {
    label: "Shipped",
    icon: Truck,
    color: "bg-purple-100 text-purple-700 border-purple-200",
    gradient: "from-purple-500 to-purple-600",
  },
  delivered: {
    label: "Delivered",
    icon: CheckCircle,
    color: "bg-green-100 text-green-700 border-green-200",
    gradient: "from-green-500 to-green-600",
  },
  cancelled: {
    label: "Cancelled",
    icon: XCircle,
    color: "bg-red-100 text-red-700 border-red-200",
    gradient: "from-red-500 to-red-600",
  },
};

export default function OrdersPage() {
  const { user } = useAuth();
  const [filter, setFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredOrders = ORDERS.filter((order) => {
    const matchesFilter = filter === "all" || order.status === filter;
    const matchesSearch =
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.items.some((item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    return matchesFilter && matchesSearch;
  });

  return (
    <ProtectedRoute requiredPermission="view-own-orders">
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          {/* Header */}
          <div className="mb-8">
            <Heading level={1} gradient className="mb-2">
              My Orders
            </Heading>
            <Text variant="muted">
              Track and manage your orders
            </Text>
          </div>

          {/* Filters & Search */}
          <Card variant="elevated" className="p-6 mb-6">
            <div className="flex flex-col md:flex-row gap-4 justify-between">
              {/* Filter Buttons */}
              <div className="flex flex-wrap gap-2">
                <FilterButton
                  active={filter === "all"}
                  onClick={() => setFilter("all")}
                >
                  All Orders
                </FilterButton>
                <FilterButton
                  active={filter === "processing"}
                  onClick={() => setFilter("processing")}
                >
                  Processing
                </FilterButton>
                <FilterButton
                  active={filter === "shipped"}
                  onClick={() => setFilter("shipped")}
                >
                  Shipped
                </FilterButton>
                <FilterButton
                  active={filter === "delivered"}
                  onClick={() => setFilter("delivered")}
                >
                  Delivered
                </FilterButton>
              </div>

              {/* Search */}
              <div className="relative w-full md:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search orders..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-200 transition"
                />
              </div>
            </div>
          </Card>

          {/* Orders List */}
          {filteredOrders.length === 0 ? (
            <Card variant="elevated" className="p-12 text-center">
              <div className="flex flex-col items-center gap-4">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-purple-100 to-pink-100">
                  <Package className="h-10 w-10 text-purple-600" />
                </div>
                <Heading level={3}>No orders found</Heading>
                <Text variant="muted" className="max-w-md">
                  {searchQuery
                    ? "Try adjusting your search or filters"
                    : "You haven't placed any orders yet. Start shopping to see your orders here!"}
                </Text>
                {!searchQuery && (
                  <Button className="mt-4">Browse Products</Button>
                )}
              </div>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredOrders.map((order) => (
                <OrderCard key={order.id} order={order} />
              ))}
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}

/* ---------------- Components ---------------- */

function OrderCard({ order }: { order: typeof ORDERS[0] }) {
  const [expanded, setExpanded] = useState(false);
  const statusConfig = STATUS_CONFIG[order.status as keyof typeof STATUS_CONFIG];
  const StatusIcon = statusConfig.icon;

  return (
    <Card variant="elevated" className="overflow-hidden">
      {/* Order Header */}
      <div className="p-6 bg-gradient-to-r from-purple-50 to-pink-50 border-b border-gray-200">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <Heading level={4}>{order.id}</Heading>
              <span
                className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold border ${statusConfig.color}`}
              >
                <StatusIcon className="h-3 w-3" />
                {statusConfig.label}
              </span>
            </div>
            <Text variant="small" className="text-gray-600">
              Ordered on {new Date(order.date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </Text>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <Text variant="small" className="text-gray-600">
                Total
              </Text>
              <Heading level={4} className="text-purple-600">
                ₹{order.total.toFixed(2)}
              </Heading>
            </div>
          </div>
        </div>
      </div>

      {/* Order Items */}
      <div className="p-6">
        <div className="space-y-4">
          {order.items.slice(0, expanded ? undefined : 1).map((item, idx) => (
            <div key={idx} className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-gradient-to-br from-purple-100 to-pink-100 text-3xl">
                {item.image}
              </div>
              <div className="flex-1">
                <Text className="font-medium">{item.name}</Text>
                <Text variant="small" className="text-gray-600">
                  Qty: {item.quantity} × ₹{item.price.toFixed(2)}
                </Text>
              </div>
              <Text className="font-semibold text-purple-600">
                ₹{(item.quantity * item.price).toFixed(2)}
              </Text>
            </div>
          ))}

          {order.items.length > 1 && !expanded && (
            <button
              onClick={() => setExpanded(true)}
              className="text-sm text-purple-600 hover:text-purple-700 font-medium"
            >
              + {order.items.length - 1} more item(s)
            </button>
          )}

          {expanded && order.items.length > 1 && (
            <button
              onClick={() => setExpanded(false)}
              className="text-sm text-purple-600 hover:text-purple-700 font-medium"
            >
              Show less
            </button>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3 mt-6 pt-6 border-t border-gray-200">
          <Button variant="outline" size="sm" className="gap-2">
            <Eye className="h-4 w-4" />
            View Details
          </Button>
          {order.status === "delivered" && (
            <Button variant="outline" size="sm" className="gap-2">
              <Download className="h-4 w-4" />
              Download Invoice
            </Button>
          )}
          {order.status === "processing" && (
            <Button variant="outline" size="sm" className="gap-2 text-red-600 border-red-200 hover:bg-red-50">
              <XCircle className="h-4 w-4" />
              Cancel Order
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}

function FilterButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
        active
          ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg"
          : "bg-white text-gray-700 border border-gray-200 hover:border-purple-300"
      }`}
    >
      {children}
    </button>
  );
}