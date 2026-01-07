import HomeClient from "./crochet/home/HomeClient";

export const metadata = {
  title: "PixieLoops | Handmade Crochet Treasures",
  description: "Discover unique, handcrafted crochet products made with love and premium yarn",
};

/* ---------- MOCK DATA ---------- */
async function getFeaturedProducts() {
  // 🔁 Replace with real API later
  return [
    {
      id: 1,
      name: "Cozy Baby Blanket",
      price: 2499,
      icon: "🧣",
      category: "Blankets",
      badge: "handmade" as const,
    },
    {
      id: 2,
      name: "Adorable Teddy Bear",
      price: 1299,
      icon: "🧸",
      category: "Toys",
      badge: "new" as const,
    },
    {
      id: 3,
      name: "Bohemian Tote Bag",
      price: 1899,
      icon: "👜",
      category: "Bags",
      badge: "best" as const,
    },
    {
      id: 4,
      name: "Rainbow Cushion Cover",
      price: 899,
      icon: "🌈",
      category: "Home Decor",
      badge: "sale" as const,
    },
    {
      id: 5,
      name: "Cute Bunny Amigurumi",
      price: 999,
      icon: "🐰",
      category: "Toys",
      badge: "handmade" as const,
    },
    {
      id: 6,
      name: "Vintage Doily Set",
      price: 1499,
      icon: "✨",
      category: "Home Decor",
      badge: "best" as const,
    },
  ];

  /*
  const res = await fetch("https://api.pixieloops.com/featured-products", {
    next: { revalidate: 60 }, // ISR
  });
  return res.json();
  */
}

async function getTestimonials() {
  // 🔁 Replace with real API later
  return [
    {
      id: 1,
      name: "Priya Sharma",
      rating: 5,
      comment: "The baby blanket is absolutely gorgeous! My daughter loves it. The quality is exceptional.",
      avatar: "👩",
    },
    {
      id: 2,
      name: "Rahul Verma",
      rating: 5,
      comment: "Bought a custom order for my wife's birthday. She was thrilled! Highly recommend PixieLoops.",
      avatar: "👨",
    },
    {
      id: 3,
      name: "Sneha Patel",
      rating: 5,
      comment: "Beautiful handcrafted items with so much love and detail. Will definitely order again!",
      avatar: "👩‍🦰",
    },
  ];

  /*
  const res = await fetch("https://api.pixieloops.com/testimonials", {
    next: { revalidate: 3600 }, // ISR
  });
  return res.json();
  */
}

export default async function HomePage() {
  const featuredProducts = await getFeaturedProducts();
  const testimonials = await getTestimonials();

  return (
    <HomeClient
      featuredProducts={featuredProducts}
      testimonials={testimonials}
    />
  );
}