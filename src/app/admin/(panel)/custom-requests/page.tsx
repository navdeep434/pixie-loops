"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Search,
  Filter,
  Heart,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  MessageSquare,
  Image as ImageIcon,
  Calendar,
  DollarSign,
  AlertCircle,
} from "lucide-react";
import { Card, Heading, Text, Button } from "@/components/elements";
import { useToast } from "@/components/elements/useToast";

type CustomRequest = {
  id: string;
  customer: {
    name: string;
    email: string;
    avatar: string;
  };
  title: string;
  description: string;
  category: string;
  budget: number;
  status: "pending" | "reviewing" | "approved" | "rejected" | "completed";
  priority: "low" | "medium" | "high";
  date: string;
  hasImage: boolean;
  deadline?: string;
};

export default function CustomRequestsPage() {
  const { showToast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedPriority, setSelectedPriority] = useState("all");

  const requests: CustomRequest[] = [
    {
      id: "REQ-1015",
      customer: {
        name: "Emma Wilson",
        email: "emma.w@email.com",
        avatar: "👩‍🦳",
      },
      title: "Custom Baby Blanket with Name",
      description: "Need a soft pink baby blanket with the name 'Sophia' embroidered in white. Size should be 80x100cm.",
      category: "Blankets",
      budget: 3500,
      status: "pending",
      priority: "high",
      date: "2024-01-11",
      hasImage: true,
      deadline: "2024-01-25",
    },
    {
      id: "REQ-1014",
      customer: {
        name: "James Miller",
        email: "james.m@email.com",
        avatar: "👨‍💼",
      },
      title: "Amigurumi Family Set",
      description: "Looking for a custom family of 4 amigurumi dolls representing my family. Need specific outfits and hair colors.",
      category: "Toys",
      budget: 5000,
      status: "reviewing",
      priority: "medium",
      date: "2024-01-10",
      hasImage: true,
      deadline: "2024-02-01",
    },
    {
      id: "REQ-1013",
      customer: {
        name: "Olivia Brown",
        email: "olivia.b@email.com",
        avatar: "👩",
      },
      title: "Wedding Gift Set",
      description: "Custom crochet set for wedding gift including table runner, napkin holders, and decorative basket.",
      category: "Home Decor",
      budget: 7500,
      status: "approved",
      priority: "high",
      date: "2024-01-09",
      hasImage: false,
      deadline: "2024-01-20",
    },
    {
      id: "REQ-1012",
      customer: {
        name: "Noah Davis",
        email: "noah.d@email.com",
        avatar: "👨",
      },
      title: "Beach Tote Bag Set",
      description: "Need 3 matching beach tote bags in coral, turquoise, and yellow colors with sturdy handles.",
      category: "Bags",
      budget: 4200,
      status: "completed",
      priority: "low",
      date: "2024-01-05",
      hasImage: true,
    },
    {
      id: "REQ-1011",
      customer: {
        name: "Sophia Taylor",
        email: "sophia.t@email.com",
        avatar: "👩‍🦰",
      },
      title: "Pet Bed for Large Dog",
      description: "Custom crochet bed for golden retriever. Needs to be washable and durable.",
      category: "Pet Accessories",
      budget: 3800,
      status: "rejected",
      priority: "low",
      date: "2024-01-03",
      hasImage: false,
    },
  ];

  const statuses = ["all", "pending", "reviewing", "approved", "rejected", "completed"];
  const priorities = ["all", "low", "medium", "high"];

  const getStatusConfig = (status: CustomRequest["status"]) => {
    const configs = {
      pending: {
        color: "bg-yellow-100 text-yellow-700 border-yellow-200",
        icon: Clock,
        label: "Pending",
      },
      reviewing: {
        color: "bg-blue-100 text-blue-700 border-blue-200",
        icon: AlertCircle,
        label: "Reviewing",
      },
      approved: {
        color: "bg-green-100 text-green-700 border-green-200",
        icon: CheckCircle,
        label: "Approved",
      },
      rejected: {
        color: "bg-red-100 text-red-700 border-red-200",
        icon: XCircle,
        label: "Rejected",
      },
      completed: {
        color: "bg-purple-100 text-purple-700 border-purple-200",
        icon: CheckCircle,
        label: "Completed",
      },
    };
    return configs[status];
  };

  const getPriorityColor = (priority: CustomRequest["priority"]) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-700";
      case "medium":
        return "bg-orange-100 text-orange-700";
      case "low":
        return "bg-gray-100 text-gray-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const handleApprove = (requestId: string) => {
    showToast(`Request ${requestId} approved successfully`, "success");
  };

  const handleReject = (requestId: string) => {
    showToast(`Request ${requestId} rejected`, "error");
  };

  const filteredRequests = requests.filter((request) => {
    const matchesSearch =
      request.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatus === "all" || request.status === selectedStatus;
    const matchesPriority = selectedPriority === "all" || request.priority === selectedPriority;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const pendingCount = requests.filter((r) => r.status === "pending").length;
  const reviewingCount = requests.filter((r) => r.status === "reviewing").length;
  const approvedCount = requests.filter((r) => r.status === "approved").length;
  const totalBudget = requests.reduce((sum, r) => sum + r.budget, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Heading level={2} className="text-gray-900">
            Custom Requests
          </Heading>
          <Text variant="small" className="text-gray-600 mt-1">
            Review and manage custom order requests from customers
          </Text>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-pink-50 border border-pink-200 rounded-lg">
          <Heart className="h-5 w-5 text-pink-600 fill-pink-600" />
          <Text className="font-semibold text-pink-600">{requests.length} Total Requests</Text>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card variant="bordered" className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <Text variant="small" className="text-gray-600">Pending Review</Text>
              <Heading level={3} className="text-yellow-600 mt-1">{pendingCount}</Heading>
              <Text variant="small" className="text-gray-600 mt-1">Needs attention</Text>
            </div>
            <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center">
              <Clock className="h-6 w-6 text-white" />
            </div>
          </div>
        </Card>

        <Card variant="bordered" className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <Text variant="small" className="text-gray-600">Under Review</Text>
              <Heading level={3} className="text-blue-600 mt-1">{reviewingCount}</Heading>
              <Text variant="small" className="text-gray-600 mt-1">In progress</Text>
            </div>
            <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center">
              <AlertCircle className="h-6 w-6 text-white" />
            </div>
          </div>
        </Card>

        <Card variant="bordered" className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <Text variant="small" className="text-gray-600">Approved</Text>
              <Heading level={3} className="text-green-600 mt-1">{approvedCount}</Heading>
              <Text variant="small" className="text-gray-600 mt-1">Ready to create</Text>
            </div>
            <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
              <CheckCircle className="h-6 w-6 text-white" />
            </div>
          </div>
        </Card>

        <Card variant="bordered" className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <Text variant="small" className="text-gray-600">Total Value</Text>
              <Heading level={3} className="text-purple-600 mt-1">₹{totalBudget.toLocaleString()}</Heading>
              <Text variant="small" className="text-gray-600 mt-1">Potential revenue</Text>
            </div>
            <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <DollarSign className="h-6 w-6 text-white" />
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
                placeholder="Search by title, customer or request ID..."
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
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
            className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            {priorities.map((priority) => (
              <option key={priority} value={priority}>
                {priority === "all" ? "All Priority" : priority.charAt(0).toUpperCase() + priority.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </Card>

      {/* Requests Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredRequests.map((request) => {
          const statusConfig = getStatusConfig(request.status);
          const StatusIcon = statusConfig.icon;

          return (
            <Card key={request.id} variant="elevated" className="p-6 hover:shadow-xl transition-all">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-2xl">
                    {request.customer.avatar}
                  </div>
                  <div>
                    <Text className="font-semibold text-gray-900">{request.customer.name}</Text>
                    <Text variant="small" className="text-gray-500">{request.customer.email}</Text>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(request.priority)}`}>
                  {request.priority}
                </span>
              </div>

              {/* Request Details */}
              <div className="space-y-3 mb-4">
                <div className="flex items-start justify-between">
                  <Heading level={5} className="text-gray-900 flex-1">{request.title}</Heading>
                  {request.hasImage && (
                    <ImageIcon className="h-5 w-5 text-purple-600 flex-shrink-0" />
                  )}
                </div>
                <Text variant="small" className="text-gray-600 line-clamp-2">
                  {request.description}
                </Text>
              </div>

              {/* Meta Info */}
              <div className="flex flex-wrap gap-4 mb-4 pb-4 border-b border-gray-200">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <Text variant="small" className="text-gray-600">
                    {new Date(request.date).toLocaleDateString()}
                  </Text>
                </div>
                {request.deadline && (
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-gray-400" />
                    <Text variant="small" className="text-gray-600">
                      Due: {new Date(request.deadline).toLocaleDateString()}
                    </Text>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-gray-400" />
                  <Text variant="small" className="font-semibold text-purple-600">
                    ₹{request.budget.toLocaleString()}
                  </Text>
                </div>
              </div>

              {/* Status and Actions */}
              <div className="flex items-center justify-between">
                <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border ${statusConfig.color}`}>
                  <StatusIcon className="h-4 w-4" />
                  <span className="text-xs font-medium">{statusConfig.label}</span>
                </div>

                <div className="flex gap-2">
                  <Link href={`/admin/custom-requests/${request.id}`}>
                    <Button variant="ghost" size="sm" className="gap-2">
                      <Eye className="h-4 w-4" />
                      View
                    </Button>
                  </Link>
                  {request.status === "pending" && (
                    <>
                      <Button
                        size="sm"
                        onClick={() => handleApprove(request.id)}
                        className="gap-2 bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle className="h-4 w-4" />
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleReject(request.id)}
                        className="gap-2 text-red-600 border-red-600 hover:bg-red-50"
                      >
                        <XCircle className="h-4 w-4" />
                        Reject
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {filteredRequests.length === 0 && (
        <Card variant="elevated" className="p-12">
          <div className="text-center">
            <Heart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <Heading level={4} className="text-gray-900 mb-2">No custom requests found</Heading>
            <Text className="text-gray-600">Try adjusting your search or filters</Text>
          </div>
        </Card>
      )}
    </div>
  );
}