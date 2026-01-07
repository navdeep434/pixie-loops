"use client";

import Link from "next/link";
import { Instagram, Facebook, Mail, Heart, Send } from "lucide-react";
import { useState } from "react";

export default function WebsiteFooter() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail("");
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  return (
    <footer className="relative overflow-hidden bg-gradient-to-br from-purple-900 via-pink-900 to-rose-900 text-white">
      {/* Decorative Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 h-32 w-32 rounded-full bg-white blur-3xl"></div>
        <div className="absolute bottom-20 right-20 h-40 w-40 rounded-full bg-pink-300 blur-3xl"></div>
      </div>

      <div className="relative mx-auto max-w-7xl px-6 pt-16 pb-8">
        {/* Main Footer Content */}
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
                <span className="text-2xl">🧶</span>
              </div>
              <h3 className="font-serif text-2xl font-bold">PixieLoops</h3>
            </div>
            <p className="mb-6 text-purple-200 leading-relaxed">
              Handcrafted crochet treasures made with premium yarn and endless love. 
              Each piece tells a unique story.
            </p>
            <div className="flex gap-3">
              <SocialLink href="https://instagram.com" aria-label="Instagram">
                <Instagram className="h-5 w-5" />
              </SocialLink>
              <SocialLink href="https://facebook.com" aria-label="Facebook">
                <Facebook className="h-5 w-5" />
              </SocialLink>
              <SocialLink href="mailto:hello@pixieloops.com" aria-label="Email">
                <Mail className="h-5 w-5" />
              </SocialLink>
            </div>
          </div>

          {/* Shop Links */}
          <div>
            <h4 className="mb-6 font-serif text-lg font-semibold text-pink-200">Shop</h4>
            <ul className="space-y-3">
              <FooterLink href="/crochet/products">All Products</FooterLink>
              <FooterLink href="/crochet/products/blankets">Blankets</FooterLink>
              <FooterLink href="/crochet/products/bags">Bags & Accessories</FooterLink>
              <FooterLink href="/crochet/products/toys">Amigurumi Toys</FooterLink>
              <FooterLink href="/crochet/custom">Custom Orders</FooterLink>
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h4 className="mb-6 font-serif text-lg font-semibold text-pink-200">Support</h4>
            <ul className="space-y-3">
              <FooterLink href="/crochet/about">About Us</FooterLink>
              <FooterLink href="/crochet/contact">Contact</FooterLink>
              <FooterLink href="/crochet/shipping">Shipping Info</FooterLink>
              <FooterLink href="/crochet/returns">Returns & Exchanges</FooterLink>
              <FooterLink href="/crochet/faq">FAQ</FooterLink>
              <FooterLink href="/crochet/privacy">Privacy Policy</FooterLink>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="mb-6 font-serif text-lg font-semibold text-pink-200">
              Stay Connected
            </h4>
            <p className="mb-4 text-sm text-purple-200">
              Get exclusive offers, new arrivals, and crafting inspiration delivered to your inbox!
            </p>
            <form onSubmit={handleSubscribe} className="space-y-3">
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  className="w-full rounded-lg bg-white/10 backdrop-blur-sm px-4 py-3 pr-12 text-white placeholder-purple-300 outline-none ring-2 ring-white/20 transition focus:ring-pink-400"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md bg-pink-500 p-2 text-white transition hover:bg-pink-600"
                  aria-label="Subscribe"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
              {subscribed && (
                <p className="text-sm text-green-300 flex items-center gap-2">
                  <Heart className="h-4 w-4 fill-current" />
                  Thanks for subscribing!
                </p>
              )}
            </form>
          </div>
        </div>

        {/* Divider */}
        <div className="my-8 border-t border-white/20"></div>

        {/* Bottom Bar */}
        <div className="flex flex-col items-center justify-between gap-4 text-sm text-purple-200 md:flex-row">
          <p className="flex items-center gap-2">
            © {new Date().getFullYear()} PixieLoops. Crafted with 
            <Heart className="h-4 w-4 fill-current text-pink-400" /> 
            and yarn.
          </p>
          <div className="flex gap-6">
            <Link href="/crochet/terms" className="hover:text-white transition">
              Terms of Service
            </Link>
            <Link href="/crochet/privacy" className="hover:text-white transition">
              Privacy
            </Link>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-purple-300">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded bg-white/10 flex items-center justify-center">
              ✓
            </div>
            <span>100% Handmade</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded bg-white/10 flex items-center justify-center">
              ♻️
            </div>
            <span>Eco-Friendly Yarn</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded bg-white/10 flex items-center justify-center">
              🔒
            </div>
            <span>Secure Checkout</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded bg-white/10 flex items-center justify-center">
              📦
            </div>
            <span>Fast Shipping</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ---------------- Helper Components ---------------- */

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <li>
      <Link
        href={href}
        className="text-purple-200 transition hover:text-white hover:translate-x-1 inline-block"
      >
        {children}
      </Link>
    </li>
  );
}

function SocialLink({ href, children, "aria-label": ariaLabel }: { href: string; children: React.ReactNode; "aria-label": string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={ariaLabel}
      className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm transition hover:bg-white/20 hover:scale-110"
    >
      {children}
    </a>
  );
}