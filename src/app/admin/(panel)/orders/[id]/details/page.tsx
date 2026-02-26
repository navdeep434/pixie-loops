"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  ArrowLeft, Package, Truck, CheckCircle, Clock, XCircle,
  MapPin, Phone, Mail, Calendar, CreditCard, Printer,
  Download, MessageSquare, RefreshCw,
} from "lucide-react";
import { Card, Heading, Text, Button, Loading } from "@/components/elements";
import { useToast } from "@/components/elements/useToast";
import apiClient from "@/lib/api/client";

type OrderItem = {
  id: number;
  quantity: number;
  price: number;
  subtotal: number;
  product: {
    id: number;
    name: string;
    sku?: string;
    image?: string;
  };
};

type Order = {
  id: number;
  order_number: string;
  total_amount: number;
  order_status: "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled";
  payment_status: "pending" | "paid" | "failed" | "refunded";
  shipping_address: {
    street?: string;
    city?: string;
    state?: string;
    zip?: string;
    country?: string;
    [key: string]: any;
  } | null;
  created_at: string;
  updated_at: string;
  customer: {
    id: number;
    name: string;
    email: string;
    phone?: string;
  };
  payment?: {
    id: number;
    method: string;
    transaction_id?: string;
    amount: number;
    status: string;
  } | null;
  items?: OrderItem[];
};

const ORDER_STATUSES = ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"] as const;

const STATUS_CONFIG = {
  pending:    { color: "bg-yellow-100 text-yellow-700 border-yellow-200", icon: Clock,       label: "Pending"    },
  confirmed:  { color: "bg-blue-100 text-blue-700 border-blue-200",       icon: CheckCircle, label: "Confirmed"  },
  processing: { color: "bg-indigo-100 text-indigo-700 border-indigo-200", icon: Package,     label: "Processing" },
  shipped:    { color: "bg-purple-100 text-purple-700 border-purple-200", icon: Truck,       label: "Shipped"    },
  delivered:  { color: "bg-green-100 text-green-700 border-green-200",    icon: CheckCircle, label: "Delivered"  },
  cancelled:  { color: "bg-red-100 text-red-700 border-red-200",          icon: XCircle,     label: "Cancelled"  },
};

const PAYMENT_COLOR = {
  paid:     "bg-green-100 text-green-700",
  pending:  "bg-yellow-100 text-yellow-700",
  failed:   "bg-red-100 text-red-700",
  refunded: "bg-gray-100 text-gray-600",
};

