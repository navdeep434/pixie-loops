"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, ReactNode } from "react";
import { ShoppingBag, Menu, X, Heart, User, LogOut, UserCircle, Package } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export default function WebsiteNavbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const pathname = usePathname();
  const { user, isAuthenticated, logout, loading } = useAuth();


  const isActive = (path: string) => pathname?.startsWith(path);

  useEffect(() => {
    setOpen(false);
    setShowUserMenu(false);
  }, [pathname]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = async () => {
    await logout();
    setShowUserMenu(false);
  };

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 backdrop-blur-lg shadow-lg"
          : "bg-white/80 backdrop-blur-md"
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <Link
            href="/crochet"
            className="group flex items-center gap-3 transition-transform hover:scale-105"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-purple-400 via-pink-400 to-rose-400 shadow-lg">
              <span className="text-2xl">🧶</span>
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-2xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 bg-clip-text text-transparent">
                Pixie Loops
              </span>
              <span className="text-xs text-gray-500 -mt-1">Handcrafted with Love</span>
            </div>
          </Link>

          {/* Desktop Menu */}
          <nav className="hidden items-center gap-8 md:flex">
            <NavLink href="/crochet/products" active={isActive("/crochet/products")}>
              Shop
            </NavLink>
            <NavLink href="/crochet/custom" active={isActive("/crochet/custom")}>
              Custom Orders
            </NavLink>
            <NavLink href="/crochet/about" active={isActive("/crochet/about")}>
              About
            </NavLink>
            <NavLink href="/crochet/contact" active={isActive("/crochet/contact")}>
              Contact
            </NavLink>
          </nav>

          {/* Actions */}
          <div className="hidden items-center gap-3 md:flex">
            <Link
              href="/crochet/wishlist"
              className="rounded-full p-2.5 text-gray-600 transition hover:bg-pink-50 hover:text-pink-600"
              aria-label="Wishlist"
            >
              <Heart className="h-5 w-5" />
            </Link>

            {/* User Account Dropdown */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 rounded-full p-2.5 text-gray-600 transition hover:bg-purple-50 hover:text-purple-600"
                  aria-label="Account"
                >
                  <User className="h-5 w-5" />
                  <span className="text-sm font-medium hidden lg:block">{user?.name}</span>
                </button>

                {showUserMenu && (
                  <>
                    {/* Backdrop */}
                    <div 
                      className="fixed inset-0 z-10" 
                      onClick={() => setShowUserMenu(false)}
                    />
                    
                    {/* Dropdown Menu */}
                    <div className="absolute right-0 mt-2 w-56 rounded-xl bg-white shadow-xl border border-gray-100 py-2 z-20">
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-sm font-semibold text-gray-900">{user?.name}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{user?.email}</p>
                        {user?.roles && user.roles.length > 0 && (
                          <div className="mt-2 flex gap-1">
                            {user.roles.map((role:any) => (
                              <span
                                key={role}
                                className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800"
                              >
                                {role}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="py-2">
                        <Link
                          href="/crochet/profile"
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-purple-50 transition"
                          onClick={() => setShowUserMenu(false)}
                        >
                          <UserCircle className="h-4 w-4" />
                          My Profile
                        </Link>
                        <Link
                          href="/crochet/orders"
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-purple-50 transition"
                          onClick={() => setShowUserMenu(false)}
                        >
                          <Package className="h-4 w-4" />
                          My Orders
                        </Link>
                        <Link
                          href="/crochet/wishlist"
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-purple-50 transition"
                          onClick={() => setShowUserMenu(false)}
                        >
                          <Heart className="h-4 w-4" />
                          Wishlist
                        </Link>
                      </div>

                      <div className="border-t border-gray-100 pt-2">
                        <button
                          onClick={handleLogout}
                          className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition"
                        >
                          <LogOut className="h-4 w-4" />
                          Logout
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <Link
                href="/crochet/login"
                className="rounded-full px-4 py-2.5 text-sm font-semibold text-gray-600 transition hover:bg-purple-50 hover:text-purple-600"
                aria-label="Login"
              >
                Login
              </Link>
            )}

            <Link
              href="/crochet/cart"
              className="relative rounded-full bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-2.5 text-sm font-semibold text-white shadow-lg transition hover:shadow-xl hover:scale-105"
            >
              <div className="flex items-center gap-2">
                <ShoppingBag className="h-4 w-4" />
                <span>Cart</span>
              </div>
              <span className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-rose-500 text-xs font-bold text-white shadow-md">
                0
              </span>
            </Link>
          </div>

          {/* Mobile Toggle */}
          <button
            onClick={() => setOpen((prev) => !prev)}
            className="rounded-lg p-2 text-gray-700 transition hover:bg-gray-100 md:hidden"
            aria-label="Toggle menu"
            aria-expanded={open}
            aria-controls="mobile-menu"
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="border-t bg-white shadow-2xl md:hidden">
          <div className="flex flex-col gap-1 px-4 py-6">
            {/* User Info (Mobile) */}
            {isAuthenticated && user && (
              <div className="mb-4 rounded-lg bg-gradient-to-r from-purple-50 to-pink-50 p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-purple-400 to-pink-400 text-white font-semibold">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{user.name}</p>
                    <p className="text-xs text-gray-600">{user.email}</p>
                  </div>
                </div>
              </div>
            )}

            <span className="mb-3 text-xs font-bold uppercase tracking-wider text-gray-400">
              Navigation
            </span>

            <MobileLink href="/crochet/products">
              🛍️ All Products
            </MobileLink>
            <MobileLink href="/crochet/products/blankets">
              🧣 Blankets
            </MobileLink>
            <MobileLink href="/crochet/products/bags">
              👜 Bags
            </MobileLink>
            <MobileLink href="/crochet/products/toys">
              🧸 Toys
            </MobileLink>
            <MobileLink href="/crochet/custom">
              ✨ Custom Orders
            </MobileLink>

            <div className="my-4 border-t"></div>

            <MobileLink href="/crochet/about">
              ℹ️ About Us
            </MobileLink>
            <MobileLink href="/crochet/contact">
              📧 Contact
            </MobileLink>
            <MobileLink href="/crochet/wishlist">
              💖 Wishlist
            </MobileLink>

            {isAuthenticated ? (
              <>
                <MobileLink href="/crochet/profile">
                  👤 My Profile
                </MobileLink>
                <MobileLink href="/crochet/orders">
                  📦 My Orders
                </MobileLink>
                <button
                  onClick={handleLogout}
                  className="rounded-lg px-4 py-3 text-left text-red-600 transition hover:bg-red-50 flex items-center gap-2"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </>
            ) : (
              <MobileLink href="/crochet/login">
                👤 Login
              </MobileLink>
            )}

            <Link
              href="/crochet/cart"
              className="mt-4 flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 py-3 text-center font-semibold text-white shadow-lg"
            >
              <ShoppingBag className="h-5 w-5" />
              Go to Cart
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

/* ---------------- Helper Components ---------------- */

function NavLink({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      className={`relative text-sm font-semibold transition ${
        active
          ? "text-purple-600"
          : "text-gray-700 hover:text-purple-600"
      }`}
    >
      {children}
      {active && (
        <span className="absolute -bottom-1 left-0 h-0.5 w-full rounded-full bg-gradient-to-r from-purple-600 to-pink-600" />
      )}
    </Link>
  );
}

function MobileLink({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      className="rounded-lg px-4 py-3 text-gray-700 transition hover:bg-purple-50 hover:text-purple-600"
    >
      {children}
    </Link>
  );
}