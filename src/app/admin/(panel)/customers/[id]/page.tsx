"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  ArrowLeft, Mail, Phone, MapPin, ShoppingBag,
  Star, Calendar, Trash2, ToggleLeft, ToggleRight,
  Package, RefreshCw, MessageSquare,
} from "lucide-react";
import { Card, Heading, Text, Button, Loading } from "@/components/elements";
import { useToast } from "@/components/elements/useToast";
import apiClient from "@/lib/api/client";
import Link from "next/link";

type Order = {
  id: number;
  order_number: string;
  total_amount: number;
  order_status: string;
  created_at: string;
};

type Review = {
  id: number;
  rating: number;
  comment?: string;
  created_at: string;
};

type Customer = {
  id: number;
  name: string;
  email: string;
  phone?: string;
  is_active: boolean;
  created_at: string;
  orders_count: number;
  total_spent: number;
  address?: {
    address?: string;
    city?: string;
    state?: string;
    country?: string;
    pincode?: string;
  } | null;
  orders?: Order[];
  reviews?: Review[];
};

const ORDER_STATUS_COLOR: Record<string, string> = {
  pending:    "bg-yellow-100 text-yellow-700",
  confirmed:  "bg-blue-100 text-blue-700",
  processing: "bg-indigo-100 text-indigo-700",
  shipped:    "bg-purple-100 text-purple-700",
  delivered:  "bg-green-100 text-green-700",
  cancelled:  "bg-red-100 text-red-700",
};

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          className={`h-4 w-4 ${s <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-200"}`}
        />
      ))}
    </div>
  );
}

