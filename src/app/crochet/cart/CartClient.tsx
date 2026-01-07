"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Button,
  Card,
  Heading,
  Text,
  Badge,
  useToast,
} from "@/components/elements";
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  Gift,
  Tag,
  Lock,
} from "lucide-react";

type CartItem = {
  id: number;
  name: string;
  price: number;
  quantity: number;
  icon: string;
  badge?: "handmade" | "new" | "sale";
};

export default function CartClient() {
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      id: 1,
      name: "Cozy Baby Blanket",
      price: 2499,
      quantity: 1,
      icon: "🧣",
      badge: "handmade",
    },
    {
      id: 2,
      name: "Adorable Teddy Bear",
      price: 1299,
      quantity: 2,
      icon: "🧸",
      badge: "new",
    },
    {
      id: 3,
      name: "Bohemian Tote Bag",
      price: 1899,
      quantity: 1,
      icon: "👜",
    },
  ]);

  const [promoCode, setPromoCode] = useState("");
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null);
  const { showToast } = useToast();

  const updateQuantity = (id: number, delta: number) => {
    setCartItems((items) =>
      items.map((item) => {
        if (item.id === id) {
          const newQuantity = Math.max(1, item.quantity + delta);
          return { ...item, quantity: newQuantity };
        }
        return item;
      })
    );
  };

  const removeItem = (id: number) => {
    const item = cartItems.find((i) => i.id === id);
    setCartItems((items) => items.filter((item) => item.id !== id));
    showToast(`${item?.name} removed from cart`, "info");
  };

  const applyPromoCode = () => {
    if (promoCode.toUpperCase() === "PIXIE10") {
      setAppliedPromo("PIXIE10");
      showToast("Promo code applied! 10% discount 🎉", "success");
    } else {
      showToast("Invalid promo code", "error");
    }
  };

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const discount = appliedPromo === "PIXIE10" ? subtotal * 0.1 : 0;
  const shipping = subtotal > 2000 ? 0 : 99;
  const tax = (subtotal - discount) * 0.18; // 18% GST
  const total = subtotal - discount + shipping + tax;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Heading level={1} gradient className="mb-2">
            Shopping Cart
          </Heading>
          <Text variant="muted">
            {cartItems.length} {cartItems.length === 1 ? "item" : "items"} in your cart
          </Text>
        </div>

        {cartItems.length === 0 ? (
          // Empty Cart
          <Card variant="elevated" className="p-12 text-center">
            <div className="flex flex-col items-center gap-4">
              <div className="text-8xl">🛒</div>
              <Heading level={3} className="text-gray-600">
                Your cart is empty
              </Heading>
              <Text variant="muted">
                Looks like you haven't added any items yet
              </Text>
              <Link href="/crochet/products">
                <Button size="lg" className="gap-2 mt-4">
                  <ShoppingBag className="h-5 w-5" />
                  Continue Shopping
                </Button>
              </Link>
            </div>
          </Card>
        ) : (
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <Card key={item.id} variant="elevated" className="p-6">
                  <div className="flex gap-6">
                    {/* Product Image */}
                    <div className="relative flex-shrink-0">
                      <div className="h-32 w-32 rounded-xl bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center text-5xl">
                        {item.icon}
                      </div>
                      {item.badge && (
                        <div className="absolute -top-2 -right-2">
                          <Badge variant={item.badge} showIcon />
                        </div>
                      )}
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <Heading level={5} className="mb-1">
                          {item.name}
                        </Heading>
                        <Text variant="small" className="text-gray-500">
                          Handcrafted with premium yarn
                        </Text>
                      </div>

                      <div className="flex items-center justify-between mt-4">
                        {/* Quantity Controls */}
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => updateQuantity(item.id, -1)}
                            disabled={item.quantity <= 1}
                            className="rounded-lg border-2 border-gray-200 p-2 hover:border-purple-300 hover:bg-purple-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          <Text className="font-semibold w-8 text-center">
                            {item.quantity}
                          </Text>
                          <button
                            onClick={() => updateQuantity(item.id, 1)}
                            className="rounded-lg border-2 border-gray-200 p-2 hover:border-purple-300 hover:bg-purple-50 transition"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>

                        {/* Price */}
                        <div className="text-right">
                          <Text variant="small" className="text-gray-500">
                            ₹{item.price} each
                          </Text>
                          <Heading level={4} className="text-purple-600">
                            ₹{item.price * item.quantity}
                          </Heading>
                        </div>
                      </div>
                    </div>

                    {/* Remove Button */}
                    <button
                      onClick={() => removeItem(item.id)}
                      className="rounded-lg p-2 text-gray-400 hover:bg-rose-50 hover:text-rose-600 transition"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </Card>
              ))}

              {/* Continue Shopping */}
              <Link href="/crochet/products">
                <Button variant="outline" className="w-full gap-2">
                  <ShoppingBag className="h-5 w-5" />
                  Continue Shopping
                </Button>
              </Link>
            </div>

            {/* Order Summary */}
            <div className="space-y-6">
              {/* Promo Code */}
              <Card variant="elevated" className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Tag className="h-5 w-5 text-purple-600" />
                  <Heading level={5}>Promo Code</Heading>
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                    placeholder="Enter code"
                    disabled={!!appliedPromo}
                    className="flex-1 rounded-xl border-2 border-gray-200 px-4 py-2 outline-none transition focus:border-purple-500 focus:ring-4 focus:ring-purple-100 disabled:bg-gray-50 disabled:cursor-not-allowed"
                  />
                  <Button
                    size="sm"
                    onClick={applyPromoCode}
                    disabled={!!appliedPromo || !promoCode}
                  >
                    Apply
                  </Button>
                </div>
                {appliedPromo && (
                  <div className="mt-3 flex items-center gap-2">
                    <Badge variant="best">
                      {appliedPromo} - 10% OFF
                    </Badge>
                    <button
                      onClick={() => {
                        setAppliedPromo(null);
                        setPromoCode("");
                        showToast("Promo code removed", "info");
                      }}
                      className="text-xs text-rose-600 hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                )}
                <Text variant="small" className="text-gray-500 mt-3">
                  Try code: <span className="font-semibold">PIXIE10</span>
                </Text>
              </Card>

              {/* Summary */}
              <Card variant="elevated" className="p-6">
                <Heading level={5} className="mb-4">
                  Order Summary
                </Heading>

                <div className="space-y-3">
                  <div className="flex justify-between">
                    <Text variant="small">Subtotal</Text>
                    <Text variant="small" className="font-semibold">
                      ₹{subtotal}
                    </Text>
                  </div>

                  {discount > 0 && (
                    <div className="flex justify-between text-emerald-600">
                      <Text variant="small">Discount (10%)</Text>
                      <Text variant="small" className="font-semibold">
                        -₹{Math.round(discount)}
                      </Text>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <Text variant="small">Shipping</Text>
                    <Text variant="small" className="font-semibold">
                      {shipping === 0 ? (
                        <span className="text-emerald-600">FREE</span>
                      ) : (
                        `₹${shipping}`
                      )}
                    </Text>
                  </div>

                  <div className="flex justify-between">
                    <Text variant="small">Tax (GST 18%)</Text>
                    <Text variant="small" className="font-semibold">
                      ₹{Math.round(tax)}
                    </Text>
                  </div>

                  <div className="border-t pt-3">
                    <div className="flex justify-between items-baseline">
                      <Heading level={5}>Total</Heading>
                      <Heading level={3} className="text-purple-600">
                        ₹{Math.round(total)}
                      </Heading>
                    </div>
                  </div>
                </div>

                <Button
                  size="lg"
                  className="w-full gap-2 mt-6"
                  onClick={() => showToast("Proceeding to checkout...", "success")}
                >
                  <Lock className="h-5 w-5" />
                  Proceed to Checkout
                  <ArrowRight className="h-5 w-5" />
                </Button>

                {shipping > 0 && (
                  <Text variant="small" className="text-center text-gray-500 mt-3">
                    Add ₹{2000 - subtotal} more for free shipping!
                  </Text>
                )}
              </Card>

              {/* Benefits */}
              <Card variant="bordered" className="p-6 bg-gradient-to-br from-purple-50 to-pink-50">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Gift className="h-5 w-5 text-purple-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <Text className="font-semibold">Gift Wrapping</Text>
                      <Text variant="small" className="text-gray-600">
                        Free gift wrap on all orders
                      </Text>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Lock className="h-5 w-5 text-purple-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <Text className="font-semibold">Secure Checkout</Text>
                      <Text variant="small" className="text-gray-600">
                        Your data is safe with us
                      </Text>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}