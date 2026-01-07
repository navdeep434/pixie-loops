type DividerProps = {
  className?: string;
  orientation?: "horizontal" | "vertical";
  variant?: "solid" | "dashed" | "gradient";
};

export default function Divider({ 
  className = "",
  orientation = "horizontal",
  variant = "solid",
}: DividerProps) {
  const variants = {
    solid: "border-gray-200",
    dashed: "border-gray-200 border-dashed",
    gradient: "border-0 h-px bg-gradient-to-r from-transparent via-purple-300 to-transparent",
  };

  if (orientation === "vertical") {
    return (
      <div 
        className={`h-full w-px ${variant === "gradient" ? "bg-gradient-to-b from-transparent via-purple-300 to-transparent" : `border-l ${variants[variant]}`} ${className}`}
      />
    );
  }

  return (
    <hr 
      className={`my-6 ${variant === "gradient" ? variants.gradient : `border-t ${variants[variant]}`} ${className}`} 
    />
  );
}