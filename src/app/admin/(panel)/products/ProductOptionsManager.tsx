"use client";

import { useState } from "react";
import { Plus, Trash2, ChevronDown, ChevronUp, GripVertical, X } from "lucide-react";
import { Button } from "@/components/elements";

export type OptionValueForm = {
  id?: number;
  label: string;
  value: string;
  price_modifier: string;
};

export type OptionForm = {
  id?: number;
  name: string;
  type: "radio" | "dropdown" | "number" | "checkbox";
  is_required: boolean;
  min_value: string;
  max_value: string;
  price_per_unit: string;
  values: OptionValueForm[];
  open: boolean; // UI state
};

type Props = {
  options: OptionForm[];
  onChange: (options: OptionForm[]) => void;
};

const OPTION_TYPES = [
  { value: "radio",    label: "Radio Buttons" },
  { value: "dropdown", label: "Dropdown"      },
  { value: "checkbox", label: "Checkboxes"    },
  { value: "number",   label: "Number Input"  },
];

const NEEDS_VALUES = ["radio", "dropdown", "checkbox"];

export function makeEmptyOption(): OptionForm {
  return {
    name: "", type: "radio", is_required: false,
    min_value: "", max_value: "", price_per_unit: "",
    values: [{ label: "", value: "", price_modifier: "0" }],
    open: true,
  };
}

export function makeEmptyValue(): OptionValueForm {
  return { label: "", value: "", price_modifier: "0" };
}

