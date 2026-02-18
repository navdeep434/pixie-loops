"use client";

import { useState } from "react";
import {
  Settings,
  User,
  Bell,
  Shield,
  CreditCard,
  Truck,
  Mail,
  Globe,
  Palette,
  Save,
  Upload,
  Camera,
} from "lucide-react";
import { Card, Heading, Text, Button, TextBox } from "@/components/elements";
import { useToast } from "@/components/elements/useToast";

export default function SettingsPage() {
  const { showToast } = useToast();

  const handleSave = () => {
    showToast("Settings saved successfully!", "success");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Heading level={2} className="text-gray-900">
            Settings
          </Heading>
          <Text variant="small" className="text-gray-600 mt-1">
            Manage your store settings and preferences
          </Text>
        </div>
      </div>

      {/* Settings Navigation */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <Card variant="bordered" className="lg:col-span-1 p-4">
          <div className="space-y-1">
            {[
              { name: "General", active: true },
              { name: "Store Details", active: false },
              { name: "Payment Methods", active: false },
              { name: "Shipping", active: false },
              { name: "Notifications", active: false },
              { name: "Security", active: false },
            ].map((item, index) => (
              <button
                key={index}
                className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                  index === 0
                    ? "bg-purple-50 text-purple-600 font-semibold"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                {item.name}
              </button>
            ))}
          </div>
        </Card>

        {/* Settings Content */}
        <Card variant="elevated" className="lg:col-span-2 p-6">
          <Heading level={4} className="text-gray-900 mb-6">General Settings</Heading>
          
          <div className="space-y-6">
            {/* Store Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Store Name
              </label>
              <input
                type="text"
                defaultValue="PixieLoops"
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <div className="space-y-2">
              <Text className="font-medium text-gray-700">Store Description</Text>
              <textarea
                rows={4}
                defaultValue="Handcrafted crochet products made with love and care. Each piece is unique and made to order."
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
              />
            </div>

            <div className="space-y-2">
              <Text className="font-medium text-gray-900">Store Logo</Text>
              <div className="flex items-center gap-4">
                <div className="h-20 w-20 rounded-lg bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-3xl">
                  🧶
                </div>
                <Button variant="outline" size="sm">Change Logo</Button>
              </div>
            </div>

            {/* Contact Information */}
            <div className="space-y-4">
              <Heading level={5} className="text-gray-900">Contact Information</Heading>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    defaultValue="contact@pixieloops.com"
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <Text variant="small" className="text-gray-600 font-medium mb-2">Phone</Text>
                  <input
                    type="tel"
                    defaultValue="+91 98765 43210"
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end">
              <Button onClick={handleSave} className="gap-2">
                <Save className="h-5 w-5" />
                Save Changes
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}