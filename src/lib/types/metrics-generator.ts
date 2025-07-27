import { PRODUCT_CATEGORIES, type ProductId } from '@/lib/types/pricing'

export interface Metric {
  label: string
  value: string | number
}

type OutreachPlan = {
  contacts?: number
  emailsPerMonth?: number
  [key: string]: unknown
}

type SupersearchPlan = {
  credits: number
  [key: string]: unknown
}

export function generateMetrics(productId: ProductId, planId: string): Metric[] {
  const product = PRODUCT_CATEGORIES[productId]
  if (!product) return []

  const plan = product.plans[planId as keyof typeof product.plans]
  if (!plan) return []

  switch (productId) {
    case 'outreach': {
      const outreachPlan = plan as OutreachPlan
      return [
        ...(typeof outreachPlan.contacts !== 'undefined' ? [{ label: 'contacts', value: outreachPlan.contacts }] : []),
        ...(typeof outreachPlan.emailsPerMonth !== 'undefined' ? [{ label: 'emails/month', value: outreachPlan.emailsPerMonth }] : [])
      ]
    }
    case 'supersearch': {
      const supersearchPlan = plan as unknown as SupersearchPlan
      return [
        { label: 'credits/month', value: supersearchPlan.credits }
      ]
    }
    case 'crm':
      // CRM plans don't have specific metrics in your data
      return []
    default:
      return []
  }
}

// Batch generator for all plans in a product
export function generateAllMetrics(productId: ProductId): Record<string, Metric[]> {
  const product = PRODUCT_CATEGORIES[productId]
  if (!product) return {}

  const metrics: Record<string, Metric[]> = {}
  
  Object.keys(product.plans).forEach(planId => {
    metrics[planId] = generateMetrics(productId, planId)
  })
  
  return metrics
}

// Format large numbers consistently
export function formatMetricValue(value: string | number): string {
  if (typeof value === 'string') return value
  if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`
  if (value >= 1000) return `${(value / 1000).toFixed(0)}K`
  return value.toString()
}
