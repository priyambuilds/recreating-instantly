import { PRODUCT_CATEGORIES, type ProductId, type BillingCycle } from '@/lib/types/pricing'

interface PriceValidationResult {
  isValid: boolean
  actualPrice: number | null
  error?: string
}

export function validatePrice (
    productId: string,
    planId: string,
    billing: string,
    clientPrice: number
): PriceValidationResult {
    // Step 1: Validate product exists
    const product = PRODUCT_CATEGORIES[productId as ProductId]
    if(!product) {
        return  {isValid: false, actualPrice: null, error: 'Invalid product'}
    }
    // Step 2: Validate plan exists
    const plan = product.plans[planId as keyof typeof product.plans]
    if(!plan) {
        return {isValid: false, actualPrice: null, error: 'Invalid plan'}
    }
    // Step 3: Validate billing cycle
    const validBilling: BillingCycle = billing === 'yearly' ? 'yearly' : 'monthly'
    // Step 4: Get server-side price (source of truth)
    const serverPrice = validBilling === 'yearly' ? plan.yearlyPrice : plan.monthlyPrice
    // Step 5: Handle enterprise plans (custom pricing)
    if (serverPrice === null) {
        return { isValid: true, actualPrice: null } // Enterprise - custom pricing
    }
    // Step 6: Validate client price matches server price
    if (Math.abs(clientPrice - serverPrice) > 0.01) { // Allow for floating point precision
        return { 
          isValid: false, 
          actualPrice: serverPrice, 
          error: `Price mismatch. Expected: ${serverPrice}, Received: ${clientPrice}` 
        }
    }
    return { isValid: true, actualPrice: serverPrice }
}

// Usage in API routes or server actions
export function createSecureCheckOutSession(
    productId: string,
    planId: string,
    billing: string,
    clientPrice: number
) {
    const validation = validatePrice(productId, planId, billing, clientPrice)
    if (!validation.isValid) {
        throw new Error(`Security violation: ${validation.error}`)
    }
    // Proceed with payment processing using validation.actualPrice
    return {
      productId,
      planId,
      billing,
      price: validation.actualPrice,
      validated: true
    }
}