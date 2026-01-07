"use client";

import { useState } from "react";
import { Category, Product } from "./types";
import CategoryTree from "./CategoryTree";
import { 
  Card, 
  Button, 
  Text, 
  Heading, 
  Badge,
  Dropdown,
  useToast,
} from "@/components/elements";
import { 
  ShoppingBag, 
  Heart, 
  Star, 
  Filter,
  X,
} from "lucide-react";

type Props = {
  categories: Category[];
  products: Product[];
};

type SortOption = "default" | "price-low" | "price-high" | "rating" | "name";

export default function ProductsClient({
  categories,
  products,
}: Props) {
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>("default");
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const { showToast } = useToast();

  // Filter products by category
  const filteredProducts = selectedCategory
    ? products.filter((p) => p.categoryId === selectedCategory)
    : products;

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return a.price - b.price;
      case "price-high":
        return b.price - a.price;
      case "rating":
        return (b.rating || 0) - (a.rating || 0);
      case "name":
        return a.name.localeCompare(b.name);
      default:
        return 0;
    }
  });

  const handleAddToCart = (productName: string) => {
    showToast(`${productName} added to cart! 🛒`, "success");
  };

  const handleAddToWishlist = (productName: string) => {
    showToast(`${productName} added to wishlist! 💖`, "success");
  };

  const sortOptions = [
    { label: "Default", value: "default" },
    { label: "Price: Low to High", value: "price-low" },
    { label: "Price: High to Low", value: "price-high" },
    { label: "Highest Rated", value: "rating" },
    { label: "Name: A to Z", value: "name" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50">
      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Heading level={1} gradient className="mb-2">
            Shop Our Collection
          </Heading>
          <Text variant="lead" className="text-gray-600">
            Discover handcrafted crochet treasures made with love
          </Text>
        </div>

        {/* Mobile Filter Button */}
        <div className="mb-6 flex items-center justify-between lg:hidden">
          <Button
            variant="outline"
            onClick={() => setMobileFilterOpen(true)}
            className="gap-2"
          >
            <Filter className="h-4 w-4" />
            Filters
          </Button>
          <Dropdown
            value={sortBy}
            options={sortOptions}
            onChange={(value) => setSortBy(value as SortOption)}
            placeholder="Sort by"
          />
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block">
            <Card variant="elevated" className="sticky top-24 p-6">
              <div className="mb-6 flex items-center justify-between">
                <Heading level={4}>Categories</Heading>
                {selectedCategory && (
                  <button
                    onClick={() => setSelectedCategory(null)}
                    className="text-xs text-purple-600 hover:text-purple-700 font-medium"
                  >
                    Clear
                  </button>
                )}
              </div>
              <CategoryTree
                categories={categories}
                onSelect={setSelectedCategory}
                selectedCategory={selectedCategory}
              />
            </Card>
          </aside>

          {/* Mobile Sidebar Modal */}
          {mobileFilterOpen && (
            <div className="fixed inset-0 z-50 lg:hidden">
              <div 
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={() => setMobileFilterOpen(false)}
              />
              <div className="absolute inset-y-0 left-0 w-80 bg-white shadow-2xl overflow-y-auto">
                <div className="sticky top-0 bg-white border-b border-gray-100 p-4 flex items-center justify-between">
                  <Heading level={4}>Filters</Heading>
                  <button
                    onClick={() => setMobileFilterOpen(false)}
                    className="rounded-lg p-2 hover:bg-gray-100"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
                <div className="p-4">
                  <CategoryTree
                    categories={categories}
                    onSelect={(id) => {
                      setSelectedCategory(id);
                      setMobileFilterOpen(false);
                    }}
                    selectedCategory={selectedCategory}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Product Grid */}
          <section className="lg:col-span-3">
            {/* Sort and Results Count */}
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <Text variant="small" className="text-gray-600">
                Showing {sortedProducts.length} {sortedProducts.length === 1 ? 'product' : 'products'}
              </Text>
              <div className="hidden lg:block w-64">
                <Dropdown
                  value={sortBy}
                  options={sortOptions}
                  onChange={(value) => setSortBy(value as SortOption)}
                  placeholder="Sort by"
                />
              </div>
            </div>

            {/* Products */}
            {sortedProducts.length === 0 ? (
              <Card variant="bordered" className="p-12 text-center">
                <div className="flex flex-col items-center gap-4">
                  <div className="text-6xl">🔍</div>
                  <Heading level={3} className="text-gray-600">
                    No products found
                  </Heading>
                  <Text variant="muted">
                    Try adjusting your filters or browse all products
                  </Text>
                  {selectedCategory && (
                    <Button
                      variant="outline"
                      onClick={() => setSelectedCategory(null)}
                    >
                      Clear Filters
                    </Button>
                  )}
                </div>
              </Card>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {sortedProducts.map((product) => (
                  <Card 
                    key={product.id} 
                    variant="elevated"
                    className="group overflow-hidden"
                  >
                    {/* Product Image */}
                    <div className="relative bg-gradient-to-br from-purple-50 to-pink-50 flex h-56 items-center justify-center text-6xl transition-transform group-hover:scale-105">
                      {product.icon ?? "🧶"}
                      
                      {/* Badge */}
                      {product.badge && (
                        <div className="absolute top-3 left-3">
                          <Badge variant={product.badge} showIcon>
                            {product.badge}
                          </Badge>
                        </div>
                      )}

                      {/* Stock Status */}
                      {!product.inStock && (
                        <div className="absolute top-3 right-3">
                          <Badge variant="default">
                            Out of Stock
                          </Badge>
                        </div>
                      )}

                      {/* Wishlist Button */}
                      <button
                        onClick={() => handleAddToWishlist(product.name)}
                        className="absolute top-3 right-3 rounded-full bg-white/90 backdrop-blur-sm p-2 shadow-lg transition hover:bg-white hover:scale-110"
                      >
                        <Heart className="h-5 w-5 text-pink-500" />
                      </button>
                    </div>

                    {/* Product Details */}
                    <div className="p-5 space-y-3">
                      <div>
                        <Heading level={5} className="mb-1 line-clamp-1">
                          {product.name}
                        </Heading>
                        {product.description && (
                          <Text variant="small" className="text-gray-500 line-clamp-2">
                            {product.description}
                          </Text>
                        )}
                      </div>

                      {/* Rating */}
                      {product.rating && (
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                            <Text variant="small" className="font-semibold">
                              {product.rating.toFixed(1)}
                            </Text>
                          </div>
                        </div>
                      )}

                      {/* Price and Action */}
                      <div className="flex items-center justify-between pt-2 border-t">
                        <div>
                          <Text variant="small" className="text-gray-500">
                            Price
                          </Text>
                          <Heading level={4} className="text-purple-600">
                            ₹{product.price}
                          </Heading>
                        </div>

                        <Button
                          size="sm"
                          disabled={!product.inStock}
                          onClick={() => handleAddToCart(product.name)}
                          className="gap-2"
                        >
                          <ShoppingBag className="h-4 w-4" />
                          {product.inStock ? "Add" : "Unavailable"}
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}