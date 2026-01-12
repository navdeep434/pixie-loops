import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import { AuthProvider } from '@/contexts/AuthContext';
import { ToastProvider } from "@/components/elements/useToast";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";
import "../globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Admin Dashboard - PixieLoops",
  description: "Manage your crochet business with ease. Handle products, orders, customers, and more.",
  keywords: "admin, dashboard, management, crochet, business",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${playfair.variable} ${inter.variable} bg-gray-50`}>
        <ToastProvider>
          <AuthProvider>
            <div className="flex h-screen overflow-hidden">
              {/* Sidebar */}
              <AdminSidebar />
              
              {/* Main Content Area */}
              <div className="flex-1 flex flex-col overflow-hidden">
                {/* Header */}
                <AdminHeader />
                
                {/* Page Content */}
                <main className="flex-1 overflow-y-auto bg-gray-50 p-6">
                  <div className="max-w-7xl mx-auto">
                    {children}
                  </div>
                </main>
              </div>
            </div>
          </AuthProvider>
        </ToastProvider>
      </body>
    </html>
  );
}