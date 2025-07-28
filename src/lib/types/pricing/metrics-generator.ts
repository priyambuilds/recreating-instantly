import { PRODUCT_CATEGORIES, type ProductId } from '@/lib/types/pricing/pricing'

export interface Metric {
  label: string
  value: string | number
}


// Config-driven metric extraction for maintainability
const METRIC_CONFIG: Record<string, Array<{ key: string; label: string }>> = {
  outreach: [
    { key: 'contacts', label: 'contacts' },
    { key: 'emailsPerMonth', label: 'emails/month' },
  ],
  supersearch: [
    { key: 'credits', label: 'credits/month' },
  ],
  // crm: [] // No metrics for CRM
};

export function generateMetrics(productId: ProductId, planId: string): Metric[] {
  const product = PRODUCT_CATEGORIES[productId];
  if (!product) return [];
  const plan = product.plans[planId as keyof typeof product.plans];
  if (!plan) return [];

  type PlanType = typeof product.plans[keyof typeof product.plans];
  const config = METRIC_CONFIG[productId] || [];
  return config
    .map(({ key, label }) => {
      const value = (plan as PlanType)[key as keyof PlanType];
      if (typeof value === 'undefined') return null;
      return { label, value };
    })
    .filter(Boolean) as Metric[];
}

// Batch generator for all plans in a product
export function generateAllMetrics(productId: ProductId): Record<string, Metric[]> {
  const product = PRODUCT_CATEGORIES[productId];
  if (!product) return {};
  const metrics: Record<string, Metric[]> = {};
  Object.keys(product.plans).forEach(planId => {
    metrics[planId] = generateMetrics(productId, planId);
  });
  return metrics;
}

// Format large numbers consistently
export function formatMetricValue(value: string | number): string {
  if (typeof value === 'string') return value;
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(0)}K`;
  return value.toString();
}
