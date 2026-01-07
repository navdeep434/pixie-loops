"use client";

import { useState } from "react";

type TooltipProps = {
  label: string;
  children: React.ReactNode;
  position?: "top" | "bottom" | "left" | "right";
};

export default function Tooltip({ 
  label, 
  children,
  position = "top",
}: TooltipProps) {
  const [visible, setVisible] = useState(false);

  const positions = {
    top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
    bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
    left: "right-full top-1/2 -translate-y-1/2 mr-2",
    right: "left-full top-1/2 -translate-y-1/2 ml-2",
  };

  const arrowPositions = {
    top: "top-full left-1/2 -translate-x-1/2 border-t-gray-900 border-x-transparent border-b-transparent",
    bottom: "bottom-full left-1/2 -translate-x-1/2 border-b-gray-900 border-x-transparent border-t-transparent",
    left: "left-full top-1/2 -translate-y-1/2 border-l-gray-900 border-y-transparent border-r-transparent",
    right: "right-full top-1/2 -translate-y-1/2 border-r-gray-900 border-y-transparent border-l-transparent",
  };

  return (
    <div 
      className="group relative inline-block"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      {children}

      {visible && (
        <div 
          className={`absolute ${positions[position]} z-50 whitespace-nowrap rounded-lg bg-gray-900 px-3 py-2 text-xs font-medium text-white shadow-xl animate-in fade-in zoom-in-95 duration-200`}
        >
          {label}
          <div 
            className={`absolute ${arrowPositions[position]} border-4`}
          />
        </div>
      )}
    </div>
  );
}