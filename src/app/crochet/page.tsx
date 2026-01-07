import HomeClient from "./home/HomeClient";

/* ---------- TYPES ---------- */
type FeaturedProduct = {
  id: number;
  name: string;
  price: number;
  icon?: string;
};

export const metadata = {
  title: "PixieLoops | Handmade Crochet Treasures",
  description: "Handcrafted crochet items made with love",
};

/* ---------- API FETCH ---------- */
async function getFeaturedProducts(): Promise<FeaturedProduct[]> {
  // 🔁 Replace with real API later
  return [
    { id: 1, name: "Cozy Blanket", price: 45, icon: "🧶" },
    { id: 2, name: "Eco Tote", price: 28, icon: "👜" },
    { id: 3, name: "Amigurumi Friend", price: 32, icon: "🧸" },
  ];

  /*
  const res = await fetch("https://api.pixieloops.com/featured-products", {
    next: { revalidate: 60 }, // ISR
  });
  return res.json();
  */
}

export default async function HomePage() {
  const featuredProducts = await getFeaturedProducts();

  return <HomeClient featuredProducts={featuredProducts} />;
}
