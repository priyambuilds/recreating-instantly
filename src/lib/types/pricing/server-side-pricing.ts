import { PRODUCT_CATEGORIES, type ProductId, type BillingCycle } from '@/lib/types/pricing/pricing'

interface PriceValidationResult {
  isValid: boolean
  actualPrice: number | null
  error?: string
}

export function validatePrice(
  productId: string,
  planId: string,
  billing: string,
  clientPrice: number
): PriceValidationResult {
  const product = PRODUCT_CATEGORIES[productId as ProductId];
  if (!product) {
    return { isValid: false, actualPrice: null, error: `Invalid product: ${productId}` };
  }
  const plan = product.plans[planId as keyof typeof product.plans];
  if (!plan) {
    return { isValid: false, actualPrice: null, error: `Invalid plan: ${planId}` };
  }
  const validBilling: BillingCycle = billing === 'yearly' ? 'yearly' : 'monthly';
  const priceKey = validBilling === 'yearly' ? 'yearlyPrice' : 'monthlyPrice';
  const serverPrice = plan[priceKey as 'yearlyPrice' | 'monthlyPrice'];
  if (serverPrice === null) {
    // Enterprise or custom pricing
    return { isValid: true, actualPrice: null };
  }
  if (Math.abs(clientPrice - serverPrice) > 0.01) {
    return {
      isValid: false,
      actualPrice: serverPrice,
      error: `Price mismatch: expected ${serverPrice}, got ${clientPrice}`
    };
  }
  return { isValid: true, actualPrice: serverPrice };
}

// Usage in API routes or server actions
export function createSecureCheckOutSession(
  productId: string,
  planId: string,
  billing: string,
  clientPrice: number
) {
  const validation = validatePrice(productId, planId, billing, clientPrice);
  if (!validation.isValid) {
    throw new Error(`Security violation: ${validation.error}`);
  }
  return {
    productId,
    planId,
    billing,
    price: validation.actualPrice,
    validated: true
  };
}