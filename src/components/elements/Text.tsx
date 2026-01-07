type TextProps = {
  children: React.ReactNode;
  variant?: "normal" | "muted" | "small" | "lead" | "error" | "success";
  align?: "left" | "center" | "right";
  className?: string;
};

export default function Text({
  children,
  variant = "normal",
  align = "left",
  className = "",
}: TextProps) {
  const variants = {
    normal: "text-gray-700 text-base",
    muted: "text-gray-500 text-base",
    small: "text-sm text-gray-600",
    lead: "text-lg text-gray-700 leading-relaxed",
    error: "text-sm text-rose-600 font-medium",
    success: "text-sm text-emerald-600 font-medium",
  };

  const alignment = {
    left: "text-left",
    center: "text-center",
    right: "text-right",
  };

  return (
    <p className={`${variants[variant]} ${alignment[align]} ${className}`}>
      {children}
    </p>
  );
}