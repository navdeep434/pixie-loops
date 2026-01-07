import { DealType } from "./types";
import { Card, Heading, Text, Badge, Button } from "@/components/elements";
import { ShoppingBag, Star } from "lucide-react";
import Link from "next/link";

export default function AboutDeals({ deals }: { deals: DealType[] }) {
  const dealIcons = ["🧣", "🐰", "👜"]; // Icons for each deal

  return (
    <section className="py-20 bg-gradient-to-br from-purple-50 to-pink-50">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-12 text-center">
          <Heading level={2} gradient className="mb-4">
            Best Selling Creations
          </Heading>
          <Text variant="lead" className="text-gray-600">
            Our most loved handcrafted items
          </Text>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {deals.map((deal, idx) => (
            <Card 
              key={deal.id}
              variant="elevated"
              className="group overflow-hidden"
            >
              {/* Product Image */}
              <div className="relative bg-gradient-to-br from-purple-100 to-pink-100 flex h-64 items-center justify-center text-7xl transition-transform group-hover:scale-105">
                {dealIcons[idx] || "🧶"}
                <div className="absolute top-4 right-4">
                  <Badge variant="best" showIcon>
                    Best Seller
                  </Badge>
                </div>
              </div>

              {/* Product Details */}
              <div className="p-6 space-y-4">
                <div>
                  <Heading level={5} className="mb-2">
                    {deal.name}
                  </Heading>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                    ))}
                    <Text variant="small" className="ml-2 text-gray-600">
                      (4.9)
                    </Text>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t">
                  <div>
                    <Text variant="small" className="text-gray-500">
                      Starting at
                    </Text>
                    <Heading level={3} className="text-purple-600">
                      ₹{deal.price}
                    </Heading>
                  </div>
                  <Link href="/crochet/products">
                    <Button size="sm" className="gap-2">
                      <ShoppingBag className="h-4 w-4" />
                      View
                    </Button>
                  </Link>
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
  );
}