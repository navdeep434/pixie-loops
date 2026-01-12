import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import { AuthProvider } from '@/contexts/AuthContext';
import { ToastProvider } from "@/components/elements/useToast";
// import "./website.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PixieLoops - Handcrafted Crochet Treasures",
  description: "Discover unique, handmade crochet products crafted with love and care. From cozy blankets to adorable amigurumi toys.",
  keywords: "crochet, handmade, crafts, blankets, toys, bags, custom orders",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${playfair.variable} ${inter.variable}`}>
        <ToastProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </ToastProvider>
      </body>
    </html>
  );
}