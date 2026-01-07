export type FeaturedProduct = {
  id: number;
  name: string;
  price: number;
  icon?: string;
  category: string;
  badge?: "new" | "sale" | "best" | "handmade" | "custom";
};

export type Testimonial = {
  id: number;
  name: string;
  rating: number;
  comment: string;
  avatar: string;
};
