"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  Button, 
  TextBox, 
  Card, 
  Badge, 
  Heading, 
  Text,
  useToast,
} from "@/components/elements";
import { 
  ShoppingBag, 
  Heart, 
  Star, 
  Sparkles, 
  Package, 
  Shield,
  Truck,
  Mail,
} from "lucide-react";

/* ---------- TYPES ---------- */
type FeaturedProduct = {
  id: number;
  name: string;
  price: number;
  icon?: string;
  category: string;
  badge?: "new" | "sale" | "best" | "handmade" | "custom";
};

type Testimonial = {
  id: number;
  name: string;
  rating: number;
  comment: string;
  avatar: string;
};

type Props = {
  featuredProducts: FeaturedProduct[];
  testimonials?: Testimonial[];
};

export default function HomeClient({ featuredProducts, testimonials = [] }: Props) {
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const { showToast } = useToast();

  const handleSubscribe = () => {
    if (newsletterEmail) {
      showToast("Thank you for subscribing! 💖", "success");
      setNewsletterEmail("");
    } else {
      showToast("Please enter a valid email", "error");
    }
  };

  const handleAddToCart = (productName: string) => {
    showToast(`${productName} added to cart! 🛒`, "success");
  };

  return (
    <>
      {/* ================= HERO SECTION ================= */}
      <section className="relative overflow-hidden bg-gradient-to-br from-purple-100 via-pink-50 to-rose-100 py-24 md:py-32">
        {/* Decorative Elements */}
        <div className="absolute top-10 left-10 h-32 w-32 rounded-full bg-purple-300/30 blur-3xl"></div>
        <div className="absolute bottom-20 right-20 h-40 w-40 rounded-full bg-pink-300/30 blur-3xl"></div>
        
        <div className="relative mx-auto max-w-7xl px-6">
          <div className="grid items-center gap-12 md:grid-cols-2">
            {/* Left Content */}
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/80 backdrop-blur-sm px-4 py-2 shadow-md">
                <Sparkles className="h-4 w-4 text-purple-600" />
                <Text variant="small" className="font-semibold text-purple-600">
                  100% Handcrafted with Love
                </Text>
              </div>

              <Heading level={1} gradient className="leading-tight">
                Discover Unique Crochet Treasures
              </Heading>

              <Text variant="lead" className="text-gray-600">
                Each piece is lovingly handcrafted with premium yarn, bringing warmth 
                and personality to your home. From cozy blankets to adorable amigurumi, 
                find something special today.
              </Text>

              <div className="flex flex-wrap gap-4">
                <Link href="/crochet/products">
                  <Button size="lg" className="gap-2">
                    <ShoppingBag className="h-5 w-5" />
                    Shop Collection
                  </Button>
                </Link>
                <Link href="/crochet/custom">
                  <Button variant="outline" size="lg">
                    Custom Orders
                  </Button>
                </Link>
              </div>

              {/* Stats */}
              <div className="flex flex-wrap gap-8 pt-4">
                <div>
                  <Heading level={3} className="text-purple-600">500+</Heading>
                  <Text variant="small" className="text-gray-600">Happy Customers</Text>
                </div>
                <div>
                  <Heading level={3} className="text-pink-600">1000+</Heading>
                  <Text variant="small" className="text-gray-600">Items Crafted</Text>
                </div>
                <div>
                  <Heading level={3} className="text-rose-600">100%</Heading>
                  <Text variant="small" className="text-gray-600">Handmade</Text>
                </div>
              </div>
            </div>

            {/* Right Image Placeholder */}
            <div className="relative">
              <div className="aspect-square rounded-3xl bg-gradient-to-br from-purple-200 via-pink-200 to-rose-200 shadow-2xl flex items-center justify-center text-9xl">
                🧶
              </div>
              {/* Floating Elements */}
              <div className="absolute -top-4 -right-4 rounded-2xl bg-white p-4 shadow-xl">
                <Badge variant="handmade" showIcon>Handmade</Badge>
              </div>
              <div className="absolute -bottom-4 -left-4 rounded-2xl bg-white p-4 shadow-xl">
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
                  <Text className="font-bold">4.9/5.0</Text>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ FEATURED PRODUCTS ============ */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-12 text-center">
            <Heading level={2} gradient className="mb-4">
              Featured Creations
            </Heading>
            <Text variant="lead" className="text-gray-600">
              Explore our handpicked collection of beautiful crochet pieces
            </Text>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {featuredProducts.map((item) => (
              <Card key={item.id} variant="elevated" className="group overflow-hidden">
                {/* Product Image */}
                <div className="relative bg-gradient-to-br from-purple-50 to-pink-50 flex h-64 items-center justify-center text-7xl transition-all group-hover:scale-105">
                  {item.icon ?? "🧶"}
                  {item.badge && (
                    <div className="absolute top-4 right-4">
                      <Badge variant={item.badge} showIcon>
                        {item.badge}
                      </Badge>
                    </div>
                  )}
                </div>

                {/* Product Details */}
                <div className="p-6 space-y-4">
                  <div>
                    <Text variant="small" className="text-purple-600 font-semibold uppercase tracking-wide">
                      {item.category}
                    </Text>
                    <Heading level={4} className="mt-1">
                      {item.name}
                    </Heading>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Text variant="small" className="text-gray-500">Price</Text>
                      <Heading level={3} className="text-purple-600">
                        ₹{item.price}
                      </Heading>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="rounded-full p-3"
                        onClick={() => showToast("Added to wishlist! 💖", "success")}
                      >
                        <Heart className="h-5 w-5" />
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleAddToCart(item.name)}
                      >
                        <ShoppingBag className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link href="/crochet/products">
              <Button variant="outline" size="lg">
                View All Products
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ============ WHY CHOOSE US ============ */}
      <section className="bg-gradient-to-br from-purple-50 to-pink-50 py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-12 text-center">
            <Heading level={2} gradient className="mb-4">
              Why Choose PixieLoops?
            </Heading>
            <Text variant="lead" className="text-gray-600">
              Quality craftsmanship meets exceptional service
            </Text>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: <Sparkles className="h-8 w-8" />,
                title: "100% Handmade",
                description: "Every item is crafted with care and attention to detail",
              },
              {
                icon: <Shield className="h-8 w-8" />,
                title: "Quality Guaranteed",
                description: "Premium yarn and materials for lasting beauty",
              },
              {
                icon: <Truck className="h-8 w-8" />,
                title: "Fast Shipping",
                description: "Quick and secure delivery to your doorstep",
              },
              {
                icon: <Package className="h-8 w-8" />,
                title: "Custom Orders",
                description: "Personalized creations made just for you",
              },
            ].map((feature, idx) => (
              <Card key={idx} variant="bordered" className="p-6 text-center space-y-4">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-purple-600 to-pink-600 text-white">
                  {feature.icon}
                </div>
                <Heading level={5}>{feature.title}</Heading>
                <Text variant="small" className="text-gray-600">
                  {feature.description}
                </Text>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ============ TESTIMONIALS ============ */}
      {testimonials && testimonials.length > 0 && (
        <section className="bg-white py-20">
          <div className="mx-auto max-w-7xl px-6">
            <div className="mb-12 text-center">
              <Heading level={2} gradient className="mb-4">
                What Our Customers Say
              </Heading>
              <Text variant="lead" className="text-gray-600">
                Join our community of happy crafters
              </Text>
            </div>

            <div className="grid gap-8 md:grid-cols-3">
              {testimonials.map((testimonial) => (
                <Card key={testimonial.id} variant="bordered" className="p-6 space-y-4">
                  <div className="flex items-center gap-1">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <Text className="text-gray-700 italic">
                    "{testimonial.comment}"
                  </Text>
                  <div className="flex items-center gap-3 pt-4 border-t">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-purple-400 to-pink-400 text-2xl">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <Text className="font-semibold">{testimonial.name}</Text>
                      <Text variant="small" className="text-gray-500">Verified Customer</Text>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* =============== NEWSLETTER =============== */}
      <section className="relative overflow-hidden bg-gradient-to-br from-purple-600 via-pink-600 to-rose-600 py-20 text-white">
        {/* Decorative Elements */}
        <div className="absolute top-0 left-0 h-64 w-64 rounded-full bg-white/10 blur-3xl"></div>
        <div className="absolute bottom-0 right-0 h-64 w-64 rounded-full bg-white/10 blur-3xl"></div>

        <div className="relative mx-auto max-w-2xl px-6 text-center">
          <div className="mb-8 inline-flex items-center justify-center rounded-full bg-white/20 backdrop-blur-sm p-4">
            <Mail className="h-8 w-8" />
          </div>

          <Heading level={2} className="mb-4 text-white">
            Join Our Yarn Circle
          </Heading>

          <Text variant="lead" className="mb-8 text-white/90">
            Subscribe to get updates on new creations, exclusive offers, and crafting inspiration delivered to your inbox!
          </Text>

          <div className="flex flex-col gap-3 sm:flex-row">
            <TextBox
              name="newsletterEmail"
              value={newsletterEmail}
              onChange={setNewsletterEmail}
              placeholder="Enter your email address"
              type="email"
              className="flex-1"
              icon={<Mail className="h-5 w-5" />}
            />

            <Button
              variant="secondary"
              size="lg"
              onClick={handleSubscribe}
              className="whitespace-nowrap"
            >
              Subscribe Now
            </Button>
          </div>

          <Text variant="small" className="mt-4 text-white/70">
            Join 1000+ crafters already subscribed! No spam, unsubscribe anytime.
          </Text>
        </div>
      </section>

      {/* ============ CTA SECTION ============ */}
      <section className="bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50 py-20">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <Heading level={2} gradient className="mb-4">
            Ready to Find Your Perfect Piece?
          </Heading>
          <Text variant="lead" className="mb-8 text-gray-600">
            Explore our full collection or create something uniquely yours with a custom order
          </Text>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/crochet/products">
              <Button size="lg" className="gap-2">
                <ShoppingBag className="h-5 w-5" />
                Browse Collection
              </Button>
            </Link>
            <Link href="/crochet/custom">
              <Button variant="outline" size="lg" className="gap-2">
                <Sparkles className="h-5 w-5" />
                Request Custom Order
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}