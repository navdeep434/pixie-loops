import { Sparkles, Tag, TrendingUp } from "lucide-react";
import React from "react";

export type BadgeVariant =
  | "new"
  | "sale"
  | "best"
  | "default"
  | "handmade"
  | "custom";

type BadgeProps = {
  children?: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
  showIcon?: boolean;
};

const defaultLabels: Record<BadgeVariant, string> = {
  new: "New",
  sale: "Sale",
  best: "Best Seller",
  handmade: "Handmade",
  custom: "Custom",
  default: "",
};

export default function Badge({
  children,
  variant = "default",
  className = "",
  showIcon = false,
}: BadgeProps) {
  const variants: Record<
    BadgeVariant,
    { style: string; icon?: React.ReactNode }
  > = {
    new: {
      style:
        "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-md",
      icon: <Sparkles className="h-3 w-3" />,
    },
    sale: {
      style:
        "bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-md animate-pulse",
      icon: <Tag className="h-3 w-3" />,
    },
    best: {
      style:
        "bg-gradient-to-r from-amber-400 to-orange-500 text-white shadow-md",
      icon: <TrendingUp className="h-3 w-3" />,
    },
    handmade: {
      style:
        "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md",
      icon: <span className="text-xs">✨</span>,
    },
    custom: {
      style:
        "bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-md",
      icon: <span className="text-xs">🎨</span>,
    },
    default: {
      style: "bg-gray-100 text-gray-700 border border-gray-200",
    },
  };

  const { style, icon } = variants[variant];

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${style} ${className}`}
    >
      {showIcon && icon}
      {children ?? defaultLabels[variant]}
    </span>
  );
}
