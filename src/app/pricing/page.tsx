"use client"

import { useState } from 'react'
import { ProductSelector } from '@/sections/pricing/product-selector'
import { BillingToggle, type BillingCycle } from '@/sections/pricing/billing-toggle'
import PricingCard from '@/sections/pricing/pricing-card'
import { generateMetrics } from '@/lib/types/metrics-generator'
import { PRODUCT_CATEGORIES, type ProductId, getPrice } from '@/lib/types/pricing'

export default function PricingSection() {
  const [selectedProduct, setSelectedProduct] = useState<ProductId>('outreach')
  const [billing, setBilling] = useState<BillingCycle>('monthly')

  // Get current product data
  const currentProduct = PRODUCT_CATEGORIES[selectedProduct]
  const savings = getPrice(selectedProduct)
  // Format products for selector
  const products = Object.values(PRODUCT_CATEGORIES).map(p => ({
    id: p.id,
    name: p.name,
    icon: p.icon
  }))

  // Define a type for plan
  type Plan = {
    id: string
    name: string
    monthlyPrice: number
    yearlyPrice: number
    features: string[]
    popular?: boolean
  }
  // Convert plans to PricingCard format
  const formatPlan = (plan: Plan) => ({
    id: plan.id,
    name: plan.name,
    monthlyPrice: plan.monthlyPrice,
    yearlyPrice: plan.yearlyPrice,
    features: plan.features,
    popular: plan.popular || false
  })

  return (
    <section className="py-20 bg-background">
      <div className="container px-4 mx-auto mx-w-7xl">
        {/* Header */}
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-4xl font-bold md:text-5xl">
            Choose Your Plan
          </h2>
          <p className="max-w-2xl mx-auto mb-12 text-xl text-muted-foreground">
          {currentProduct.description}
          </p>

          {/* Product Selector */}
          <ProductSelector
            products={products}
            selected={selectedProduct}
            onSelect={(productId) => setSelectedProduct(productId as ProductId)}
            className="mb-8"
          />

          {/* Billing Toggle */}
          <div>
            <BillingToggle
              billing={billing}
              onBillingChange={setBilling}
              savings={savings}
            />
          </div>
        </div>
        
        {/* Pricing Cards Grid */}
        <div className={`grid gap-8 max-w-6xl mx-auto ${
          Object.keys(currentProduct.plans).length === 2 ? 'md:grid-cols-2' :
          Object.keys(currentProduct.plans).length === 3 ? 'md:grid-cols-2 lg:grid-cols-3' :
          'md:grid-cols-2 lg:grid-cols-4'
        }`}>
          {Object.values(currentProduct.plans).map((plan: Plan) => (
            <PricingCard
              key={plan.id}
              plan={formatPlan(plan)}
              billing={billing}
              productId={selectedProduct}
              savings={savings}
              metrics={generateMetrics(selectedProduct, plan.id)}
            />
          ))}
        </div>

        {/* Trust indicators */}
        <div className="mt-16 text-center">
          <p className="mb-4 text-sm text-muted-foreground">
            Trusted by 10,000+ companies worldwide
          </p>
          <div className="flex items-center justify-center gap-6 text-xs text-muted-foreground">
            <span>✓ 30-day money back guarantee</span>
            <span>✓ Cancel anytime</span>
            <span>✓ No setup fees</span>
          </div>
        </div>
      </div>
    </section>
  )
}