"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import {
  Card,
  Heading,
  Text,
  Button,
  useToast,
  TextBox,
} from "@/components/elements";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Shield,
  Edit2,
  Save,
  X,
  Camera,
} from "lucide-react";

export default function ProfilePage() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: "",
    address: "",
  });

  const handleSave = async () => {
    setLoading(true);
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    showToast("Profile updated successfully! 🎉", "success");
    setIsEditing(false);
    setLoading(false);
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || "",
      email: user?.email || "",
      phone: "",
      address: "",
    });
    setIsEditing(false);
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          {/* Header */}
          <div className="mb-8">
            <Heading level={1} gradient className="mb-2">
              My Profile
            </Heading>
            <Text variant="muted">
              Manage your personal information and preferences
            </Text>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {/* Profile Summary Card */}
            <Card variant="elevated" className="lg:col-span-1 p-6">
              <div className="flex flex-col items-center text-center">
                {/* Avatar */}
                <div className="relative mb-4">
                  <div className="flex h-32 w-32 items-center justify-center rounded-full bg-gradient-to-br from-purple-400 via-pink-400 to-rose-400 text-white text-4xl font-bold shadow-lg">
                    {user?.name.charAt(0).toUpperCase()}
                  </div>
                  <button
                    className="absolute bottom-0 right-0 rounded-full bg-white p-2 shadow-lg hover:bg-gray-50 transition"
                    aria-label="Change avatar"
                  >
                    <Camera className="h-4 w-4 text-gray-600" />
                  </button>
                </div>

                <Heading level={3} className="mb-1">
                  {user?.name}
                </Heading>
                <Text variant="small" className="text-gray-600 mb-4">
                  {user?.email}
                </Text>

                {/* Roles */}
                <div className="flex flex-wrap gap-2 justify-center mb-6">
                  {user?.roles?.map((role) => (
                    <span
                      key={role}
                      className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700"
                    >
                      <Shield className="h-3 w-3" />
                      {role}
                    </span>
                  ))}
                </div>

                {/* Stats */}
                <div className="w-full grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                  <div>
                    <Text variant="small" className="text-gray-600">
                      Orders
                    </Text>
                    <Heading level={4}>12</Heading>
                  </div>
                  <div>
                    <Text variant="small" className="text-gray-600">
                      Wishlist
                    </Text>
                    <Heading level={4}>5</Heading>
                  </div>
                </div>
              </div>
            </Card>

            {/* Profile Details Card */}
            <Card variant="elevated" className="lg:col-span-2 p-6">
              <div className="flex items-center justify-between mb-6">
                <Heading level={3}>Personal Information</Heading>
                {!isEditing ? (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditing(true)}
                    className="gap-2"
                  >
                    <Edit2 className="h-4 w-4" />
                    Edit Profile
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleCancel}
                      className="gap-2"
                    >
                      <X className="h-4 w-4" />
                      Cancel
                    </Button>
                    <Button
                      size="sm"
                      onClick={handleSave}
                      loading={loading}
                      className="gap-2"
                    >
                      <Save className="h-4 w-4" />
                      Save Changes
                    </Button>
                  </div>
                )}
              </div>

              <div className="space-y-6">
                {isEditing ? (
                  <>
                    <TextBox
                      label="Full Name"
                      name="name"
                      value={formData.name}
                      onChange={(val) => setFormData({ ...formData, name: val })}
                      icon={<User className="h-5 w-5" />}
                    />
                    <TextBox
                      label="Email Address"
                      name="email"
                      value={formData.email}
                      onChange={(val) => setFormData({ ...formData, email: val })}
                      type="email"
                      icon={<Mail className="h-5 w-5" />}
                    />
                    <TextBox
                      label="Phone Number"
                      name="phone"
                      value={formData.phone}
                      onChange={(val) => setFormData({ ...formData, phone: val })}
                      placeholder="Enter your phone number"
                      icon={<Phone className="h-5 w-5" />}
                    />
                    <TextBox
                      label="Address"
                      name="address"
                      value={formData.address}
                      onChange={(val) => setFormData({ ...formData, address: val })}
                      placeholder="Enter your address"
                      icon={<MapPin className="h-5 w-5" />}
                    />
                  </>
                ) : (
                  <>
                    <InfoField
                      icon={<User className="h-5 w-5" />}
                      label="Full Name"
                      value={user?.name || "Not provided"}
                    />
                    <InfoField
                      icon={<Mail className="h-5 w-5" />}
                      label="Email Address"
                      value={user?.email || "Not provided"}
                    />
                    <InfoField
                      icon={<Phone className="h-5 w-5" />}
                      label="Phone Number"
                      value="Not provided"
                    />
                    <InfoField
                      icon={<MapPin className="h-5 w-5" />}
                      label="Address"
                      value="Not provided"
                    />
                  </>
                )}
              </div>
            </Card>

            {/* Permissions Card */}
            <Card variant="elevated" className="lg:col-span-3 p-6">
              <Heading level={3} className="mb-4">
                Permissions & Access
              </Heading>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {user?.permissions?.map((permission) => (
                  <div
                    key={permission}
                    className="flex items-center gap-2 p-3 rounded-lg bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-100"
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-200">
                      <Shield className="h-4 w-4 text-purple-700" />
                    </div>
                    <Text variant="small" className="font-medium text-gray-700">
                      {permission.split("-").join(" ")}
                    </Text>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}

/* ---------------- Helper Component ---------------- */

function InfoField({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-4">
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-purple-100 to-pink-100 text-purple-600">
        {icon}
      </div>
      <div className="flex-1">
        <Text variant="small" className="text-gray-600 mb-1">
          {label}
        </Text>
        <Text className="font-medium text-gray-900">{value}</Text>
      </div>
    </div>
  );
}