export default function ProductOptionsManager({ options, onChange }: Props) {

  // ─── Option-level helpers ─────────────────────────────────────────────────

  const addOption = () => {
    onChange([...options, makeEmptyOption()]);
  };

  const removeOption = (i: number) => {
    onChange(options.filter((_, idx) => idx !== i));
  };

  const updateOption = (i: number, patch: Partial<OptionForm>) => {
    onChange(options.map((o, idx) => idx === i ? { ...o, ...patch } : o));
  };

  const toggleOpen = (i: number) => {
    updateOption(i, { open: !options[i].open });
  };

  // ─── Value-level helpers ──────────────────────────────────────────────────

  const addValue = (optIdx: number) => {
    const updated = [...options];
    updated[optIdx].values.push(makeEmptyValue());
    onChange(updated);
  };

  const removeValue = (optIdx: number, valIdx: number) => {
    const updated = [...options];
    updated[optIdx].values = updated[optIdx].values.filter((_, i) => i !== valIdx);
    onChange(updated);
  };

  const updateValue = (optIdx: number, valIdx: number, patch: Partial<OptionValueForm>) => {
    const updated = [...options];
    updated[optIdx].values[valIdx] = { ...updated[optIdx].values[valIdx], ...patch };
    onChange(updated);
  };

  // Auto-fill value slug from label
  const handleLabelChange = (optIdx: number, valIdx: number, label: string) => {
    const value = label.toLowerCase().replace(/\s+/g, "_").replace(/[^a-z0-9_]/g, "");
    updateValue(optIdx, valIdx, { label, value });
  };

  return (
    <div className="space-y-4">

      {options.length === 0 && (
        <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-xl">
          <p className="text-sm text-gray-500 mb-1">No options added yet</p>
          <p className="text-xs text-gray-400">Options let customers customize their order (e.g. size, color, quantity)</p>
        </div>
      )}

      {options.map((option, optIdx) => (
        <div key={optIdx} className="border border-gray-200 rounded-xl overflow-hidden bg-gray-50">

          {/* Option Header */}
          <div className="flex items-center gap-3 px-4 py-3 bg-white border-b border-gray-100">
            <GripVertical className="h-4 w-4 text-gray-300 flex-shrink-0" />

            <div className="flex-1 min-w-0">
              <input
                type="text"
                value={option.name}
                onChange={(e) => updateOption(optIdx, { name: e.target.value })}
                placeholder="Option name (e.g. Pot Add-on, Flower Count)"
                className="w-full text-sm font-medium bg-transparent border-0 focus:outline-none focus:ring-0 text-gray-900 placeholder:text-gray-400"
              />
            </div>

            <select
            aria-label="Select option type"
              value={option.type}
              onChange={(e) => updateOption(optIdx, { type: e.target.value as OptionForm["type"] })}
              className="text-xs px-2 py-1.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-700"
            >
              {OPTION_TYPES.map((t) => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>

            <label className="flex items-center gap-1.5 text-xs text-gray-600 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={option.is_required}
                onChange={(e) => updateOption(optIdx, { is_required: e.target.checked })}
                className="h-3.5 w-3.5 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
              />
              Required
            </label>

            <button
              type="button"
              onClick={() => toggleOpen(optIdx)}
              className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors text-gray-500"
            >
              {option.open ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </button>

            <Button
              type="button"
              onClick={() => removeOption(optIdx)}
              className="p-1.5 hover:bg-red-50 rounded-lg transition-colors text-red-400 hover:text-red-600"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>

          {/* Option Body */}
          {option.open && (
            <div className="p-4 space-y-4">

              {/* Number type — min/max/price_per_unit */}
              {option.type === "number" && (
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Min Value</label>
                    <input
                      type="number"
                      value={option.min_value}
                      onChange={(e) => updateOption(optIdx, { min_value: e.target.value })}
                      placeholder="1"
                      className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Max Value</label>
                    <input
                      type="number"
                      value={option.max_value}
                      onChange={(e) => updateOption(optIdx, { max_value: e.target.value })}
                      placeholder="100"
                      className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Price per Unit (₹)</label>
                    <input
                      type="number"
                      value={option.price_per_unit}
                      onChange={(e) => updateOption(optIdx, { price_per_unit: e.target.value })}
                      placeholder="0"
                      className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                </div>
              )}

              {/* Values — radio/dropdown/checkbox */}
              {NEEDS_VALUES.includes(option.type) && (
                <div className="space-y-2">
                  <div className="grid grid-cols-12 gap-2 px-1">
                    <span className="col-span-5 text-xs font-medium text-gray-500">Label</span>
                    <span className="col-span-4 text-xs font-medium text-gray-500">Value (slug)</span>
                    <span className="col-span-2 text-xs font-medium text-gray-500">+Price (₹)</span>
                    <span className="col-span-1" />
                  </div>

                  {option.values.map((val, valIdx) => (
                    <div key={valIdx} className="grid grid-cols-12 gap-2 items-center">
                      <input
                        type="text"
                        value={val.label}
                        onChange={(e) => handleLabelChange(optIdx, valIdx, e.target.value)}
                        placeholder="e.g. With Pot"
                        className="col-span-5 px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                      <input
                        type="text"
                        value={val.value}
                        onChange={(e) => updateValue(optIdx, valIdx, { value: e.target.value })}
                        placeholder="with_pot"
                        className="col-span-4 px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-600 font-mono text-xs"
                      />
                      <div className="col-span-2 relative">
                        <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 text-xs">₹</span>
                        <input
                          type="number"
                          value={val.price_modifier}
                          onChange={(e) => updateValue(optIdx, valIdx, { price_modifier: e.target.value })}
                          placeholder="0"
                          className="w-full pl-5 pr-2 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                      </div>
                      <Button
                        type="button"
                        onClick={() => removeValue(optIdx, valIdx)}
                        disabled={option.values.length === 1}
                        className="col-span-1 p-1.5 hover:bg-red-50 rounded-lg transition-colors text-gray-400 hover:text-red-500 disabled:opacity-30 disabled:cursor-not-allowed flex justify-center"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={() => addValue(optIdx)}
                    className="flex items-center gap-1.5 text-xs text-purple-600 hover:text-purple-700 font-medium mt-1 px-1"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    Add Value
                  </button>
                </div>
              )}

              {/* Preview pill */}
              <div className="pt-2 border-t border-gray-100">
                <p className="text-xs text-gray-400">
                  Preview:{" "}
                  <span className="font-medium text-gray-600">
                    {option.name || "Unnamed option"}{" "}
                    <span className="text-purple-500">({option.type})</span>
                    {option.is_required && <span className="text-red-400"> *required</span>}
                  </span>
                </p>
              </div>
            </div>
          )}
        </div>
      ))}

      {/* Add Option Button */}
      <button
        type="button"
        onClick={addOption}
        className="w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-purple-200 rounded-xl text-sm font-medium text-purple-600 hover:border-purple-400 hover:bg-purple-50 transition-all"
      >
        <Plus className="h-4 w-4" />
        Add Option
      </button>
    </div>
  );
}