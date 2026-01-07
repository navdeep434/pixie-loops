"use client";

import React from "react";
import ErrorText from "./ErrorText";

export type TextBoxType =
  | "text"
  | "textarea"
  | "number"
  | "alphabets"
  | "alphanumeric"
  | "character"
  | "decimal"
  | "price"
  | "email"
  | "password"
  | "tel"
  | "url";

type TextBoxProps = {
  label?: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  type?: TextBoxType;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  rows?: number;
  error?: string;
  icon?: React.ReactNode;
  className?: string;
};

export default function TextBox({
  label,
  name,
  value,
  onChange,
  type = "text",
  placeholder,
  disabled = false,
  required = false,
  rows = 4,
  error,
  icon,
  className = "",
}: TextBoxProps) {
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    let val = e.target.value;

    switch (type) {
      case "number":
        val = val.replace(/\D/g, "");
        break;

      case "alphabets":
        val = val.replace(/[^a-zA-Z]/g, "");
        break;

      case "alphanumeric":
        val = val.replace(/[^a-zA-Z0-9]/g, "");
        break;

      case "character":
        val = val.slice(0, 1);
        break;

      case "decimal":
        val = val.replace(/[^0-9.]/g, "");
        if ((val.match(/\./g) || []).length > 1) val = val.slice(0, -1);
        break;

      case "price":
        val = val.replace(/[^0-9.]/g, "");
        if ((val.match(/\./g) || []).length > 1) val = val.slice(0, -1);
        const [i, d] = val.split(".");
        if (d && d.length > 2) val = `${i}.${d.slice(0, 2)}`;
        break;

      case "tel":
        val = val.replace(/[^0-9+]/g, "");
        break;
    }

    onChange(val);
  };

  const baseClass =
    "w-full rounded-xl border-2 px-4 py-3 outline-none transition-all " +
    "focus:border-purple-500 focus:ring-4 focus:ring-purple-100 " +
    "disabled:bg-gray-50 disabled:cursor-not-allowed " +
    "placeholder:text-gray-400";

  const errorClass = error ? "border-rose-500 focus:border-rose-500 focus:ring-rose-100" : "border-gray-200";

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {label && (
        <label className="text-sm font-semibold text-gray-700">
          {label}
          {required && <span className="ml-1 text-rose-500">*</span>}
        </label>
      )}

      <div className="relative">
        {icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
            {icon}
          </div>
        )}
        
        {type === "textarea" ? (
          <textarea
            name={name}
            rows={rows}
            value={value}
            placeholder={placeholder}
            disabled={disabled}
            required={required}
            onChange={handleChange}
            className={`${baseClass} ${errorClass} ${icon ? "pl-12" : ""}`}
          />
        ) : (
          <input
            name={name}
            type={
              ["email", "password", "url"].includes(type)
                ? type
                : "text"
            }
            value={value}
            placeholder={placeholder}
            disabled={disabled}
            required={required}
            onChange={handleChange}
            className={`${baseClass} ${errorClass} ${icon ? "pl-12" : ""}`}
          />
        )}
      </div>

      {error && <ErrorText message={error} />}
    </div>
  );
}