import { ProductOption } from "./types";

export type SelectedOptions = Record<
  number,
  | { value_id: number }
  | { value_ids: number[] }
  | { custom_value: number }
>;

/**
 * Calculate total price given base price and all selected options.
 * - radio / dropdown / checkbox → add price_modifier of selected value(s)
 * - number → multiply custom_value by option's price_per_unit
 */
export function calcTotalPrice(
  basePrice: number,
  options: ProductOption[],
  selected: SelectedOptions
): number {
  let total = basePrice;

  for (const option of options) {
    const sel = selected[option.id];
    if (!sel) continue;

    if (option.type === "radio" || option.type === "dropdown") {
      const s = sel as { value_id: number };
      const val = option.values.find((v) => v.id === s.value_id);
      if (val) total += val.price_modifier;
    }

    if (option.type === "checkbox") {
      const s = sel as { value_ids: number[] };
      for (const vid of s.value_ids) {
        const val = option.values.find((v) => v.id === vid);
        if (val) total += val.price_modifier;
      }
    }

    if (option.type === "number") {
      const s = sel as { custom_value: number };
      const perUnit = option.price_per_unit ?? 0;
      if (s.custom_value && perUnit > 0) {
        total += s.custom_value * perUnit;
      }
    }
  }

  return Math.max(0, total);
}

/**
 * Validate all required options are filled.
 * Returns list of option names that are missing / invalid.
 */
export function validateOptions(
  options: ProductOption[],
  selected: SelectedOptions
): string[] {
  const missing: string[] = [];

  for (const option of options) {
    if (!option.is_required) continue;
    const sel = selected[option.id];

    if (!sel) {
      missing.push(option.name);
      continue;
    }

    if (option.type === "checkbox") {
      const s = sel as { value_ids: number[] };
      if (!s.value_ids || s.value_ids.length === 0) missing.push(option.name);
    }

    if (option.type === "number") {
      const s = sel as { custom_value: number };
      const min = option.min_value ?? 1;
      if (!s.custom_value || s.custom_value < min) missing.push(option.name);
    }
  }

  return missing;
}

/**
 * Build cart payload from selected options.
 */
export function buildCartPayload(
  productId: number,
  quantity: number,
  options: ProductOption[],
  selected: SelectedOptions
) {
  const selectedOptions: object[] = [];

  for (const option of options) {
    const sel = selected[option.id];
    if (!sel) continue;

    if (option.type === "radio" || option.type === "dropdown") {
      const s = sel as { value_id: number };
      selectedOptions.push({ option_id: option.id, value_id: s.value_id });
    }

    if (option.type === "checkbox") {
      const s = sel as { value_ids: number[] };
      for (const vid of s.value_ids) {
        selectedOptions.push({ option_id: option.id, value_id: vid });
      }
    }

    if (option.type === "number") {
      const s = sel as { custom_value: number };
      selectedOptions.push({ option_id: option.id, custom_value: s.custom_value });
    }
  }

  return { product_id: productId, quantity, selected_options: selectedOptions };
}