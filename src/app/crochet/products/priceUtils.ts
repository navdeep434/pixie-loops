export type PriceType = "fixed" | "percentage";

export type OptionValue = {
  id: number;
  label: string;
  price_adjustment: number;
  price_type: PriceType;
};

export type ProductOption = {
  id: number;
  name: string;
  type: "radio" | "dropdown" | "number" | "checkbox";
  is_required: boolean;
  sort_order: number;
  values: OptionValue[];
};

export type SelectedOptions = Record<
  number, // option_id
  | { value_id: number }           // radio, dropdown
  | { value_ids: number[] }        // checkbox
  | { custom_value: number }       // number input
>;

/**
 * Calculate price adjustment for a single option value.
 */
export function calcValueAdjustment(
  basePrice: number,
  adjustment: number,
  priceType: PriceType
): number {
  if (priceType === "percentage") {
    return (basePrice * adjustment) / 100;
  }
  return adjustment;
}

/**
 * Calculate total price given base price and all selected options.
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
      if (val) {
        total += calcValueAdjustment(basePrice, val.price_adjustment, val.price_type);
      }
    }

    if (option.type === "checkbox") {
      const s = sel as { value_ids: number[] };
      for (const vid of s.value_ids) {
        const val = option.values.find((v) => v.id === vid);
        if (val) {
          total += calcValueAdjustment(basePrice, val.price_adjustment, val.price_type);
        }
      }
    }

    // number type: no price_adjustment per unit by default
    // extend here if you add per-unit pricing later
  }

  return Math.max(0, total);
}

/**
 * Validate all required options are selected.
 * Returns list of option names that are missing.
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
      if (!s.value_ids || s.value_ids.length === 0) {
        missing.push(option.name);
      }
    }

    if (option.type === "number") {
      const s = sel as { custom_value: number };
      if (!s.custom_value || s.custom_value < 1) {
        missing.push(option.name);
      }
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

  return {
    product_id: productId,
    quantity,
    selected_options: selectedOptions,
  };
}