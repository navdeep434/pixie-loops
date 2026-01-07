type SkeletonProps = {
  height?: string;
  width?: string;
  variant?: "text" | "circular" | "rectangular";
  className?: string;
};

export default function Skeleton({
  height = "h-4",
  width = "w-full",
  variant = "rectangular",
  className = "",
}: SkeletonProps) {
  const variants = {
    text: "rounded-md",
    circular: "rounded-full",
    rectangular: "rounded-lg",
  };

  return (
    <div
      className={`animate-pulse bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] ${height} ${width} ${variants[variant]} ${className}`}
      style={{
        animation: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite, shimmer 2s linear infinite",
      }}
    />
  );
}