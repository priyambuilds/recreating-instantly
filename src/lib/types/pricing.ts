export const PRODUCT_CATEGORIES = {
    outreach: {
      id: 'outreach' as const,
      name: 'Outreach',
      description: 'Email marketing and cold outreach campaigns',
      icon: '📧',
      plans: {
        growth: {
          id: 'growth',
          name: 'Growth',
          monthlyPrice: 37,
          yearlyPrice: 30, // 20% off
          contacts: 1000,
          emailsPerMonth: 5000,
          features: [
            'Unlimited email accounts',
            'Unlimited email warmup',
            'Advanced sequences',
            'Email analytics',
            'A/Z testing',
            'API integrations',
            'Chat support'
          ]
        },
        hypergrowth: {
          id: 'hypergrowth',
          name: 'Hypergrowth',
          monthlyPrice: 97,
          yearlyPrice: 77.6, // 20% off
          contacts: 25000,
          emailsPerMonth: 100000,
          popular: true,
          features: [
            'Everything in Growth',
            'Premium live support',
            'Advanced deliverability features',
            'Priority processing',
            'Enhanced analytics'
          ]
        },
        lightspeed: {
          id: 'lightspeed',
          name: 'Light Speed',
          monthlyPrice: 358,
          yearlyPrice: 286.3, // 20% off
          contacts: 100000,
          emailsPerMonth: 500000,
          features: [
            'Everything in Hypergrowth',
            'SISR System for deliverability',
            'Dedicated IP pools',
            'Advanced server rotation',
            'Maximum sending capacity'
          ]
        },
        enterprise: {
          id: 'enterprise',
          name: 'Enterprise',
          monthlyPrice: null,
          yearlyPrice: null,
          contacts: 'Unlimited',
          emailsPerMonth: 'Unlimited',
          features: [
            'Everything in Light Speed',
            'Dedicated account manager',
            'Private deliverability network',
            'Custom integrations',
            'SLA guarantee',
            'White-label options'
          ]
        }
      }
    },
    supersearch: {
      id: 'supersearch' as const,
      name: 'SuperSearch',
      description: 'B2B lead database and AI-powered research',
      icon: '🔍',
      plans: {
        growth: {
          id: 'growth',
          name: 'Growth',
          monthlyPrice: 47,
          yearlyPrice: 42.3, // 10% off
          credits: '1,500-2,000',
          features: [
            '450M+ B2B leads database',
            '13 advanced filters',
            'Access to 5 major LLMs',
            'AI email writer',
            'Waterfall email enrichment',
            'Web researcher agent',
            '100+ AI templates'
          ]
        },
        hypercredits: {
          id: 'hypercredits',
          name: 'Hyper Credits',
          monthlyPrice: 97,
          yearlyPrice: 87.3, // 10% off
          credits: '5,000-7,500',
          popular: true,
          features: [
            'Everything in Growth',
            'Higher credit allocation',
            'Priority processing',
            'Advanced search capabilities',
            'Job posting enrichment',
            'Technology enrichment'
          ]
        },
        unlimited: {
          id: 'unlimited',
          name: 'Unlimited Credits',
          monthlyPrice: 197,
          yearlyPrice: 177.3, // 10% off
          credits: '10K-200K',
          features: [
            'Everything in Hyper Credits',
            'Massive credit allocation',
            'Bulk processing',
            'Advanced API access',
            'Custom data exports'
          ]
        },
        enterprise: {
          id: 'enterprise',
          name: 'Enterprise',
          monthlyPrice: null,
          yearlyPrice: null,
          credits: '200,000+',
          features: [
            'Everything in Unlimited',
            'Dedicated account manager',
            'Dedicated Slack channel',
            'Custom integrations',
            'Priority support'
          ]
        }
      }
    },
    crm: {
      id: 'crm' as const,
      name: 'CRM',
      description: 'Customer relationship management system',
      icon: '👥',
      plans: {
        growth: {
          id: 'growth',
          name: 'Growth CRM',
          monthlyPrice: 47,
          yearlyPrice: 37.9, // 20% off
          features: [
            'Unlimited seats',
            'Master inbox',
            'Opportunities management',
            'Lead view',
            'Task management',
            'Campaign tracking',
            'Basic reporting',
            'Major CRM integrations'
          ]
        },
        hyper: {
          id: 'hyper',
          name: 'Hyper CRM',
          monthlyPrice: 97,
          yearlyPrice: 77.6, // 20% off
          popular: true,
          features: [
            'Everything in Growth CRM',
            'Instantly AI integration',
            'Calling & SMS capabilities',
            'Advanced salesflows',
            'Website visitor tracking',
            'Advanced reporting & analytics',
            'Priority AI (Coming Soon)',
            'Follow-up AI (Coming Soon)',
            'Stripe integration (Coming Soon)'
          ]
        }
      }
    }
  } as const

export type ProductId = keyof typeof PRODUCT_CATEGORIES
export type Product = typeof PRODUCT_CATEGORIES[ProductId]
export type PlanId = string
export type BillingCycle = 'monthly' | 'yearly'

export function getProduct(productId:string):Product | null {
  return PRODUCT_CATEGORIES[productId as ProductId] || null
}

export function getPlan(productId:ProductId, planId:PlanId) {
  const product = PRODUCT_CATEGORIES[productId]
  return product?.plans[planId as keyof  typeof product.plans] || null
}

export function getPrice(productId: ProductId) : number {
  if (productId === 'supersearch') return 10 // 10% for SuperSearch
  return 20 // 20% for Outreach and CRM
}