import React from "react";

type CardProps = {
  children: React.ReactNode;
  variant?: "default" | "elevated" | "bordered" | "gradient";
  className?: string;
  hoverable?: boolean;
};

export default function Card({ 
  children, 
  variant = "default",
  className = "",
  hoverable = true,
}: CardProps) {
  const variants = {
    default: "bg-white shadow-md",
    elevated: "bg-white shadow-xl",
    bordered: "bg-white border-2 border-purple-100",
    gradient: "bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50 border-2 border-white shadow-lg",
  };

  const hoverEffect = hoverable 
    ? "hover:shadow-2xl hover:-translate-y-1 cursor-pointer" 
    : "";

  return (
    <div
      className={`rounded-2xl transition-all duration-300 ${variants[variant]} ${hoverEffect} ${className}`}
    >
      {children}
    </div>
  );
}