export default function OrderDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;
  const { showToast } = useToast();

  const [order, setOrder]         = useState<Order | null>(null);
  const [loading, setLoading]     = useState(true);
  const [saving, setSaving]       = useState(false);
  const [newStatus, setNewStatus] = useState<string>("");
  const [trackingNumber, setTrackingNumber] = useState("");

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const fetchOrder = async () => {
    setLoading(true);
    try {
      const data = await apiClient.get<{ order: Order }>(`/admin/orders/${id}`);
      const o = data.order;
      setOrder(o);
      setNewStatus(o.order_status);
    } catch (err: any) {
      showToast(err.message || "Failed to load order", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async () => {
    if (!order || newStatus === order.order_status) return;
    setSaving(true);
    try {
      const data = await apiClient.put<{ order: Order }>(`/admin/orders/${id}`, {
        order_status: newStatus,
      });
      setOrder(data.order);
      showToast(`Order status updated to ${newStatus}`, "success");
    } catch (err: any) {
      showToast(err.message || "Failed to update status", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Delete this order? This cannot be undone.")) return;
    try {
      await apiClient.delete(`/admin/orders/${id}`);
      showToast("Order deleted", "success");
      router.push("/admin/orders");
    } catch {
      showToast("Failed to delete order", "error");
    }
  };

  const handlePrint = () => {
    showToast("Preparing invoice for print...", "success");
    window.print();
  };

  if (loading) {
    return (
      <Loading />
    );
  }

  if (!order) {
    return (
      <div className="flex flex-col items-center justify-center h-96 gap-4">
        <Package className="h-16 w-16 text-gray-200" />
        <p className="text-gray-500 font-medium">Order not found</p>
        <Button variant="outline" onClick={() => router.push("/admin/orders")}>Back to Orders</Button>
      </div>
    );
  }

  const statusCfg = STATUS_CONFIG[order.order_status] ?? STATUS_CONFIG.pending;

  // Build timeline from current status
  const timelineSteps = ORDER_STATUSES.filter(s => s !== "cancelled").map((s) => {
    const idx = ORDER_STATUSES.indexOf(s as any);
    const currentIdx = ORDER_STATUSES.indexOf(order.order_status as any);
    return {
      label: STATUS_CONFIG[s].label,
      completed: order.order_status === "cancelled" ? false : idx <= currentIdx,
    };
  });

  const addr = order.shipping_address;

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => router.back()} aria-label="Go back" className="p-2 hover:bg-gray-100">
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </Button>
          <div>
            <Heading level={2} className="text-gray-900">Order {order.order_number}</Heading>
            <Text variant="small" className="text-gray-600 mt-1">
              {new Date(order.created_at).toLocaleString("en-IN")}
            </Text>
          </div>
        </div>
        <div className="flex gap-3">
          <Button variant="ghost" onClick={fetchOrder} aria-label="Refresh" className="border border-gray-200 p-2">
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Button variant="outline" onClick={handlePrint} className="gap-2">
            <Printer className="h-5 w-5" />
            Print
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* ── Main ─────────────────────────────────────────────────────── */}
        <div className="lg:col-span-2 space-y-6">

          {/* Order Items */}
          <Card variant="elevated" className="p-6">
            <Heading level={4} className="text-gray-900 mb-4 flex items-center gap-2">
              <Package className="h-5 w-5 text-purple-600" />
              Order Items
            </Heading>
            {order.items && order.items.length > 0 ? (
              <div className="space-y-4">
                {order.items.map((item) => (
                  <div key={item.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                    <div className="h-16 w-16 rounded-lg bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center overflow-hidden flex-shrink-0">
                      {item.product.image
                        ? <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover" />
                        : <Package className="h-8 w-8 text-purple-300" />}
                    </div>
                    <div className="flex-1">
                      <Text className="font-semibold text-gray-900">{item.product.name}</Text>
                      {item.product.sku && (
                        <Text variant="small" className="text-gray-500 font-mono">SKU: {item.product.sku}</Text>
                      )}
                      <Text variant="small" className="text-gray-600">
                        ₹{item.price.toLocaleString("en-IN")} × {item.quantity}
                      </Text>
                    </div>
                    <Text className="font-semibold text-gray-900">
                      ₹{item.subtotal.toLocaleString("en-IN")}
                    </Text>
                  </div>
                ))}
              </div>
            ) : (
              <Text className="text-gray-500">No items found</Text>
            )}

            {/* Summary */}
            <div className="mt-6 pt-6 border-t border-gray-200 space-y-3">
              <div className="flex justify-between pt-3 border-t border-gray-200">
                <Heading level={5} className="text-gray-900">Total</Heading>
                <Heading level={5} className="text-purple-600">
                  ₹{order.total_amount.toLocaleString("en-IN")}
                </Heading>
              </div>
            </div>
          </Card>

          {/* Timeline */}
          <Card variant="elevated" className="p-6">
            <Heading level={4} className="text-gray-900 mb-6">Order Timeline</Heading>
            {order.order_status === "cancelled" ? (
              <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
                <XCircle className="h-6 w-6 text-red-500 flex-shrink-0" />
                <Text className="text-red-700 font-medium">This order has been cancelled</Text>
              </div>
            ) : (
              <div className="space-y-4">
                {timelineSteps.map((step, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <div className="flex flex-col items-center">
                      <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                        step.completed
                          ? "bg-green-100 border-2 border-green-500"
                          : "bg-gray-100 border-2 border-gray-300"
                      }`}>
                        {step.completed
                          ? <CheckCircle className="h-5 w-5 text-green-600" />
                          : <div className="h-3 w-3 rounded-full bg-gray-400" />}
                      </div>
                      {i < timelineSteps.length - 1 && (
                        <div className={`w-0.5 h-10 ${step.completed ? "bg-green-500" : "bg-gray-300"}`} />
                      )}
                    </div>
                    <div className="pt-2">
                      <Text className={`font-semibold ${step.completed ? "text-gray-900" : "text-gray-400"}`}>
                        {step.label}
                      </Text>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        {/* ── Sidebar ───────────────────────────────────────────────── */}
        <div className="space-y-6">

          {/* Status badge */}
          <Card variant="elevated" className="p-6">
            <Heading level={4} className="text-gray-900 mb-3">Current Status</Heading>
            <div className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg border ${statusCfg.color}`}>
              <statusCfg.icon className="h-4 w-4" />
              <span className="font-medium">{statusCfg.label}</span>
            </div>
          </Card>

          {/* Update Status */}
          <Card variant="elevated" className="p-6">
            <Heading level={4} className="text-gray-900 mb-4">Update Status</Heading>
            <select
              aria-label="Update order status"
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 mb-3"
            >
              {ORDER_STATUSES.map((s) => (
                <option key={s} value={s}>{STATUS_CONFIG[s].label}</option>
              ))}
            </select>

            {newStatus === "shipped" && (
              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700 mb-2">Tracking Number</label>
                <input
                  type="text"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  placeholder="Enter tracking number"
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            )}

            <Button
              variant="primary"
              onClick={handleStatusUpdate}
              disabled={saving || newStatus === order.order_status}
              className="w-full justify-center gap-2"
            >
              {saving && <RefreshCw className="h-4 w-4 animate-spin" />}
              {saving ? "Saving..." : "Save Status"}
            </Button>
          </Card>

          {/* Customer */}
          <Card variant="elevated" className="p-6">
            <Heading level={4} className="text-gray-900 mb-4">Customer</Heading>
            <div className="space-y-3">
              <Text className="font-semibold text-gray-900">{order.customer.name}</Text>
              <div className="flex items-center gap-2 text-gray-600">
                <Mail className="h-4 w-4 flex-shrink-0" />
                <Text variant="small">{order.customer.email}</Text>
              </div>
              {order.customer.phone && (
                <div className="flex items-center gap-2 text-gray-600">
                  <Phone className="h-4 w-4 flex-shrink-0" />
                  <Text variant="small">{order.customer.phone}</Text>
                </div>
              )}
            </div>
          </Card>

          {/* Shipping Address */}
          {addr && (
            <Card variant="elevated" className="p-6">
              <Heading level={4} className="text-gray-900 mb-4 flex items-center gap-2">
                <MapPin className="h-5 w-5 text-purple-600" />
                Shipping Address
              </Heading>
              <div className="text-gray-700 space-y-1 text-sm">
                {addr.street && <Text>{addr.street}</Text>}
                {(addr.city || addr.state || addr.zip) && (
                  <Text>{[addr.city, addr.state, addr.zip].filter(Boolean).join(", ")}</Text>
                )}
                {addr.country && <Text>{addr.country}</Text>}
              </div>
            </Card>
          )}

          {/* Payment */}
          <Card variant="elevated" className="p-6">
            <Heading level={4} className="text-gray-900 mb-4 flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-purple-600" />
              Payment
            </Heading>
            <div className="space-y-3">
              {order.payment?.method && (
                <div>
                  <Text variant="small" className="text-gray-500">Method</Text>
                  <Text className="font-semibold text-gray-900 capitalize">{order.payment.method}</Text>
                </div>
              )}
              {order.payment?.transaction_id && (
                <div>
                  <Text variant="small" className="text-gray-500">Transaction ID</Text>
                  <Text className="font-mono text-sm text-gray-700">{order.payment.transaction_id}</Text>
                </div>
              )}
              <div>
                <Text variant="small" className="text-gray-500">Payment Status</Text>
                <span className={`inline-block mt-1 px-3 py-1 rounded-full text-sm font-medium ${PAYMENT_COLOR[order.payment_status] ?? "bg-gray-100 text-gray-600"}`}>
                  {order.payment_status}
                </span>
              </div>
            </div>
          </Card>

          {/* Danger */}
          <Card variant="elevated" className="p-6">
            <Heading level={4} className="text-gray-900 mb-4">Actions</Heading>
            <div className="space-y-2">
              <Button
                variant="ghost"
                onClick={handleDelete}
                className="w-full justify-center gap-2 border border-red-200 text-red-600 hover:bg-red-50"
              >
                Cancel &amp; Delete Order
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}