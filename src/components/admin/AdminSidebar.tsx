"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Heart,
  MessageSquare,
  Settings,
  FileText,
  TrendingUp,
  Tag,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from "lucide-react";

interface User {
  id: number;
  name: string;
  email: string;
  roles: string[];
  permissions: string[];
}

interface AdminSidebarProps {
  user: User;
}

type NavItem = {
  name: string;
  href: string;
  icon: React.ElementType;
  permission?: string;
  badge?: number;
};

const navigation: NavItem[] = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Products", href: "/admin/products", icon: Package, permission: "view-products" },
  { name: "Orders", href: "/admin/orders", icon: ShoppingCart, permission: "view-orders" },
  { name: "Customers", href: "/admin/customers", icon: Users, permission: "view-users" },
  { name: "Custom Requests", href: "/admin/custom-requests", icon: Heart },
  { name: "Reviews", href: "/admin/reviews", icon: MessageSquare },
  { name: "Categories", href: "/admin/categories", icon: Tag },
  { name: "Analytics", href: "/admin/analytics", icon: TrendingUp },
  { name: "Content", href: "/admin/content", icon: FileText },
  { name: "Settings", href: "/admin/settings", icon: Settings },
];

export default function AdminSidebar({ user }: AdminSidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  const firstLetter = user?.name?.charAt(0).toUpperCase() ?? "A";

  const hasPermission = (permission?: string) => {
    if (!permission) return true;
    return user.permissions?.includes(permission);
  };

  return (
    <aside
      className={`bg-gradient-to-b from-purple-900 via-purple-800 to-pink-900 text-white transition-all duration-300 ${
        collapsed ? "w-20" : "w-64"
      } flex flex-col relative`}
    >
      {/* Logo Section */}
      <div className="p-6 border-b border-white/10">
        <Link href="/admin" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-pink-400 to-purple-400 shadow-lg">
            <Sparkles className="h-6 w-6 text-white" />
          </div>
          {!collapsed && (
            <div>
              <h1 className="text-xl font-bold font-serif">PixieLoops</h1>
              <p className="text-xs text-purple-200">Admin Panel</p>
            </div>
          )}
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-3">
        <ul className="space-y-1">
          {navigation
            .filter((item) => hasPermission(item.permission))
            .map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href !== "/admin" && pathname.startsWith(item.href));

              const Icon = item.icon;

              return (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 group relative ${
                      isActive
                        ? "bg-white/20 text-white shadow-lg"
                        : "text-purple-100 hover:bg-white/10 hover:text-white"
                    }`}
                    title={collapsed ? item.name : undefined}
                  >
                    <Icon
                      className={`h-5 w-5 flex-shrink-0 ${
                        isActive ? "text-white" : "text-purple-200"
                      }`}
                    />

                    {!collapsed && (
                      <span className="flex-1 font-medium">{item.name}</span>
                    )}

                    {isActive && (
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-r-full"></div>
                    )}
                  </Link>
                </li>
              );
            })}
        </ul>
      </nav>

      {/* User Section */}
      <div className="border-t border-white/10 p-4">
        <div
          className={`flex items-center gap-3 ${
            collapsed ? "justify-center" : ""
          }`}
        >
          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-pink-400 to-purple-400 flex items-center justify-center text-white font-bold shadow-lg">
            {firstLetter}
          </div>

          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate">
                {user.name}
              </p>
              <p className="text-xs text-purple-200 truncate">
                {user.email}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Toggle Button */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-20 flex h-6 w-6 items-center justify-center rounded-full bg-white text-purple-900 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110"
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {collapsed ? (
          <ChevronRight className="h-4 w-4" />
        ) : (
          <ChevronLeft className="h-4 w-4" />
        )}
      </button>

      {/* Decorative Glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-pink-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl"></div>
      </div>
    </aside>
  );
}
