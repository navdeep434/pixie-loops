"use client";

import Link from "next/link";
import { Button, Heading, Text, Card } from "@/components/elements";
import AboutStats from "./AboutStats";
import AboutDeals from "./AboutDeals";
import { AboutPageData } from "./types";
import { Heart, Sparkles, ShoppingBag, Award } from "lucide-react";

type Props = {
  data: AboutPageData;
};

export default function AboutClient({ data }: Props) {
  return (
    <main className="bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-purple-600 via-pink-600 to-rose-600 py-24 text-white">
        <div className="absolute top-10 left-10 h-40 w-40 rounded-full bg-white/10 blur-3xl"></div>
        <div className="absolute bottom-10 right-10 h-40 w-40 rounded-full bg-white/10 blur-3xl"></div>
        
        <div className="relative mx-auto max-w-5xl px-6 text-center">
          <div className="mb-6 inline-flex items-center justify-center rounded-full bg-white/20 backdrop-blur-sm p-4">
            <Heart className="h-8 w-8 fill-white" />
          </div>
          <Heading level={1} className="text-white mb-4">
            Our Story
          </Heading>
          <Text variant="lead" className="text-white/90">
            Where every stitch carries warmth, care, and creativity
          </Text>
        </div>
      </section>

      {/* Story Section */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="grid gap-12 lg:grid-cols-2 items-center">
          {/* Text Content */}
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full bg-purple-100 px-4 py-2">
              <Sparkles className="h-4 w-4 text-purple-600" />
              <Text variant="small" className="font-semibold text-purple-600">
                Handcrafted with Love Since 2019
              </Text>
            </div>

            <Heading level={2} gradient>
              Handmade with Love 🧶
            </Heading>

            <Text variant="lead" className="text-gray-700">
              PixieLoops was born from a passion for crochet and a belief in the 
              beauty of handmade craftsmanship.
            </Text>

            <div className="space-y-4">
              <Text className="text-gray-600 leading-relaxed">
                Every product we create is thoughtfully designed and carefully 
                handcrafted using premium-quality yarns. We source our materials 
                from trusted suppliers who share our commitment to quality and 
                sustainability.
              </Text>

              <Text className="text-gray-600 leading-relaxed">
                We believe handmade items carry a soul — small imperfections that 
                make each piece unique and special. These aren't flaws; they're 
                signatures of human touch and care that went into creating something 
                just for you.
              </Text>

              <Text className="text-gray-600 leading-relaxed">
                Whether for yourself or someone special, our products are crafted 
                to be cherished for years. Each stitch tells a story, and we're 
                honored to be part of yours.
              </Text>
            </div>

            <div className="flex flex-wrap gap-4 pt-4">
              <Link href="/crochet/products">
                <Button size="lg" className="gap-2">
                  <ShoppingBag className="h-5 w-5" />
                  Shop Our Collection
                </Button>
              </Link>
              <Link href="/crochet/custom">
                <Button variant="outline" size="lg">
                  Custom Orders
                </Button>
              </Link>
            </div>
          </div>

          {/* Image/Visual */}
          <div className="relative">
            <Card variant="gradient" className="aspect-square flex items-center justify-center text-9xl shadow-2xl">
              🧵
            </Card>
            {/* Floating Elements */}
            <div className="absolute -top-4 -right-4 rounded-2xl bg-white p-4 shadow-xl">
              <div className="flex items-center gap-2">
                <Award className="h-5 w-5 text-amber-500" />
                <Text className="font-bold">Premium Quality</Text>
              </div>
            </div>
            <div className="absolute -bottom-4 -left-4 rounded-2xl bg-white p-4 shadow-xl">
              <div className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-rose-500 fill-rose-500" />
                <Text className="font-bold">Made with Love</Text>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-12 text-center">
            <Heading level={2} gradient className="mb-4">
              Our Values
            </Heading>
            <Text variant="lead" className="text-gray-600">
              The principles that guide everything we create
            </Text>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: "🎨",
                title: "Creativity",
                description: "Every piece is a unique work of art, designed with imagination and care",
              },
              {
                icon: "✨",
                title: "Quality",
                description: "We use only premium yarns and materials for lasting beauty",
              },
              {
                icon: "💚",
                title: "Sustainability",
                description: "Eco-friendly practices and ethically sourced materials",
              },
              {
                icon: "🤝",
                title: "Community",
                description: "Supporting local artisans and building meaningful connections",
              },
            ].map((value, idx) => (
              <Card key={idx} variant="bordered" className="p-6 text-center space-y-4 hover:shadow-xl transition-shadow">
                <div className="text-5xl">{value.icon}</div>
                <Heading level={5}>{value.title}</Heading>
                <Text variant="small" className="text-gray-600">
                  {value.description}
                </Text>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <AboutStats stats={data.stats} />

      {/* Best Deals */}
      <AboutDeals deals={data.deals} />

      {/* CTA Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-purple-900 via-pink-900 to-rose-900 py-20 text-white">
        <div className="absolute top-0 left-0 h-64 w-64 rounded-full bg-white/10 blur-3xl"></div>
        <div className="absolute bottom-0 right-0 h-64 w-64 rounded-full bg-white/10 blur-3xl"></div>
        
        <div className="relative mx-auto max-w-5xl px-6 text-center">
          <div className="mb-6 inline-flex items-center justify-center rounded-full bg-white/20 backdrop-blur-sm p-4">
            <Heart className="h-8 w-8 fill-white" />
          </div>
          <Heading level={2} className="text-white mb-4">
            Thank You for Supporting Handmade 💛
          </Heading>
          <Text variant="lead" className="text-white/90 mb-8">
            Explore our collection and find something made just for you
          </Text>

          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/crochet/products">
              <Button size="lg" variant="secondary" className="gap-2">
                <ShoppingBag className="h-5 w-5" />
                Browse Products
              </Button>
            </Link>
            <Link href="/crochet/contact">
              <Button size="lg" variant="outline" className="bg-white/10 border-white text-white hover:bg-white hover:text-purple-600">
                Get In Touch
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}