export type Category = {
  id: number;
  name: string;
  slug: string;
  icon?: string;
  children?: Category[];
};

export type OptionValue = {
  id: number;
  label: string;
  value: string;
  price_modifier: number;
};

export type ProductOption = {
  id: number;
  name: string;
  type: "radio" | "dropdown" | "number" | "checkbox";
  is_required: boolean;
  min_value?: number | null;
  max_value?: number | null;
  price_per_unit?: number | null;
  values: OptionValue[];
};

export type Product = {
  id: number;
  name: string;
  slug: string;
  sku?: string | null;           // ← added
  price: number;
  sale_price?: number | null;
  final_price: number;
  category_id: number;
  category?: { id: number; name: string; slug: string } | null;
  image?: string | null;
  images?: { id: number; url: string; is_primary: boolean }[];
  description?: string | null;
  in_stock: boolean;
  stock: number;
  options?: ProductOption[];
};