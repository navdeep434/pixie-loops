"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button, Heading, Text } from "@/components/elements";
import { ChevronLeft, ChevronRight, ShoppingBag, Sparkles } from "lucide-react";

type Slide = {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  cta: {
    text: string;
    link: string;
  };
  emoji: string;
  gradient: string;
};

const slides: Slide[] = [
  {
    id: 1,
    title: "Cozy Handmade Blankets",
    subtitle: "Wrap yourself in warmth",
    description: "Premium crochet blankets crafted with love and the softest yarn",
    cta: { text: "Shop Blankets", link: "/crochet/products/blankets" },
    emoji: "🧣",
    gradient: "from-purple-500 via-pink-500 to-rose-500",
  },
  {
    id: 2,
    title: "Adorable Amigurumi Toys",
    subtitle: "Perfect gifts for loved ones",
    description: "Handcrafted plush toys that bring joy to children and collectors alike",
    cta: { text: "Explore Toys", link: "/crochet/products/toys" },
    emoji: "🧸",
    gradient: "from-rose-500 via-pink-500 to-purple-500",
  },
  {
    id: 3,
    title: "Stylish Crochet Bags",
    subtitle: "Fashion meets function",
    description: "Unique tote bags and accessories handwoven with artisan techniques",
    cta: { text: "View Collection", link: "/crochet/products/bags" },
    emoji: "👜",
    gradient: "from-teal-500 via-purple-500 to-pink-500",
  },
  {
    id: 4,
    title: "Custom Crochet Orders",
    subtitle: "Your vision, our craft",
    description: "Create personalized pieces tailored to your style and needs",
    cta: { text: "Request Custom", link: "/crochet/custom" },
    emoji: "✨",
    gradient: "from-indigo-500 via-purple-500 to-pink-500",
  },
  {
    id: 5,
    title: "Home Decor Collection",
    subtitle: "Transform your space",
    description: "Beautiful cushion covers, doilies, and decorative pieces for every room",
    cta: { text: "Decorate Now", link: "/crochet/products" },
    emoji: "🏠",
    gradient: "from-pink-500 via-rose-500 to-orange-500",
  },
];

export default function HeroCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Auto-slide effect
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, [isPaused]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const current = slides[currentSlide];

  return (
    <section
      className="relative overflow-hidden bg-gradient-to-br from-purple-100 via-pink-50 to-rose-100 py-24 md:py-32"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Animated Background Gradient */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${current.gradient} opacity-20 transition-all duration-1000`}
      />

      {/* Decorative Elements */}
      <div className="absolute top-10 left-10 h-32 w-32 rounded-full bg-purple-300/30 blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-20 h-40 w-40 rounded-full bg-pink-300/30 blur-3xl animate-pulse"></div>

      <div className="relative mx-auto max-w-7xl px-6">
        <div className="grid items-center gap-12 md:grid-cols-2">
          {/* Left Content - Animated */}
          <div
            key={current.id}
            className="space-y-8 animate-in fade-in slide-in-from-left duration-700"
          >
            <div className="inline-flex items-center gap-2 rounded-full bg-white/80 backdrop-blur-sm px-4 py-2 shadow-md">
              <Sparkles className="h-4 w-4 text-purple-600" />
              <Text variant="small" className="font-semibold text-purple-600">
                {current.subtitle}
              </Text>
            </div>

            <Heading level={1} gradient className="leading-tight">
              {current.title}
            </Heading>

            <Text variant="lead" className="text-gray-600">
              {current.description}
            </Text>

            <div className="flex flex-wrap gap-4">
              <Link href={current.cta.link}>
                <Button size="lg" className="gap-2">
                  <ShoppingBag className="h-5 w-5" />
                  {current.cta.text}
                </Button>
              </Link>
              <Link href="/crochet/products">
                <Button variant="outline" size="lg">
                  View All Products
                </Button>
              </Link>
            </div>

            {/* Slide Indicators */}
            <div className="flex items-center gap-3 pt-4">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    index === currentSlide
                      ? "w-8 bg-gradient-to-r from-purple-600 to-pink-600"
                      : "w-2 bg-gray-300 hover:bg-gray-400"
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Right Image - Animated */}
          <div
            key={`image-${current.id}`}
            className="relative animate-in fade-in slide-in-from-right duration-700"
          >
            <div
              className={`aspect-square rounded-3xl bg-gradient-to-br ${current.gradient} shadow-2xl flex items-center justify-center text-9xl transition-all duration-700 hover:scale-105`}
            >
              {current.emoji}
            </div>

            {/* Floating Badge */}
            <div className="absolute -top-4 -right-4 rounded-2xl bg-white p-4 shadow-xl animate-bounce">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-purple-600" />
                <Text className="font-bold">Handmade</Text>
              </div>
            </div>

            {/* Navigation Arrows */}
            <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/90 backdrop-blur-sm p-3 shadow-lg transition hover:bg-white hover:scale-110"
              aria-label="Previous slide"
            >
              <ChevronLeft className="h-6 w-6 text-gray-800" />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/90 backdrop-blur-sm p-3 shadow-lg transition hover:bg-white hover:scale-110"
              aria-label="Next slide"
            >
              <ChevronRight className="h-6 w-6 text-gray-800" />
            </button>
          </div>
        </div>

        {/* Slide Counter */}
        <div className="absolute bottom-8 right-8 rounded-full bg-white/90 backdrop-blur-sm px-4 py-2 shadow-lg">
          <Text variant="small" className="font-semibold text-gray-700">
            {currentSlide + 1} / {slides.length}
          </Text>
        </div>
      </div>
    </section>
  );
}