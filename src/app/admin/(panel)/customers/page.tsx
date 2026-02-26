"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  Search, Download, Mail, Phone, MapPin, Eye,
  UserPlus, Users, ShoppingBag, Star, TrendingUp, RefreshCw,
} from "lucide-react";
import { Card, Heading, Text, Button, Loading } from "@/components/elements";
import { useToast } from "@/components/elements/useToast";
import apiClient from "@/lib/api/client";

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
};

export default function CustomersPage() {
  const { showToast } = useToast();

  const [customers, setCustomers]         = useState<Customer[]>([]);
  const [loading, setLoading]             = useState(true);
  const [searchQuery, setSearchQuery]     = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");

  const fetchCustomers = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchQuery)              params.set("search", searchQuery);
      if (selectedStatus !== "all") params.set("status", selectedStatus);

      const data = await apiClient.get<{ data: Customer[] }>(`/admin/customers?${params}`);
      setCustomers(data.data ?? []);
    } catch (err: any) {
      showToast(err.message || "Failed to load customers", "error");
    } finally {
      setLoading(false);
    }
  }, [searchQuery, selectedStatus]);

  useEffect(() => {
    const t = setTimeout(() => fetchCustomers(), 400);
    return () => clearTimeout(t);
  }, [fetchCustomers]);

  const handleExport = () => showToast("Exporting customers to CSV...", "success");

  const handleSendEmail = (name: string) => showToast(`Email composer opened for ${name}`, "success");

  const totalCustomers   = customers.length;
  const activeCustomers  = customers.filter((c) => c.is_active).length;
  const totalRevenue     = customers.reduce((sum, c) => sum + (c.total_spent ?? 0), 0);
  const totalOrders      = customers.reduce((sum, c) => sum + (c.orders_count ?? 0), 0);
  const avgOrderValue    = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  const getLocation = (c: Customer) => {
    if (!c.address) return null;
    return [c.address.city, c.address.state].filter(Boolean).join(", ") || null;
  };

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Heading level={2} className="text-gray-900">Customers</Heading>
          <Text variant="small" className="text-gray-600 mt-1">Manage your customer relationships</Text>
        </div>
        <div className="flex gap-3">
          <Button
            variant="ghost"
            onClick={fetchCustomers}
            aria-label="Refresh customers"
            className="border border-gray-200 p-2"
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
          {
            label: "Total Customers", value: totalCustomers,
            sub: `${activeCustomers} active`,
            color: "text-gray-900", gradient: "from-purple-500 to-pink-500", icon: Users,
          },
          {
            label: "Active Customers", value: activeCustomers,
            sub: `${totalCustomers > 0 ? ((activeCustomers / totalCustomers) * 100).toFixed(1) : 0}% active rate`,
            color: "text-green-600", gradient: "from-green-500 to-emerald-500", icon: TrendingUp,
          },
          {
            label: "Total Revenue", value: `₹${totalRevenue.toLocaleString("en-IN")}`,
            sub: "From all customers",
            color: "text-purple-600", gradient: "from-blue-500 to-indigo-500", icon: ShoppingBag,
          },
          {
            label: "Avg Order Value", value: `₹${Math.round(avgOrderValue).toLocaleString("en-IN")}`,
            sub: `${totalOrders} total orders`,
            color: "text-orange-600", gradient: "from-orange-500 to-rose-500", icon: Star,
          },
        ].map(({ label, value, sub, color, gradient, icon: Icon }) => (
          <Card key={label} variant="bordered" className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <Text variant="small" className="text-gray-600">{label}</Text>
                <Heading level={3} className={`${color} mt-1`}>{value}</Heading>
                <Text variant="small" className="text-gray-500 mt-1">{sub}</Text>
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
              placeholder="Search by name, email or phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <select
            aria-label="Filter by status"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
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
                  {["Customer", "Contact", "Location", "Orders", "Total Spent", "Status", "Actions"].map((h) => (
                    <th key={h} className={`px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider ${h === "Actions" ? "text-right" : "text-left"}`}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {customers.map((customer) => {
                  const location = getLocation(customer);
                  return (
                    <tr key={customer.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                            {customer.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <Text className="font-semibold text-gray-900">{customer.name}</Text>
                            <Text variant="small" className="text-gray-500">
                              Joined {new Date(customer.created_at).toLocaleDateString("en-IN")}
                            </Text>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-gray-700">
                            <Mail className="h-4 w-4 text-gray-400 flex-shrink-0" />
                            <Text variant="small">{customer.email}</Text>
                          </div>
                          {customer.phone && (
                            <div className="flex items-center gap-2 text-gray-700">
                              <Phone className="h-4 w-4 text-gray-400 flex-shrink-0" />
                              <Text variant="small">{customer.phone}</Text>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {location ? (
                          <div className="flex items-center gap-2 text-gray-700">
                            <MapPin className="h-4 w-4 text-gray-400 flex-shrink-0" />
                            <Text variant="small">{location}</Text>
                          </div>
                        ) : (
                          <Text variant="small" className="text-gray-400">—</Text>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <Text className="font-semibold text-gray-900">{customer.orders_count} orders</Text>
                      </td>
                      <td className="px-6 py-4">
                        <Text className="font-semibold text-purple-600">
                          ₹{(customer.total_spent ?? 0).toLocaleString("en-IN")}
                        </Text>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          customer.is_active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"
                        }`}>
                          {customer.is_active ? "active" : "inactive"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-1">
                          <Link href={`/admin/customers/${customer.id}`}>
                            <Button variant="ghost" aria-label={`View ${customer.name}`} className="p-2 text-purple-600 hover:bg-purple-50">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Button
                            variant="ghost"
                            onClick={() => handleSendEmail(customer.name)}
                            aria-label={`Email ${customer.name}`}
                            className="p-2 text-blue-600 hover:bg-blue-50"
                          >
                            <Mail className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {customers.length === 0 && !loading && (
              <div className="text-center py-12">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <Heading level={4} className="text-gray-900 mb-2">No customers found</Heading>
                <Text className="text-gray-600">Try adjusting your search or filters</Text>
              </div>
            )}
          </div>
        )}
      </Card>
    </div>
  );
}