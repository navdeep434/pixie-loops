"use client";

import { ProductOption } from "../types";
import { SelectedOptions } from "./priceUtils";

type Props = {
  options: ProductOption[];
  selected: SelectedOptions;
  onChange: (optionId: number, value: SelectedOptions[number]) => void;
  errors: string[];
};

export default function ProductOptions({ options, selected, onChange, errors }: Props) {
  if (!options || options.length === 0) return null;

  return (
    <div className="space-y-6">
      {options.map((option) => (
        <div key={option.id}>

          {/* Label */}
          <label className="block text-sm font-semibold text-gray-800 mb-2">
            {option.name}
            {option.is_required && <span className="text-red-500 ml-1">*</span>}
            {option.type === "number" && option.price_per_unit && option.price_per_unit > 0 && (
              <span className="ml-2 text-xs font-normal text-gray-500">
                (₹{option.price_per_unit} per unit)
              </span>
            )}
          </label>

          {/* RADIO */}
          {option.type === "radio" && (
            <div className="flex flex-wrap gap-2">
              {option.values.map((val) => {
                const sel = selected[option.id] as { value_id: number } | undefined;
                const isSelected = sel?.value_id === val.id;
                return (
                  <button
                    key={val.id}
                    type="button"
                    onClick={() => onChange(option.id, { value_id: val.id })}
                    className={`px-4 py-2 rounded-lg border-2 text-sm font-medium transition-all ${
                      isSelected
                        ? "border-purple-600 bg-purple-50 text-purple-700"
                        : "border-gray-200 bg-white text-gray-700 hover:border-purple-300"
                    }`}
                  >
                    {val.label}
                    {val.price_modifier > 0 && (
                      <span className="ml-1.5 text-xs opacity-70">+₹{val.price_modifier}</span>
                    )}
                  </button>
                );
              })}
            </div>
          )}

          {/* DROPDOWN */}
          {option.type === "dropdown" && (
            <select
              value={(selected[option.id] as { value_id: number } | undefined)?.value_id ?? ""}
              onChange={(e) => onChange(option.id, { value_id: Number(e.target.value) })}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
            >
              <option value="">Select {option.name}</option>
              {option.values.map((val) => (
                <option key={val.id} value={val.id}>
                  {val.label}{val.price_modifier > 0 ? ` (+₹${val.price_modifier})` : ""}
                </option>
              ))}
            </select>
          )}

          {/* CHECKBOX */}
          {option.type === "checkbox" && (
            <div className="space-y-2">
              {option.values.map((val) => {
                const sel = selected[option.id] as { value_ids: number[] } | undefined;
                const checked = sel?.value_ids?.includes(val.id) ?? false;
                return (
                  <label key={val.id} className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={(e) => {
                        const prev = (selected[option.id] as { value_ids: number[] } | undefined)?.value_ids ?? [];
                        const next = e.target.checked
                          ? [...prev, val.id]
                          : prev.filter((id) => id !== val.id);
                        onChange(option.id, { value_ids: next });
                      }}
                      className="h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                    />
                    <span className="text-sm text-gray-700 group-hover:text-gray-900">
                      {val.label}
                      {val.price_modifier > 0 && (
                        <span className="ml-1.5 text-xs text-gray-500">(+₹{val.price_modifier})</span>
                      )}
                    </span>
                  </label>
                );
              })}
            </div>
          )}

          {/* NUMBER */}
          {option.type === "number" && (
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  const min = option.min_value ?? 1;
                  const cur = (selected[option.id] as { custom_value: number } | undefined)?.custom_value ?? min;
                  if (cur > min) onChange(option.id, { custom_value: cur - 1 });
                }}
                className="h-10 w-10 rounded-lg border border-gray-200 bg-gray-50 text-gray-700 hover:bg-gray-100 flex items-center justify-center text-lg font-semibold transition-colors"
              >
                −
              </button>
              <input
                type="number"
                min={option.min_value ?? 1}
                max={option.max_value ?? undefined}
                value={(selected[option.id] as { custom_value: number } | undefined)?.custom_value ?? ""}
                onChange={(e) => {
                  const min = option.min_value ?? 1;
                  const max = option.max_value ?? Infinity;
                  const val = Math.min(max, Math.max(min, Number(e.target.value)));
                  onChange(option.id, { custom_value: val });
                }}
                placeholder={`${option.min_value ?? 1}${option.max_value ? `–${option.max_value}` : "+"}`}
                className="w-24 px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm text-center"
              />
              <button
                type="button"
                onClick={() => {
                  const max = option.max_value ?? Infinity;
                  const cur = (selected[option.id] as { custom_value: number } | undefined)?.custom_value ?? 0;
                  if (cur < max) onChange(option.id, { custom_value: cur + 1 });
                }}
                className="h-10 w-10 rounded-lg border border-gray-200 bg-gray-50 text-gray-700 hover:bg-gray-100 flex items-center justify-center text-lg font-semibold transition-colors"
              >
                +
              </button>
            </div>
          )}

          {/* Per-option error */}
          {errors.includes(option.name) && (
            <p className="mt-1.5 text-xs text-red-500 font-medium">
              Please select {option.name}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}