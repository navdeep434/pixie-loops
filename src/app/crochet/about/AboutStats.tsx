"use client";

import { AboutStatsType } from "./types";
import { Card, Heading, Text } from "@/components/elements";
import { Package, Users, Clock } from "lucide-react";

export default function AboutStats({ stats }: { stats: AboutStatsType }) {
  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-12 text-center">
          <Heading level={2} gradient className="mb-4">
            Our Journey in Numbers
          </Heading>
          <Text variant="lead" className="text-gray-600">
            Proud milestones we've achieved together
          </Text>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          <Stat 
            label="Orders Delivered" 
            value={stats.ordersDelivered}
            icon={<Package className="h-8 w-8" />}
            color="from-purple-600 to-pink-600"
          />
          <Stat 
            label="Happy Customers" 
            value={stats.happyCustomers}
            icon={<Users className="h-8 w-8" />}
            color="from-pink-600 to-rose-600"
          />
          <Stat 
            label="Years of Crafting" 
            value={stats.yearsExperience}
            icon={<Clock className="h-8 w-8" />}
            color="from-rose-600 to-purple-600"
          />
        </div>
      </div>
    </section>
  );
}

function Stat({ 
  label, 
  value, 
  icon,
  color,
}: { 
  label: string; 
  value: number;
  icon: React.ReactNode;
  color: string;
}) {
  return (
    <Card variant="bordered" className="p-8 text-center space-y-4 hover:shadow-2xl transition-shadow">
      <div className={`mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br ${color} text-white`}>
        {icon}
      </div>
      <div>
        <Heading level={2} className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          {value.toLocaleString()}+
        </Heading>
        <Text variant="muted" className="mt-2 font-medium">
          {label}
        </Text>
      </div>
    </Card>
  );
}