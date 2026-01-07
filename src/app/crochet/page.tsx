import HomeClient from "./home/HomeClient";
import { FeaturedProduct } from "./home/types";

export const metadata = {
  title: "PixieLoops | Handmade Crochet Treasures",
  description: "Handcrafted crochet items made with love",
};

async function getFeaturedProducts(): Promise<FeaturedProduct[]> {
  return [
    {
      id: 1,
      name: "Cozy Blanket",
      price: 2499,
      icon: "🧶",
      category: "Home Decor",
      badge: "best",
    },
    {
      id: 2,
      name: "Eco Tote",
      price: 1499,
      icon: "👜",
      category: "Accessories",
      badge: "new",
    },
    {
      id: 3,
      name: "Amigurumi Friend",
      price: 1799,
      icon: "🧸",
      category: "Toys",
      badge: "handmade",
    },
  ];
}

export default async function HomePage() {
  const featuredProducts = await getFeaturedProducts();
  return <HomeClient featuredProducts={featuredProducts} />;
}
