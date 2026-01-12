"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

type BannerSlide = {
  id: number;
  image: string;
  alt: string;
  link?: string;
};

type Particle = {
  width: number;
  height: number;
  top: number;
  left: number;
  duration: number;
  delay: number;
};

const bannerSlides: BannerSlide[] = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1631048133344-c629de6e5e56?w=1920&h=600&fit=crop",
    alt: "Cozy Crochet Blankets",
    link: "/crochet/products/blankets",
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1530325553241-4f6e7690cf36?w=1920&h=600&fit=crop",
    alt: "Handmade Amigurumi Toys",
    link: "/crochet/products/toys",
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1590739213920-82c1ce8b0778?w=1920&h=600&fit=crop",
    alt: "Crochet Bags Collection",
    link: "/crochet/products/bags",
  },
  {
    id: 4,
    image: "https://images.unsplash.com/photo-1601925228844-4e559f748fb6?w=1920&h=600&fit=crop",
    alt: "Custom Crochet Orders",
    link: "/crochet/custom",
  },
  {
    id: 5,
    image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=1920&h=600&fit=crop",
    alt: "Home Decor Crochet",
    link: "/crochet/products",
  },
];

export default function BannerCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [particles, setParticles] = useState<Particle[]>([]);

  /* ---------------- PARTICLES (hydration-safe) ---------------- */
  useEffect(() => {
    const generated = Array.from({ length: 20 }).map(() => ({
      width: Math.random() * 4 + 2,
      height: Math.random() * 4 + 2,
      top: Math.random() * 100,
      left: Math.random() * 100,
      duration: Math.random() * 10 + 5,
      delay: Math.random() * 5,
    }));

    setParticles(generated);
  }, []);

  /* ---------------- AUTO SLIDE ---------------- */
  useEffect(() => {
    if (isPaused || isTransitioning) return;

    const interval = setInterval(() => {
      handleSlideChange((currentSlide + 1) % bannerSlides.length);
    }, 4500);

    return () => clearInterval(interval);
  }, [isPaused, isTransitioning, currentSlide]);

  const handleSlideChange = (index: number) => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentSlide(index);
    setTimeout(() => setIsTransitioning(false), 900);
  };

  const nextSlide = () =>
    handleSlideChange((currentSlide + 1) % bannerSlides.length);

  const prevSlide = () =>
    handleSlideChange(
      (currentSlide - 1 + bannerSlides.length) % bannerSlides.length
    );

  const handleSlideClick = (link?: string) => {
    if (link && !isTransitioning) window.location.href = link;
  };

  const getSlidePosition = (index: number) => {
    const diff =
      (index - currentSlide + bannerSlides.length) %
      bannerSlides.length;

    if (diff === 0)
      return { x: "0%", z: 0, scale: 1, opacity: 1, rotateY: 0, zIndex: 50 };
    if (diff === 1)
      return { x: "65%", z: -400, scale: 0.7, opacity: 0.6, rotateY: -35, zIndex: 30 };
    if (diff === 2)
      return { x: "85%", z: -600, scale: 0.5, opacity: 0.3, rotateY: -45, zIndex: 20 };
    if (diff === bannerSlides.length - 1)
      return { x: "-65%", z: -400, scale: 0.7, opacity: 0.6, rotateY: 35, zIndex: 30 };

    return { x: "-85%", z: -600, scale: 0.5, opacity: 0.3, rotateY: 45, zIndex: 20 };
  };

  return (
    <section
      className="relative w-full overflow-hidden bg-gradient-to-br from-indigo-950 via-purple-900 to-rose-950"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* PARTICLES */}
      <div className="absolute inset-0 opacity-30">
        {particles.map((p, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              width: `${p.width}px`,
              height: `${p.height}px`,
              top: `${p.top}%`,
              left: `${p.left}%`,
              animation: `float ${p.duration}s ease-in-out infinite`,
              animationDelay: `${p.delay}s`,
            }}
          />
        ))}
      </div>

      {/* SLIDES */}
      <div className="relative h-[550px] flex items-center justify-center perspective-2000">
        {bannerSlides.map((slide, index) => {
          const pos = getSlidePosition(index);
          const isActive = index === currentSlide;

          return (
            <div
              key={slide.id}
              className="absolute w-[70%] h-[80%]"
              style={{
                transform: `
                  translate(-50%, -50%)
                  translateX(${pos.x})
                  translateZ(${pos.z}px)
                  rotateY(${pos.rotateY}deg)
                  scale(${pos.scale})
                `,
                top: "50%",
                left: "50%",
                opacity: pos.opacity,
                zIndex: pos.zIndex,
                transition: "all 0.9s cubic-bezier(0.4,0,0.2,1)",
                pointerEvents: isActive ? "auto" : "none",
              }}
            >
              <div
                className="relative w-full h-full rounded-3xl overflow-hidden shadow-2xl cursor-pointer"
                onClick={() => isActive && handleSlideClick(slide.link)}
              >
                <img
                  src={slide.image}
                  alt={slide.alt}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40" />
                {isActive && (
                  <h2 className="absolute bottom-10 left-10 text-white text-5xl font-bold drop-shadow-xl">
                    {slide.alt}
                  </h2>
                )}
              </div>
            </div>
          );
        })}

        <button
          onClick={prevSlide}
          className="absolute left-6 top-1/2 -translate-y-1/2 bg-white/20 p-4 rounded-full"
        >
          <ChevronLeft className="text-white" />
        </button>

        <button
          onClick={nextSlide}
          className="absolute right-6 top-1/2 -translate-y-1/2 bg-white/20 p-4 rounded-full"
        >
          <ChevronRight className="text-white" />
        </button>
      </div>

      <style jsx>{`
        @keyframes float {
          0%,100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
        .perspective-2000 { perspective: 2000px; }
      `}</style>
    </section>
  );
}
