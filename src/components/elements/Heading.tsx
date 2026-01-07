import React from "react";

type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

type HeadingProps = {
  children: React.ReactNode;
  level?: HeadingLevel;
  align?: "left" | "center" | "right";
  gradient?: boolean;
  className?: string;
};

export default function Heading({
  children,
  level = 2,
  align = "left",
  gradient = false,
  className = "",
}: HeadingProps) {
  const Tag: React.ElementType = `h${level}`;

  const sizes: Record<HeadingLevel, string> = {
    1: "text-5xl md:text-6xl font-bold",
    2: "text-3xl md:text-4xl font-bold",
    3: "text-2xl md:text-3xl font-semibold",
    4: "text-xl md:text-2xl font-semibold",
    5: "text-lg md:text-xl font-medium",
    6: "text-base md:text-lg font-medium",
  };

  const alignment = {
    left: "text-left",
    center: "text-center",
    right: "text-right",
  };

  const gradientClass = gradient 
    ? "bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 bg-clip-text text-transparent"
    : "text-gray-900";

  return (
    <Tag
      className={`font-serif ${sizes[level]} ${alignment[align]} ${gradientClass} ${className}`}
    >
      {children}
    </Tag>
  );
}