export default function CustomerDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;
  const { showToast } = useToast();

  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading]   = useState(true);
  const [toggling, setToggling] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => { fetchCustomer(); }, [id]);

  const fetchCustomer = async () => {
    setLoading(true);
    try {
      const data = await apiClient.get<{ customer: Customer }>(`/admin/customers/${id}`);
      setCustomer(data.customer);
    } catch (err: any) {
      showToast(err.message || "Failed to load customer", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleActive = async () => {
    if (!customer) return;
    setToggling(true);
    try {
      const data = await apiClient.put<{ customer: Customer }>(`/admin/customers/${id}`, {
        is_active: !customer.is_active,
      });
      setCustomer(data.customer);
      showToast(`Customer ${data.customer.is_active ? "activated" : "deactivated"}`, "success");
    } catch (err: any) {
      showToast(err.message || "Failed to update customer", "error");
    } finally {
      setToggling(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm(`Delete ${customer?.name}? This cannot be undone.`)) return;
    setDeleting(true);
    try {
      await apiClient.delete(`/admin/customers/${id}`);
      showToast("Customer deleted", "success");
      router.push("/admin/customers");
    } catch {
      showToast("Failed to delete customer", "error");
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <Loading />
    );
  }

  if (!customer) {
    return (
      <div className="flex flex-col items-center justify-center h-96 gap-4">
        <Package className="h-16 w-16 text-gray-200" />
        <Text className="text-gray-500 font-medium">Customer not found</Text>
        <Button variant="outline" onClick={() => router.push("/admin/customers")}>
          Back to Customers
        </Button>
      </div>
    );
  }

  const addr = customer.address;
  const fullAddress = addr
    ? [addr.address, addr.city, addr.state, addr.pincode, addr.country].filter(Boolean).join(", ")
    : null;

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => router.back()} aria-label="Go back" className="p-2 hover:bg-gray-100">
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </Button>
          <div>
            <Heading level={2} className="text-gray-900">{customer.name}</Heading>
            <Text variant="small" className="text-gray-500 mt-0.5">Customer ID: #{customer.id}</Text>
          </div>
        </div>
        <div className="flex gap-3">
          <Button
            variant="ghost"
            onClick={fetchCustomer}
            aria-label="Refresh"
            className="border border-gray-200 p-2"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            onClick={handleToggleActive}
            disabled={toggling}
            aria-label={customer.is_active ? "Deactivate customer" : "Activate customer"}
            className={`gap-2 border ${customer.is_active ? "border-orange-200 text-orange-600 hover:bg-orange-50" : "border-green-200 text-green-600 hover:bg-green-50"}`}
          >
            {customer.is_active
              ? <ToggleRight className="h-4 w-4" />
              : <ToggleLeft className="h-4 w-4" />}
            {customer.is_active ? "Deactivate" : "Activate"}
          </Button>
          <Button
            variant="ghost"
            onClick={handleDelete}
            disabled={deleting}
            aria-label="Delete customer"
            className="gap-2 border border-red-200 text-red-600 hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4" />
            Delete
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* ── Left ─────────────────────────────────────────────────────── */}
        <div className="lg:col-span-2 space-y-6">

          {/* Orders */}
          <Card variant="elevated" className="p-6">
            <Heading level={4} className="text-gray-900 mb-4 flex items-center gap-2">
              <ShoppingBag className="h-5 w-5 text-purple-600" />
              Order History
              <span className="ml-auto text-xs bg-gray-100 text-gray-500 px-2.5 py-1 rounded-full font-normal">
                {customer.orders?.length ?? 0} orders
              </span>
            </Heading>

            {customer.orders && customer.orders.length > 0 ? (
              <div className="space-y-3">
                {customer.orders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
                        <Package className="h-5 w-5 text-purple-400" />
                      </div>
                      <div>
                        <Text className="font-semibold text-purple-600">{order.order_number}</Text>
                        <Text variant="small" className="text-gray-500">
                          {new Date(order.created_at).toLocaleDateString("en-IN", {
                            day: "numeric", month: "short", year: "numeric",
                          })}
                        </Text>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${ORDER_STATUS_COLOR[order.order_status] ?? "bg-gray-100 text-gray-600"}`}>
                        {order.order_status}
                      </span>
                      <Text className="font-semibold text-gray-900">
                        ₹{order.total_amount.toLocaleString("en-IN")}
                      </Text>
                      <Link href={`/admin/orders/${order.id}`}>
                        <Button variant="ghost" aria-label={`View order ${order.order_number}`} className="p-1.5 text-gray-500 hover:bg-white hover:text-purple-600">
                          <ArrowLeft className="h-4 w-4 rotate-180" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10">
                <ShoppingBag className="h-10 w-10 text-gray-200 mx-auto mb-3" />
                <Text className="text-gray-400">No orders yet</Text>
              </div>
            )}
          </Card>

          {/* Reviews */}
          <Card variant="elevated" className="p-6">
            <Heading level={4} className="text-gray-900 mb-4 flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-purple-600" />
              Reviews
              <span className="ml-auto text-xs bg-gray-100 text-gray-500 px-2.5 py-1 rounded-full font-normal">
                {customer.reviews?.length ?? 0} reviews
              </span>
            </Heading>

            {customer.reviews && customer.reviews.length > 0 ? (
              <div className="space-y-4">
                {customer.reviews.map((review) => (
                  <div key={review.id} className="p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-center justify-between mb-2">
                      <StarRating rating={review.rating} />
                      <Text variant="small" className="text-gray-400">
                        {new Date(review.created_at).toLocaleDateString("en-IN", {
                          day: "numeric", month: "short", year: "numeric",
                        })}
                      </Text>
                    </div>
                    {review.comment && (
                      <Text variant="small" className="text-gray-700 leading-relaxed">
                        {review.comment}
                      </Text>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10">
                <Star className="h-10 w-10 text-gray-200 mx-auto mb-3" />
                <Text className="text-gray-400">No reviews yet</Text>
              </div>
            )}
          </Card>
        </div>

        {/* ── Sidebar ───────────────────────────────────────────────── */}
        <div className="space-y-6">

          {/* Profile */}
          <Card variant="elevated" className="p-6">
            <div className="flex flex-col items-center text-center mb-6">
              <div className="h-20 w-20 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white font-bold text-3xl mb-4">
                {customer.name.charAt(0).toUpperCase()}
              </div>
              <Heading level={4} className="text-gray-900">{customer.name}</Heading>
              <span className={`mt-2 px-3 py-1 rounded-full text-xs font-semibold ${
                customer.is_active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
              }`}>
                {customer.is_active ? "Active" : "Inactive"}
              </span>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3 text-gray-700">
                <Mail className="h-4 w-4 text-gray-400 flex-shrink-0" />
                <Text variant="small" className="break-all">{customer.email}</Text>
              </div>
              {customer.phone && (
                <div className="flex items-center gap-3 text-gray-700">
                  <Phone className="h-4 w-4 text-gray-400 flex-shrink-0" />
                  <Text variant="small">{customer.phone}</Text>
                </div>
              )}
              {fullAddress && (
                <div className="flex items-start gap-3 text-gray-700">
                  <MapPin className="h-4 w-4 text-gray-400 flex-shrink-0 mt-0.5" />
                  <Text variant="small">{fullAddress}</Text>
                </div>
              )}
              <div className="flex items-center gap-3 text-gray-700">
                <Calendar className="h-4 w-4 text-gray-400 flex-shrink-0" />
                <Text variant="small">
                  Joined {new Date(customer.created_at).toLocaleDateString("en-IN", {
                    day: "numeric", month: "long", year: "numeric",
                  })}
                </Text>
              </div>
            </div>
          </Card>

          {/* Stats */}
          <Card variant="elevated" className="p-6">
            <Heading level={4} className="text-gray-900 mb-4">Stats</Heading>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                <Text variant="small" className="text-purple-700 font-medium">Total Orders</Text>
                <Heading level={4} className="text-purple-700">{customer.orders_count}</Heading>
              </div>
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <Text variant="small" className="text-green-700 font-medium">Total Spent</Text>
                <Heading level={4} className="text-green-700">
                  ₹{(customer.total_spent ?? 0).toLocaleString("en-IN")}
                </Heading>
              </div>
              {customer.orders_count > 0 && (
                <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                  <Text variant="small" className="text-orange-700 font-medium">Avg Order</Text>
                  <Heading level={4} className="text-orange-700">
                    ₹{Math.round((customer.total_spent ?? 0) / customer.orders_count).toLocaleString("en-IN")}
                  </Heading>
                </div>
              )}
              {customer.reviews && customer.reviews.length > 0 && (
                <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                  <Text variant="small" className="text-yellow-700 font-medium">Avg Rating</Text>
                  <div className="flex items-center gap-1.5">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <Heading level={4} className="text-yellow-700">
                      {(customer.reviews.reduce((s, r) => s + r.rating, 0) / customer.reviews.length).toFixed(1)}
                    </Heading>
                  </div>
                </div>
              )}
            </div>
          </Card>

          {/* Actions */}
          <Card variant="elevated" className="p-6">
            <Heading level={4} className="text-gray-900 mb-4">Actions</Heading>
            <div className="space-y-2">
              <Button
                variant="primary"
                className="w-full justify-center gap-2"
                onClick={() => window.open(`mailto:${customer.email}`)}
              >
                <Mail className="h-4 w-4" />
                Send Email
              </Button>
              <Button
                variant="ghost"
                onClick={handleToggleActive}
                disabled={toggling}
                className={`w-full justify-center gap-2 border ${
                  customer.is_active
                    ? "border-orange-200 text-orange-600 hover:bg-orange-50"
                    : "border-green-200 text-green-600 hover:bg-green-50"
                }`}
              >
                {customer.is_active ? <ToggleRight className="h-4 w-4" /> : <ToggleLeft className="h-4 w-4" />}
                {customer.is_active ? "Deactivate Account" : "Activate Account"}
              </Button>
              <Button
                variant="ghost"
                onClick={handleDelete}
                disabled={deleting}
                className="w-full justify-center gap-2 border border-red-200 text-red-600 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4" />
                {deleting ? "Deleting..." : "Delete Customer"}
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}