import { notFound, redirect } from 'next/navigation'
import { CheckoutClient } from '@/sections/pricing/checkout/checkout-client'
import { PRODUCT_CATEGORIES, type ProductId } from '@/lib/types/pricing/pricing'

interface CheckoutPageProps {
  params: { productId: string; planId: string }
  searchParams: { billing?: string }
}

export async function generateMetadata({ params }: CheckoutPageProps) {
  const { productId, planId } = params
  
  const product = PRODUCT_CATEGORIES[productId as ProductId]
  if (!product) return { title: 'Checkout - Plan Not Found' }
  
  const plan = product.plans[planId as keyof typeof product.plans]
  if (!plan) return { title: 'Checkout - Plan Not Found' }
  
  return {
    title: `Checkout - ${product.name} ${plan.name} Plan`,
    description: `Complete your purchase for the ${plan.name} plan and start using ${product.name} today.`,
  }
}

export default function CheckoutPage({ params, searchParams }: CheckoutPageProps) {
  const { productId, planId } = params
  const billing = searchParams.billing === 'yearly' ? 'yearly' : 'monthly'
  // Server-side validation - Security first
  const product = PRODUCT_CATEGORIES[productId as ProductId]
  if (!product) {
    console.error(`Invalid product ID: ${productId}`)
    notFound()
  }
  
  const plan = product.plans[planId as keyof typeof product.plans]
  if (!plan) {
    console.error(`Invalid plan ID: ${planId} for product: ${productId}`)
    notFound()
  }

  // Handle enterprise plans - redirect to contact
  if (plan.monthlyPrice === null && plan.yearlyPrice === null) {
    redirect(`/contact?product=${productId}&plan=${planId}&ref=checkout`)
  }

  // Log checkout initiation for analytics
  console.log('Checkout initiated:', {
    productId,
    planId,
    billing,
    timestamp: new Date().toISOString()
  })

  return (
    <CheckoutClient 
      product={product}
      plan={plan}
      billing={billing}
      productId={productId as ProductId}
      planId={planId}
    />
  )
}

// Generate static params for better performance
export function generateStaticParams() {
  const params: { productId: string; planId: string }[] = []
  
  Object.entries(PRODUCT_CATEGORIES).forEach(([productId, product]) => {
    Object.keys(product.plans).forEach(planId => {
      params.push({ productId, planId })
    })
  })
  
  console.log(`Generated ${params.length} static checkout routes`)
  return params
}

// Enable ISR for dynamic pricing updates
export const revalidate = 3600 // Revalidate every hour
