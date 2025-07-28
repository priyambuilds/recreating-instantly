"use client";

import { Button } from "@/components/ui/button";

export type BillingCycle = "monthly" | "yearly";

interface BillingToggleProps {
  billing: BillingCycle;
  onBillingChange: (billing: BillingCycle) => void;
  savings?: number;
  className?: string;
}

export function BillingToggle({
  billing,
  onBillingChange,
  savings = 20,
  className,
}: BillingToggleProps) {
  return (
    <div
      className={`inline-flex items-center bg-muted rounded-lg p-1 ${className}`}
    >
      <Button
        variant={billing === "monthly" ? "default" : "ghost"}
        size="sm"
        onClick={() => onBillingChange("monthly")}
        className="relative px-10 h-9"
      >
        Monthly
      </Button>
      <Button
        variant={billing === "yearly" ? "default" : "ghost"}
        size="sm"
        onClick={() => onBillingChange("yearly")}
        className="relative px-6 h-9"
      >
        Yearly <span className="ml-2 text-xs bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100 px-2 py-0.5 rounded-full font-medium">
            -{savings}%
          </span>
      </Button>
    </div>
  );
}
