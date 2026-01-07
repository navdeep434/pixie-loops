import AboutClient from "./AboutClient";
import { AboutPageData } from "./types";

export const metadata = {
  title: "About Us | PixieLoops - Our Story",
  description: "Learn the story behind PixieLoops — handmade crochet products crafted with love, care, and premium materials.",
};

async function getAboutData(): Promise<AboutPageData> {
  // 🔁 Replace with API later
  return {
    stats: {
      ordersDelivered: 12500,
      happyCustomers: 8200,
      yearsExperience: 5,
    },
    deals: [
      { id: 1, name: "Cozy Crochet Blanket", price: 2499 },
      { id: 2, name: "Amigurumi Bunny", price: 1299 },
      { id: 3, name: "Handmade Tote Bag", price: 1899 },
    ],
  };
}

export default async function AboutPage() {
  const data = await getAboutData();

  return <AboutClient data={data} />;
}