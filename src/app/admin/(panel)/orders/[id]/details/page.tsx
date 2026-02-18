"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Package,
  Truck,
  CheckCircle,
  MapPin,
  Phone,
  Mail,
  Calendar,
  CreditCard,
  Printer,
  Download,
  MessageSquare,
  Edit,
} from "lucide-react";
import { Card, Heading, Text, Button } from "@/components/elements";
import { useToast } from "@/components/elements/useToast";

type OrderItem = {
  id: number;
  name: string;
  image: string;
  price: number;
  quantity: number;
  total: number;
};

export default function OrderDetailPage() {
  const router = useRouter();
  const { showToast } = useToast();

  const [orderStatus, setOrderStatus] = useState("processing");
  const [trackingNumber, setTrackingNumber] = useState("");

  const order = {
    id: "ORD-1238",
    date: "2024-01-10T10:30:00",
    customer: {
      name: "Sarah Johnson",
      email: "sarah.j@email.com",
      phone: "+91 98765 43210",
      avatar: "👩",
    },
    shippingAddress: {
      street: "123 Main Street, Apt 4B",
      city: "Mumbai",
      state: "Maharashtra",
      zip: "400001",
      country: "India",
    },
    billingAddress: {
      street: "123 Main Street, Apt 4B",
      city: "Mumbai",
      state: "Maharashtra",
      zip: "400001",
      country: "India",
    },
    items: [
      {
        id: 1,
        name: "Cozy Crochet Blanket",
        image: "🧶",
        price: 2499,
        quantity: 1,
        total: 2499,
      },
      {
        id: 2,
        name: "Amigurumi Teddy Bear",
        image: "🧸",
        price: 899,
        quantity: 1,
        total: 899,
      },
    ],
    subtotal: 3398,
    shipping: 150,
    tax: 612,
    discount: 200,
    total: 3960,
    paymentMethod: "Credit Card",
    paymentStatus: "paid",
    notes: "Please wrap as a gift with purple ribbon",
  };

  const timeline = [
    {
      status: "Order Placed",
      date: "Jan 10, 2024 10:30 AM",
      completed: true,
    },
    {
      status: "Payment Confirmed",
      date: "Jan 10, 2024 10:31 AM",
      completed: true,
    },
    {
      status: "Processing",
      date: "Jan 10, 2024 11:00 AM",
      completed: true,
    },
    {
      status: "Shipped",
      date: "Pending",
      completed: false,
    },
    {
      status: "Delivered",
      date: "Pending",
      completed: false,
    },
  ];

  const handleStatusUpdate = (newStatus: string) => {
    setOrderStatus(newStatus);
    showToast(`Order status updated to ${newStatus}`, "success");
  };

  const handlePrint = () => {
    showToast("Preparing invoice for print...", "success");
  };

  const handleDownload = () => {
    showToast("Downloading invoice...", "success");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </button>
          <div>
            <Heading level={2} className="text-gray-900">
              Order {order.id}
            </Heading>
            <Text variant="small" className="text-gray-600 mt-1">
              {new Date(order.date).toLocaleString()}
            </Text>
          </div>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={handlePrint} className="gap-2">
            <Printer className="h-5 w-5" />
            Print
          </Button>
          <Button variant="outline" onClick={handleDownload} className="gap-2">
            <Download className="h-5 w-5" />
            Download
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Items */}
          <Card variant="elevated" className="p-6">
            <Heading level={4} className="text-gray-900 mb-4 flex items-center gap-2">
              <Package className="h-5 w-5 text-purple-600" />
              Order Items
            </Heading>
            <div className="space-y-4">
              {order.items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg"
                >
                  <div className="h-16 w-16 rounded-lg bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center text-3xl flex-shrink-0">
                    {item.image}
                  </div>
                  <div className="flex-1">
                    <Text className="font-semibold text-gray-900">
                      {item.name}
                    </Text>
                    <Text variant="small" className="text-gray-600">
                      ₹{item.price} × {item.quantity}
                    </Text>
                  </div>
                  <Text className="font-semibold text-gray-900">
                    ₹{item.total.toLocaleString()}
                  </Text>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="mt-6 pt-6 border-t border-gray-200 space-y-3">
              <div className="flex justify-between">
                <Text className="text-gray-600">Subtotal</Text>
                <Text className="text-gray-900">
                  ₹{order.subtotal.toLocaleString()}
                </Text>
              </div>
              <div className="flex justify-between">
                <Text className="text-gray-600">Shipping</Text>
                <Text className="text-gray-900">
                  ₹{order.shipping.toLocaleString()}
                </Text>
              </div>
              <div className="flex justify-between">
                <Text className="text-gray-600">Tax</Text>
                <Text className="text-gray-900">
                  ₹{order.tax.toLocaleString()}
                </Text>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between">
                  <Text className="text-gray-600">Discount</Text>
                  <Text className="text-green-600">
                    -₹{order.discount.toLocaleString()}
                  </Text>
                </div>
              )}
              <div className="flex justify-between pt-3 border-t border-gray-200">
                <Heading level={5} className="text-gray-900">
                  Total
                </Heading>
                <Heading level={5} className="text-purple-600">
                  ₹{order.total.toLocaleString()}
                </Heading>
              </div>
            </div>
          </Card>

          {/* Timeline */}
          <Card variant="elevated" className="p-6">
            <Heading level={4} className="text-gray-900 mb-4">
              Order Timeline
            </Heading>
            <div className="space-y-4">
              {timeline.map((step, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className="flex flex-col items-center">
                    <div
                      className={`h-10 w-10 rounded-full flex items-center justify-center ${
                        step.completed
                          ? "bg-green-100 border-2 border-green-500"
                          : "bg-gray-100 border-2 border-gray-300"
                      }`}
                    >
                      {step.completed ? (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      ) : (
                        <div className="h-3 w-3 rounded-full bg-gray-400"></div>
                      )}
                    </div>
                    {index < timeline.length - 1 && (
                      <div
                        className={`w-0.5 h-12 ${
                          step.completed ? "bg-green-500" : "bg-gray-300"
                        }`}
                      ></div>
                    )}
                  </div>
                  <div className="flex-1 pb-8">
                    <Text
                      className={`font-semibold ${
                        step.completed ? "text-gray-900" : "text-gray-500"
                      }`}
                    >
                      {step.status}
                    </Text>
                    <Text variant="small" className="text-gray-500 mt-1">
                      {step.date}
                    </Text>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Customer Notes */}
          {order.notes && (
            <Card variant="elevated" className="p-6">
              <Heading level={4} className="text-gray-900 mb-4 flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-purple-600" />
                Customer Notes
              </Heading>
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <Text className="text-gray-700">{order.notes}</Text>
              </div>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Customer Info */}
          <Card variant="elevated" className="p-6">
            <Heading level={4} className="text-gray-900 mb-4">
              Customer
            </Heading>
            <div className="flex items-center gap-3 mb-4">
              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-2xl">
                {order.customer.avatar}
              </div>
              <div>
                <Text className="font-semibold text-gray-900">
                  {order.customer.name}
                </Text>
                <Text variant="small" className="text-gray-500">
                  Customer
                </Text>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-gray-600">
                <Mail className="h-4 w-4" />
                <Text variant="small">{order.customer.email}</Text>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Phone className="h-4 w-4" />
                <Text variant="small">{order.customer.phone}</Text>
              </div>
            </div>
          </Card>

          {/* Shipping Address */}
          <Card variant="elevated" className="p-6">
            <div className="flex items-center justify-between mb-4">
              <Heading level={4} className="text-gray-900 flex items-center gap-2">
                <MapPin className="h-5 w-5 text-purple-600" />
                Shipping Address
              </Heading>
              <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                <Edit className="h-4 w-4" />
              </button>
            </div>
            <div className="text-gray-700 space-y-1">
              <Text>{order.shippingAddress.street}</Text>
              <Text>
                {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
                {order.shippingAddress.zip}
              </Text>
              <Text>{order.shippingAddress.country}</Text>
            </div>
          </Card>

          {/* Payment Info */}
          <Card variant="elevated" className="p-6">
            <Heading level={4} className="text-gray-900 mb-4 flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-purple-600" />
              Payment
            </Heading>
            <div className="space-y-3">
              <div>
                <Text variant="small" className="text-gray-600">
                  Payment Method
                </Text>
                <Text className="font-semibold text-gray-900">
                  {order.paymentMethod}
                </Text>
              </div>
              <div>
                <Text variant="small" className="text-gray-600">
                  Payment Status
                </Text>
                <span className="inline-block mt-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                  {order.paymentStatus}
                </span>
              </div>
            </div>
          </Card>

          {/* Order Status */}
          <Card variant="elevated" className="p-6">
            <Heading level={4} className="text-gray-900 mb-4">
              Update Status
            </Heading>
            <select
              value={orderStatus}
              onChange={(e) => handleStatusUpdate(e.target.value)}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent mb-3"
            >
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>

            {orderStatus === "shipped" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tracking Number
                </label>
                <input
                  type="text"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  placeholder="Enter tracking number"
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            )}
          </Card>

          {/* Quick Actions */}
          <Card variant="elevated" className="p-6">
            <Heading level={4} className="text-gray-900 mb-4">
              Actions
            </Heading>
            <div className="space-y-2">
              <Button variant="outline" className="w-full justify-start gap-2">
                <Mail className="h-4 w-4" />
                Email Customer
              </Button>
              <Button variant="outline" className="w-full justify-start gap-2">
                <Truck className="h-4 w-4" />
                Create Shipping Label
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start gap-2 text-red-600 border-red-600 hover:bg-red-50"
              >
                Cancel Order
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}