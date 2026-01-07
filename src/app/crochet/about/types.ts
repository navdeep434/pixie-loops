export type AboutStatsType = {
  ordersDelivered: number;
  happyCustomers: number;
  yearsExperience: number;
};

export type DealType = {
  id: number;
  name: string;
  price: number;
};

export type AboutPageData = {
  stats: AboutStatsType;
  deals: DealType[];
};