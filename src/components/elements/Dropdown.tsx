"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";

type Option = {
  label: string;
  value: string;
};

type DropdownProps = {
  value?: string;
  options: Option[];
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  className?: string;
};

export default function Dropdown({
  value,
  options,
  onChange,
  placeholder = "Select an option",
  label,
  className = "",
}: DropdownProps) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selected = options.find((o) => o.value === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={`flex flex-col gap-2 ${className}`} ref={dropdownRef}>
      {label && (
        <label className="text-sm font-semibold text-gray-700">
          {label}
        </label>
      )}
      
      <div className="relative">
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-3 text-left transition-all hover:border-purple-300 focus:border-purple-500 focus:ring-4 focus:ring-purple-100 focus:outline-none flex items-center justify-between"
        >
          <span className={selected ? "text-gray-900" : "text-gray-400"}>
            {selected?.label || placeholder}
          </span>
          <ChevronDown
            className={`h-5 w-5 text-gray-400 transition-transform ${
              open ? "rotate-180" : ""
            }`}
          />
        </button>

        {open && (
          <ul className="absolute z-20 mt-2 w-full overflow-hidden rounded-xl border-2 border-gray-200 bg-white shadow-xl animate-in fade-in slide-in-from-top-2 duration-200">
            {options.map((opt) => (
              <li
                key={opt.value}
                onClick={() => {
                  onChange(opt.value);
                  setOpen(false);
                }}
                className={`cursor-pointer px-4 py-3 transition-colors hover:bg-purple-50 flex items-center justify-between ${
                  opt.value === value ? "bg-purple-50 text-purple-700 font-semibold" : "text-gray-700"
                }`}
              >
                <span>{opt.label}</span>
                {opt.value === value && (
                  <Check className="h-5 w-5 text-purple-600" />
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}