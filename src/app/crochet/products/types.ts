export type Category = {
  id: number;
  name: string;
  icon?: string;
  children?: Category[];
};

export type Product = {
  id: number;
  name: string;
  price: number;
  categoryId: number;
  icon?: string;
  description?: string;
  badge?: "new" | "sale" | "best" | "handmade" | "custom";
  inStock?: boolean;
  rating?: number;
};