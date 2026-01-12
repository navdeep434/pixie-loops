"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Search,
  Filter,
  Download,
  Mail,
  Phone,
  MapPin,
  Eye,
  MoreVertical,
  UserPlus,
  Users,
  ShoppingBag,
  Star,
  TrendingUp,
} from "lucide-react";
import { Card, Heading, Text, Button } from "@/components/elements";
import { useToast } from "@/components/elements/useToast";

type Customer = {
  id: number;
  name: string;
  email: string;
  phone: string;
  location: string;
  avatar: string;
  totalOrders: number;
  totalSpent: number;
  status: "active" | "inactive";
  joinDate: string;
  lastOrder: string;
};

export default function CustomersPage() {
  const { showToast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");

  const customers: Customer[] = [
    {
      id: 1,
      name: "Sarah Johnson",
      email: "sarah.j@email.com",
      phone: "+91 98765 43210",
      location: "Mumbai, Maharashtra",
      avatar: "👩",
      totalOrders: 12,
      totalSpent: 28450,
      status: "active",
      joinDate: "2023-06-15",
      lastOrder: "2024-01-10",
    },
    {
      id: 2,
      name: "Mike Chen",
      email: "mike.chen@email.com",
      phone: "+91 98765 43211",
      location: "Delhi, Delhi",
      avatar: "👨",
      totalOrders: 8,
      totalSpent: 15670,
      status: "active",
      joinDate: "2023-08-22",
      lastOrder: "2024-01-09",
    },
    {
      id: 3,
      name: "Emily Davis",
      email: "emily.d@email.com",
      phone: "+91 98765 43212",
      location: "Bangalore, Karnataka",
      avatar: "👩‍🦰",
      totalOrders: 15,
      totalSpent: 34590,
      status: "active",
      joinDate: "2023-04-10",
      lastOrder: "2024-01-08",
    },
    {
      id: 4,
      name: "Alex Kumar",
      email: "alex.k@email.com",
      phone: "+91 98765 43213",
      location: "Pune, Maharashtra",
      avatar: "👨‍💼",
      totalOrders: 5,
      totalSpent: 9450,
      status: "active",
      joinDate: "2023-10-05",
      lastOrder: "2023-12-20",
    },
    {
      id: 5,
      name: "Lisa Wang",
      email: "lisa.w@email.com",
      phone: "+91 98765 43214",
      location: "Hyderabad, Telangana",
      avatar: "👩‍💻",
      totalOrders: 3,
      totalSpent: 5670,
      status: "inactive",
      joinDate: "2023-11-18",
      lastOrder: "2023-11-25",
    },
    {
      id: 6,
      name: "David Brown",
      email: "david.b@email.com",
      phone: "+91 98765 43215",
      location: "Chennai, Tamil Nadu",
      avatar: "👨‍🦱",
      totalOrders: 20,
      totalSpent: 45890,
      status: "active",
      joinDate: "2023-03-12",
      lastOrder: "2024-01-07",
    },
  ];

  const statuses = ["all", "active", "inactive"];

  const getStatusColor = (status: Customer["status"]) => {
    return status === "active"
      ? "bg-green-100 text-green-700"
      : "bg-gray-100 text-gray-700";
  };

  const handleExport = () => {
    showToast("Exporting customers to CSV...", "success");
  };

  const handleSendEmail = (customerName: string) => {
    showToast(`Email composer opened for ${customerName}`, "success");
  };

  const filteredCustomers = customers.filter((customer) => {
    const matchesSearch =
      customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.phone.includes(searchQuery);
    const matchesStatus = selectedStatus === "all" || customer.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const totalCustomers = customers.length;
  const activeCustomers = customers.filter((c) => c.status === "active").length;
  const totalRevenue = customers.reduce((sum, c) => sum + c.totalSpent, 0);
  const avgOrderValue = totalRevenue / customers.reduce((sum, c) => sum + c.totalOrders, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Heading level={2} className="text-gray-900">
            Customers
          </Heading>
          <Text variant="small" className="text-gray-600 mt-1">
            Manage your customer relationships
          </Text>
        </div>
        <div className="flex gap-3">
          <Button onClick={handleExport} variant="outline" className="gap-2">
            <Download className="h-5 w-5" />
            Export
          </Button>
          <Button className="gap-2">
            <UserPlus className="h-5 w-5" />
            Add Customer
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card variant="bordered" className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <Text variant="small" className="text-gray-600">Total Customers</Text>
              <Heading level={3} className="text-gray-900 mt-1">{totalCustomers}</Heading>
              <Text variant="small" className="text-green-600 mt-1">+12.5% from last month</Text>
            </div>
            <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <Users className="h-6 w-6 text-white" />
            </div>
          </div>
        </Card>

        <Card variant="bordered" className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <Text variant="small" className="text-gray-600">Active Customers</Text>
              <Heading level={3} className="text-green-600 mt-1">{activeCustomers}</Heading>
              <Text variant="small" className="text-gray-600 mt-1">{((activeCustomers/totalCustomers)*100).toFixed(1)}% active rate</Text>
            </div>
            <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
          </div>
        </Card>

        <Card variant="bordered" className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <Text variant="small" className="text-gray-600">Total Revenue</Text>
              <Heading level={3} className="text-purple-600 mt-1">₹{totalRevenue.toLocaleString()}</Heading>
              <Text variant="small" className="text-gray-600 mt-1">From all customers</Text>
            </div>
            <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center">
              <ShoppingBag className="h-6 w-6 text-white" />
            </div>
          </div>
        </Card>

        <Card variant="bordered" className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <Text variant="small" className="text-gray-600">Avg Order Value</Text>
              <Heading level={3} className="text-orange-600 mt-1">₹{Math.round(avgOrderValue).toLocaleString()}</Heading>
              <Text variant="small" className="text-green-600 mt-1">+8.2% increase</Text>
            </div>
            <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-orange-500 to-rose-500 flex items-center justify-center">
              <Star className="h-6 w-6 text-white" />
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
                placeholder="Search by name, email or phone..."
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

          <Button variant="outline" className="gap-2">
            <Filter className="h-4 w-4" />
            More Filters
          </Button>
        </div>
      </Card>

      {/* Customers Table */}
      <Card variant="elevated" className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Orders
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Total Spent
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
              {filteredCustomers.map((customer) => (
                <tr key={customer.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-2xl">
                        {customer.avatar}
                      </div>
                      <div>
                        <Text className="font-semibold text-gray-900">{customer.name}</Text>
                        <Text variant="small" className="text-gray-500">
                          Joined {new Date(customer.joinDate).toLocaleDateString()}
                        </Text>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-gray-700">
                        <Mail className="h-4 w-4 text-gray-400" />
                        <Text variant="small">{customer.email}</Text>
                      </div>
                      <div className="flex items-center gap-2 text-gray-700">
                        <Phone className="h-4 w-4 text-gray-400" />
                        <Text variant="small">{customer.phone}</Text>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-gray-700">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      <Text variant="small">{customer.location}</Text>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <Text className="font-semibold text-gray-900">{customer.totalOrders} orders</Text>
                      <Text variant="small" className="text-gray-500">
                        Last: {new Date(customer.lastOrder).toLocaleDateString()}
                      </Text>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <Text className="font-semibold text-purple-600">
                      ₹{customer.totalSpent.toLocaleString()}
                    </Text>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(customer.status)}`}>
                      {customer.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <Link href={`/admin/customers/${customer.id}`}>
                        <button className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors">
                          <Eye className="h-4 w-4" />
                        </button>
                      </Link>
                      <button
                        onClick={() => handleSendEmail(customer.name)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Mail className="h-4 w-4" />
                      </button>
                      <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                        <MoreVertical className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredCustomers.length === 0 && (
          <div className="text-center py-12">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <Heading level={4} className="text-gray-900 mb-2">No customers found</Heading>
            <Text className="text-gray-600">Try adjusting your search or filters</Text>
          </div>
        )}
      </Card>
    </div>
  );
}