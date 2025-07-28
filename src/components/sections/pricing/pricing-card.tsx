"use client";

import Link from "next/link";
import { Check, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export interface PricingPlan {
  id: string;
  name: string;
  monthlyPrice: number | null;
  yearlyPrice: number | null;
  features: string[];
  popular?: boolean;
}

export interface PricingCardProps {
  plan: PricingPlan;
  billing: "monthly" | "yearly";
  productId?: string;
  savings?: number;
  metrics?: {
    label: string;
    value: string | number;
  }[];
  className?: string;
  onSelect?: (planId: string, billing: "monthly" | "yearly") => void;
}

export default function PricingCard({
  plan,
  billing,
  productId = "default",
  savings = 20,
  metrics = [],
  className,
  onSelect,
}: PricingCardProps) {
  const price = billing === "yearly" ? plan.yearlyPrice : plan.monthlyPrice;
  const isPopular = plan.popular;
  const isEnterprise = price === null;

  const formatNumber = (num: number | string) => {
    if (typeof num === "string") return num;
    return num.toLocaleString();
  };

  const handleSelect = () => {
    if (onSelect) {
      onSelect(plan.id, billing);
    }
  };

  return (
    <Card
      className={cn(
        "relative h-full transition-all duration-200 hover:shadow-lg hover:-translate-y-1",
        isPopular &&
          "border-primary shadow-md scale-[1.02] z-10 ring-2 ring-primary/20",
        className
      )}
    >
      {isPopular && (
        <div className="absolute z-20 -translate-x-1/2 -top-3 left-1/2">
          <Badge className="flex items-center gap-1 shadow-sm bg-primary text-primary-foreground">
            <Star className="w-3 h-3 fill-current">Most Popular</Star>
          </Badge>
        </div>
      )}
      <CardHeader className="pt-8 pb-2 text-center">
        <h3 className="text-xl font-semibold">{plan.name}</h3>
        <div className="mt-6">
          {isEnterprise ? (
            <div className="text-center">
              <span className="text-3xl font-bold">Custom</span>
              <p className="mt-2 text-sm text-muted-foreground">
                Contact sales for pricing
              </p>
            </div>
          ) : (
            <>
              <div className="flex items-baseline justify-center">
                <span className="text-4xl font-bold">${price}</span>
                <span className="ml-1 text-muted-foreground">
                  / month
                </span>
              </div>
              {billing === "yearly" && (
                <div className="mt-2 text-center">
                  <span className="text-sm font-medium text-green-600 dark:text-green-400">
                    Save {savings}% annually
                  </span>
                </div>
              )}
            </>
          )}
        </div>
        {/* Dynamic metrics */}
        {metrics.length > 0 && (
          <div className="mt-4 space-y-1">
            {metrics.map((metric, index) => (
              <div key={index} className="text-sm text-muted-foreground">
                {formatNumber(metric.value)} {metric.label}
              </div>
            ))}
          </div>
        )}
      </CardHeader>
      <CardContent className="flex-1 px-6">
        <ul>
            {plan.features.map((feature, index) => (
                <li key={index} className="flex items-start gap-3">
                    <Check className="h-4 w-4 text-primary flex-shrink-0 mt-0.5"></Check>
                    <span className="text-sm leading-relaxed">{feature}</span>

                </li>
            ))}
        </ul>
      </CardContent>
      <CardFooter className="px-6 pt-4 pb-6">
            {onSelect ? (
                <Button
                    className="w-full"
                    variant={isPopular ? 'default' : 'outline'}
                    size="lg"
                    onClick={handleSelect}
                >
                    {isEnterprise ? 'Contact Sales' : 'Select Plan'}
                </Button>
            ):(
                <Button 
                className="w-full"
                variant={isPopular ? 'default' : 'outline'}
                size="lg"
                asChild
              >
                <Link href={isEnterprise ? 
                    `/contact?product=${productId}&plan=${plan.id}` : 
                    `/checkout/${productId}/${plan.id}?billing=${billing}`}
                >
                    {isEnterprise ? 'Contact Sales' : 'Select Plan'}
                </Link>
              </Button>
            )}
      </CardFooter>
    </Card>
  );
}
