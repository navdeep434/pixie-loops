"use client";

import { useState } from "react";
import { Category } from "./types";
import { ChevronDown, ChevronRight } from "lucide-react";

type Props = {
  categories: Category[];
  onSelect: (categoryId: number | null) => void;
  selectedCategory: number | null;
};

export default function CategoryTree({ categories, onSelect, selectedCategory }: Props) {
  return (
    <div className="space-y-1">
      <button
        onClick={() => onSelect(null)}
        className={`w-full rounded-xl px-4 py-3 text-left transition-all ${
          selectedCategory === null
            ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold shadow-lg"
            : "hover:bg-purple-50 text-gray-700"
        }`}
      >
        <div className="flex items-center gap-3">
          <span className="text-xl">🛍️</span>
          <span className="text-sm font-medium">All Products</span>
        </div>
      </button>

      {categories.map((cat) => (
        <CategoryNode
          key={cat.id}
          category={cat}
          onSelect={onSelect}
          selectedCategory={selectedCategory}
        />
      ))}
    </div>
  );
}

function CategoryNode({
  category,
  onSelect,
  selectedCategory,
}: {
  category: Category;
  onSelect: (id: number | null) => void;
  selectedCategory: number | null;
}) {
  const [open, setOpen] = useState(true);
  const hasChildren = category.children && category.children.length > 0;
  const isSelected = selectedCategory === category.id;
  const hasSelectedChild = category.children?.some((c) => c.id === selectedCategory);

  return (
    <div>
      <button
        className={`w-full rounded-xl px-4 py-3 text-left transition-all ${
          isSelected
            ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold shadow-lg"
            : hasSelectedChild
            ? "bg-purple-50 text-purple-700 font-medium"
            : "hover:bg-purple-50 text-gray-700"
        }`}
        onClick={() => {
          if (hasChildren) setOpen(!open);
          else onSelect(category.id);
        }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {category.icon && <span className="text-xl">{category.icon}</span>}
            <span className="text-sm font-medium">{category.name}</span>
          </div>
          {hasChildren && (
            <span className={isSelected ? "text-white/70" : "text-gray-400"}>
              {open
                ? <ChevronDown className="h-4 w-4" />
                : <ChevronRight className="h-4 w-4" />}
            </span>
          )}
        </div>
      </button>

      {open && hasChildren && (
        <div className="ml-4 mt-1 space-y-1 border-l-2 border-purple-100 pl-2">
          {category.children!.map((child) => {
            const isChildSelected = selectedCategory === child.id;
            return (
              <button
                key={child.id}
                className={`w-full rounded-lg px-4 py-2.5 text-left transition-all ${
                  isChildSelected
                    ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold shadow-md"
                    : "hover:bg-purple-50 text-gray-600"
                }`}
                onClick={() => onSelect(child.id)}
              >
                <div className="flex items-center gap-2">
                  {child.icon && <span className="text-base">{child.icon}</span>}
                  <span className="text-sm">{child.name}</span>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}