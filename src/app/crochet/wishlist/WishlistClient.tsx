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
  Heart,
  Share2,
  Star,
  ShoppingCart,
} from "lucide-react";

type WishlistItem = {
  id: number;
  name: string;
  price: number;
  icon: string;
  description: string;
  badge?: "handmade" | "new" | "sale" | "best";
  inStock: boolean;
  rating?: number;
};

export default function WishlistClient() {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([
    {
      id: 1,
      name: "Cozy Baby Blanket",
      price: 2499,
      icon: "🧣",
      description: "Soft and warm baby blanket",
      badge: "handmade",
      inStock: true,
      rating: 4.9,
    },
    {
      id: 2,
      name: "Adorable Teddy Bear",
      price: 1299,
      icon: "🧸",
      description: "Cute handcrafted teddy toy",
      badge: "new",
      inStock: true,
      rating: 5.0,
    },
    {
      id: 3,
      name: "Bohemian Tote Bag",
      price: 1899,
      icon: "👜",
      description: "Spacious and stylish tote",
      badge: "best",
      inStock: true,
      rating: 4.8,
    },
    {
      id: 4,
      name: "Rainbow Cushion Cover",
      price: 899,
      icon: "🌈",
      description: "Colorful cushion cover",
      badge: "sale",
      inStock: false,
      rating: 4.7,
    },
    {
      id: 5,
      name: "Vintage Doily Set",
      price: 1499,
      icon: "✨",
      description: "Elegant crochet doily set",
      inStock: true,
      rating: 4.9,
    },
  ]);

  const { showToast } = useToast();

  const removeFromWishlist = (id: number) => {
    const item = wishlistItems.find((i) => i.id === id);
    setWishlistItems((items) => items.filter((item) => item.id !== id));
    showToast(`${item?.name} removed from wishlist`, "info");
  };

  const addToCart = (item: WishlistItem) => {
    if (!item.inStock) {
      showToast("This item is currently out of stock", "error");
      return;
    }
    showToast(`${item.name} added to cart! 🛒`, "success");
  };

  const addAllToCart = () => {
    const inStockItems = wishlistItems.filter((item) => item.inStock);
    if (inStockItems.length === 0) {
      showToast("No items in stock to add", "error");
      return;
    }
    showToast(`${inStockItems.length} items added to cart! 🛒`, "success");
  };

  const shareWishlist = () => {
    if (navigator.share) {
      navigator
        .share({
          title: "My PixieLoops Wishlist",
          text: "Check out my favorite handmade crochet items!",
          url: window.location.href,
        })
        .then(() => showToast("Wishlist shared!", "success"))
        .catch(() => {});
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      showToast("Wishlist link copied to clipboard!", "success");
    }
  };

  const inStockCount = wishlistItems.filter((item) => item.inStock).length;
  const totalValue = wishlistItems.reduce((sum, item) => sum + item.price, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <Heading level={1} gradient className="mb-2">
                My Wishlist
              </Heading>
              <Text variant="muted">
                {wishlistItems.length} {wishlistItems.length === 1 ? "item" : "items"} saved
              </Text>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button variant="outline" onClick={shareWishlist} className="gap-2">
                <Share2 className="h-4 w-4" />
                Share
              </Button>
              {inStockCount > 0 && (
                <Button onClick={addAllToCart} className="gap-2">
                  <ShoppingCart className="h-4 w-4" />
                  Add All to Cart ({inStockCount})
                </Button>
              )}
            </div>
          </div>
        </div>

        {wishlistItems.length === 0 ? (
          // Empty Wishlist
          <Card variant="elevated" className="p-12 text-center">
            <div className="flex flex-col items-center gap-4">
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-purple-100 to-pink-100">
                <Heart className="h-12 w-12 text-purple-400" />
              </div>
              <Heading level={3} className="text-gray-600">
                Your wishlist is empty
              </Heading>
              <Text variant="muted">
                Save your favorite items to shop later
              </Text>
              <Link href="/crochet/products">
                <Button size="lg" className="gap-2 mt-4">
                  <ShoppingBag className="h-5 w-5" />
                  Explore Products
                </Button>
              </Link>
            </div>
          </Card>
        ) : (
          <div className="grid gap-8 lg:grid-cols-4">
            {/* Wishlist Items */}
            <div className="lg:col-span-3">
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {wishlistItems.map((item) => (
                  <Card
                    key={item.id}
                    variant="elevated"
                    className="group overflow-hidden"
                  >
                    {/* Product Image */}
                    <div className="relative bg-gradient-to-br from-purple-50 to-pink-50 flex h-56 items-center justify-center text-6xl transition-transform group-hover:scale-105">
                      {item.icon}

                      {/* Badge */}
                      {item.badge && (
                        <div className="absolute top-3 left-3">
                          <Badge variant={item.badge} showIcon>
                            {item.badge}
                          </Badge>
                        </div>
                      )}

                      {/* Stock Status */}
                      {!item.inStock && (
                        <div className="absolute top-3 right-3">
                          <Badge variant="default">Out of Stock</Badge>
                        </div>
                      )}

                      {/* Wishlist Button */}
                      <button
                        onClick={() => removeFromWishlist(item.id)}
                        className="absolute top-3 right-3 rounded-full bg-white/90 backdrop-blur-sm p-2 shadow-lg transition hover:bg-white hover:scale-110"
                      >
                        <Heart className="h-5 w-5 text-rose-500 fill-rose-500" />
                      </button>
                    </div>

                    {/* Product Details */}
                    <div className="p-5 space-y-3">
                      <div>
                        <Heading level={5} className="mb-1 line-clamp-1">
                          {item.name}
                        </Heading>
                        <Text variant="small" className="text-gray-500 line-clamp-2">
                          {item.description}
                        </Text>
                      </div>

                      {/* Rating */}
                      {item.rating && (
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                            <Text variant="small" className="font-semibold">
                              {item.rating.toFixed(1)}
                            </Text>
                          </div>
                        </div>
                      )}

                      {/* Price and Actions */}
                      <div className="space-y-3 pt-2 border-t">
                        <div className="flex items-center justify-between">
                          <div>
                            <Text variant="small" className="text-gray-500">
                              Price
                            </Text>
                            <Heading level={4} className="text-purple-600">
                              ₹{item.price}
                            </Heading>
                          </div>
                        </div>

                        <Button
                          size="sm"
                          disabled={!item.inStock}
                          onClick={() => addToCart(item)}
                          className="w-full gap-2"
                        >
                          <ShoppingBag className="h-4 w-4" />
                          {item.inStock ? "Add to Cart" : "Out of Stock"}
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {/* Sidebar Summary */}
            <div className="space-y-6">
              {/* Summary Card */}
              <Card variant="elevated" className="p-6 sticky top-24">
                <Heading level={5} className="mb-4">
                  Wishlist Summary
                </Heading>

                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b">
                    <Text variant="small" className="text-gray-600">
                      Total Items
                    </Text>
                    <Text className="font-semibold text-lg">
                      {wishlistItems.length}
                    </Text>
                  </div>

                  <div className="flex items-center justify-between pb-3 border-b">
                    <Text variant="small" className="text-gray-600">
                      In Stock
                    </Text>
                    <Text className="font-semibold text-lg text-emerald-600">
                      {inStockCount}
                    </Text>
                  </div>

                  <div className="flex items-center justify-between pb-3 border-b">
                    <Text variant="small" className="text-gray-600">
                      Total Value
                    </Text>
                    <Heading level={4} className="text-purple-600">
                      ₹{totalValue}
                    </Heading>
                  </div>

                  {inStockCount > 0 && (
                    <>
                      <Button
                        size="lg"
                        className="w-full gap-2 mt-4"
                        onClick={addAllToCart}
                      >
                        <ShoppingCart className="h-5 w-5" />
                        Add All to Cart
                      </Button>
                      <Text variant="small" className="text-center text-gray-500">
                        {inStockCount} {inStockCount === 1 ? "item" : "items"} ready
                        to purchase
                      </Text>
                    </>
                  )}
                </div>
              </Card>

              {/* Quick Actions */}
              <Card
                variant="bordered"
                className="p-6 bg-gradient-to-br from-purple-50 to-pink-50"
              >
                <Heading level={6} className="mb-3">
                  Quick Actions
                </Heading>
                <div className="space-y-2">
                  <Link href="/crochet/products">
                    <Button variant="outline" size="sm" className="w-full gap-2">
                      <ShoppingBag className="h-4 w-4" />
                      Continue Shopping
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full gap-2"
                    onClick={shareWishlist}
                  >
                    <Share2 className="h-4 w-4" />
                    Share Wishlist
                  </Button>
                </div>
              </Card>

              {/* Tips */}
              <Card variant="bordered" className="p-6">
                <div className="flex items-start gap-3">
                  <Heart className="h-5 w-5 text-rose-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <Text className="font-semibold mb-1">Pro Tip</Text>
                    <Text variant="small" className="text-gray-600">
                      Items in your wishlist may sell out or change price. Add them
                      to cart to secure your favorites!
                    </Text>
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