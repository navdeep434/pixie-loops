"use client";

import Link from "next/link";
import { Home, Search, ArrowLeft, Package } from "lucide-react";
import { Heading, Text, Button } from "@/components/elements";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50 flex items-center justify-center p-4">
      {/* Decorative Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-64 h-64 bg-purple-300/30 rounded-full blur-3xl animate-blob"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-pink-300/30 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-rose-300/20 rounded-full blur-3xl animate-blob animation-delay-4000"></div>
      </div>

      {/* Floating Yarn Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute text-3xl opacity-20"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animation: `float ${5 + Math.random() * 5}s ease-in-out infinite`,
              animationDelay: `${i * 0.3}s`,
            }}
          >
            {["🧶", "🧵", "🪡", "✨"][Math.floor(Math.random() * 4)]}
          </div>
        ))}
      </div>

      <div className="relative max-w-2xl w-full text-center">
        {/* Tangled Yarn Illustration */}
        <div className="mb-8 relative">
          <div className="text-9xl mb-4 animate-bounce-slow">🧶</div>
          <div className="absolute top-0 left-1/2 -translate-x-1/2 text-7xl animate-spin-slow opacity-50">
            🌀
          </div>
        </div>

        {/* 404 Error */}
        <div className="mb-6">
          <Heading
            level={1}
            className="text-8xl md:text-9xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 bg-clip-text text-transparent mb-4"
          >
            404
          </Heading>
          <Heading level={2} className="text-gray-900 mb-3">
            Oops! This Thread Got Tangled
          </Heading>
          <Text className="text-gray-600 text-lg max-w-md mx-auto">
            Looks like this page has unraveled. The page you're looking for doesn't exist
            or has been moved to a new pattern.
          </Text>
        </div>

        {/* Helpful Suggestions */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-purple-100 mb-8">
          <Text className="font-semibold text-gray-900 mb-4">
            Here's what you can do:
          </Text>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-left">
            <div className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                <Search className="h-4 w-4 text-purple-600" />
              </div>
              <div>
                <Text variant="small" className="font-semibold text-gray-900">
                  Check the URL
                </Text>
                <Text variant="small" className="text-gray-600">
                  Make sure it's spelled correctly
                </Text>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-pink-50 rounded-lg">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-pink-100 flex items-center justify-center">
                <Home className="h-4 w-4 text-pink-600" />
              </div>
              <div>
                <Text variant="small" className="font-semibold text-gray-900">
                  Go Home
                </Text>
                <Text variant="small" className="text-gray-600">
                  Start fresh from homepage
                </Text>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-rose-50 rounded-lg">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center">
                <ArrowLeft className="h-4 w-4 text-rose-600" />
              </div>
              <div>
                <Text variant="small" className="font-semibold text-gray-900">
                  Go Back
                </Text>
                <Text variant="small" className="text-gray-600">
                  Return to previous page
                </Text>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-indigo-50 rounded-lg">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
                <Package className="h-4 w-4 text-indigo-600" />
              </div>
              <div>
                <Text variant="small" className="font-semibold text-gray-900">
                  Browse Products
                </Text>
                <Text variant="small" className="text-gray-600">
                  Explore our collection
                </Text>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/">
            <Button className="gap-2 w-full sm:w-auto">
              <Home className="h-5 w-5" />
              Back to Home
            </Button>
          </Link>
          <Link href="/crochet/products">
            <Button variant="outline" className="gap-2 w-full sm:w-auto">
              <Package className="h-5 w-5" />
              View Products
            </Button>
          </Link>
        </div>

        {/* Fun Message */}
        <div className="mt-8">
          <Text variant="small" className="text-gray-500 italic">
            "Even the best crocheters drop a stitch sometimes!" 🧵
          </Text>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(10deg);
          }
        }

        @keyframes blob {
          0%,
          100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }

        @keyframes bounce-slow {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        @keyframes spin-slow {
          from {
            transform: translateX(-50%) rotate(0deg);
          }
          to {
            transform: translateX(-50%) rotate(360deg);
          }
        }

        .animate-blob {
          animation: blob 7s infinite;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .animation-delay-4000 {
          animation-delay: 4s;
        }

        .animate-bounce-slow {
          animation: bounce-slow 2s ease-in-out infinite;
        }

        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
      `}</style>
    </div>
  );
}