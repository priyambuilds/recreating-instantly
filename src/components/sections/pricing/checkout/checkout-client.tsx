'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Check, CreditCard, Shield, Clock, ArrowLeft } from 'lucide-react'
import { PaymentMethodSelector } from './payment-method-selector'
import { CardPayment } from './payment-forms/card-payment'
import { StripePayment } from './payment-forms/stripe-payment'
import { PayPalPayment } from './payment-forms/paypal-payment'
import { UPIPayment } from './payment-forms/upi-payment'
import { generateMetrics } from '@/lib/types/pricing/metrics-generator'
import { getPrice, type ProductId, type BillingCycle } from '@/lib/types/pricing/pricing'
import { useToast } from '@/hooks/use-toast'

interface CheckoutClientProps {
  product: any
  plan: any
  billing: BillingCycle
  productId: ProductId
  planId: string
}

export function CheckoutClient({ product, plan, billing, productId, planId }: CheckoutClientProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [isProcessing, setIsProcessing] = useState(false)
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('card')
  const [paymentData, setPaymentData] = useState({
    // Card data
    cardNumber: '',
    expiry: '',
    cvc: '',
    cardholderName: '',
    // UPI data
    upiId: '',
    // Common billing data
    email: '',
    firstName: '',
    lastName: ''
  })

  const price = billing === 'yearly' ? plan.yearlyPrice : plan.monthlyPrice
  const savings = getPrice(productId)
  const isEnterprise = price === null
  const metrics = generateMetrics(productId, planId)

  // Calculate pricing details
  const monthlyPrice = plan.monthlyPrice
  const yearlyPrice = plan.yearlyPrice
  const displayPrice = billing === 'yearly' ? yearlyPrice : monthlyPrice
  const annualSavings = billing === 'yearly' && monthlyPrice && yearlyPrice 
    ? (monthlyPrice * 12) - (yearlyPrice * 12) 
    : 0

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (!isLoading && isEnterprise) {
      router.push(`/contact?product=${productId}&plan=${planId}`)
    }
  }, [isEnterprise, isLoading, router, productId, planId])

  const validateForm = () => {
    if (!paymentData.email) {
      toast({
        title: "Email required",
        description: "Please enter your email address",
        variant: "destructive"
      })
      return false
    }

    switch (selectedPaymentMethod) {
      case 'card':
        if (!paymentData.cardNumber || !paymentData.expiry || !paymentData.cvc || !paymentData.cardholderName) {
          toast({
            title: "Card details required",
            description: "Please fill in all card information",
            variant: "destructive"
          })
          return false
        }
        break
      case 'upi':
        if (!paymentData.upiId) {
          toast({
            title: "UPI ID required",
            description: "Please enter your UPI ID",
            variant: "destructive"
          })
          return false
        }
        break
    }
    return true
  }

  const handleCheckout = async () => {
    if (!validateForm()) return

    setIsProcessing(true)
    
    try {
      // Server-side price validation
      const validation = await fetch('/api/validate-price', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId,
          planId,
          billing,
          clientPrice: displayPrice
        })
      })

      if (!validation.ok) {
        const error = await validation.json()
        throw new Error(error.error || 'Price validation failed')
      }

      // Simulate payment processing with different times for each method
      const processingTimes = {
        card: 2000,
        stripe: 1500,
        paypal: 2500,
        upi: 3000
      }

      console.log('Processing payment:', {
        method: selectedPaymentMethod,
        productId,
        planId,
        billing,
        price: displayPrice,
        customerData: {
          email: paymentData.email,
          name: `${paymentData.firstName} ${paymentData.lastName}`.trim()
        }
      })

      await new Promise(resolve => 
        setTimeout(resolve, processingTimes[selectedPaymentMethod as keyof typeof processingTimes] || 2000)
      )
      
      toast({
        title: "Payment successful!",
        description: `Payment processed via ${selectedPaymentMethod.toUpperCase()}. Welcome to ${plan.name}!`,
      })
      
      // Redirect to success page with order details
      const orderParams = new URLSearchParams({
        product: productId,
        plan: planId,
        billing,
        price: displayPrice.toString(),
        method: selectedPaymentMethod
      })
      
      router.push(`/payment-success?${orderParams.toString()}`)
      
    } catch (error) {
      toast({
        title: "Payment failed",
        description: error instanceof Error ? error.message : 'Something went wrong. Please try again.',
        variant: "destructive"
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const renderPaymentForm = () => {
    switch (selectedPaymentMethod) {
      case 'card':
        return (
          <CardPayment
            formData={{
              cardNumber: paymentData.cardNumber,
              expiry: paymentData.expiry,
              cvc: paymentData.cvc,
              cardholderName: paymentData.cardholderName
            }}
            onChange={(data) => setPaymentData(prev => ({ ...prev, ...data }))}
          />
        )
      
      case 'stripe':
        return (
          <StripePayment
            onConnect={() => {
              console.log('Would redirect to Stripe...')
              toast({
                title: "Stripe Integration",
                description: "This would redirect to Stripe in production",
              })
            }}
          />
        )
      
      case 'paypal':
        return (
          <PayPalPayment
            onConnect={() => {
              console.log('Would redirect to PayPal...')
              toast({
                title: "PayPal Integration",
                description: "This would redirect to PayPal in production",
              })
            }}
          />
        )
      
      case 'upi':
        return (
          <UPIPayment
            formData={{ upiId: paymentData.upiId }}
            onChange={(data) => setPaymentData(prev => ({ ...prev, ...data }))}
            onQRCode={() => {
              console.log('Would generate UPI QR code...')
              toast({
                title: "QR Code Generated",
                description: "UPI QR code would be generated in production",
              })
            }}
          />
        )
      
      default:
        return null
    }
  }

  if (isLoading) {
    return <CheckoutSkeleton />
  }

  if (isEnterprise) {
    return null // Will redirect
  }

  return (
    <div className="min-h-screen px-4 py-8 bg-background sm:py-12 lg:py-16 sm:px-6 lg:px-8">
      <div className="container max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={() => router.back()}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to pricing
          </Button>
          <div className="text-center">
            <h1 className="mb-4 text-3xl font-bold sm:text-4xl">
              Complete Your Purchase
            </h1>
            <p className="text-muted-foreground">
              You're one step away from upgrading your {product.name} experience
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          
          {/* Order Summary */}
          <div className="order-2 lg:order-1">
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Order Summary</span>
                  {plan.popular && (
                    <Badge className="bg-primary">Most Popular</Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                
                {/* Product & Plan Info */}
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-2xl">{product.icon}</span>
                    <div>
                      <h3 className="text-lg font-semibold">{product.name} - {plan.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {billing === 'yearly' ? 'Billed annually' : 'Billed monthly'}
                      </p>
                    </div>
                  </div>

                  {/* Metrics */}
                  {metrics.length > 0 && (
                    <div className="p-3 mb-4 rounded-lg bg-muted/50">
                      <div className="mb-2 text-sm font-medium">What you get:</div>
                      <div className="space-y-1">
                        {metrics.map((metric, index) => (
                          <div key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Check className="w-3 h-3 text-primary" />
                            {typeof metric.value === 'number' ? metric.value.toLocaleString() : metric.value} {metric.label}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Features Preview */}
                  <div className="space-y-2">
                    <div className="text-sm font-medium">Key features:</div>
                    {plan.features.slice(0, 4).map((feature: string, index: number) => (
                      <div key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Check className="flex-shrink-0 w-3 h-3 text-primary" />
                        <span>{feature}</span>
                      </div>
                    ))}
                    {plan.features.length > 4 && (
                      <div className="ml-5 text-sm text-muted-foreground">
                        +{plan.features.length - 4} more features
                      </div>
                    )}
                  </div>
                </div>

                <Separator />

                {/* Pricing Breakdown */}
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm">
                      {plan.name} Plan
                    </span>
                    <span className="text-sm font-medium">
                      ${displayPrice}
                    </span>
                  </div>
                  
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Billing cycle</span>
                    <span className="capitalize">{billing}</span>
                  </div>
                  
                  {billing === 'yearly' && annualSavings > 0 && (
                    <>
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>Monthly equivalent</span>
                        <span>${Math.round(yearlyPrice / 12)}/month</span>
                      </div>
                      <div className="flex justify-between text-sm text-green-600 dark:text-green-400">
                        <span>You save ({savings}% off)</span>
                        <span>-${annualSavings.toFixed(2)}</span>
                      </div>
                    </>
                  )}

                  <Separator />
                  
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total</span>
                    <span>${displayPrice}</span>
                  </div>
                  
                  {billing === 'yearly' && (
                    <p className="text-xs text-muted-foreground">
                      Next billing: {new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                    </p>
                  )}
                </div>

                {/* Trust Signals */}
                <div className="p-4 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium">Secure Checkout</span>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">
                      ✓ 30-day money-back guarantee
                    </p>
                    <p className="text-xs text-muted-foreground">
                      ✓ Cancel anytime, no questions asked
                    </p>
                    <p className="text-xs text-muted-foreground">
                      ✓ Your data is encrypted and secure
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Payment Form */}
          <div className="order-1 lg:order-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Payment Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                
                {/* Payment Method Selector */}
                <PaymentMethodSelector
                  selectedMethod={selectedPaymentMethod}
                  onMethodChange={setSelectedPaymentMethod}
                />

                {/* Dynamic Payment Form */}
                {renderPaymentForm()}

                {/* Common Email Field */}
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="john@example.com"
                    value={paymentData.email}
                    onChange={(e) => setPaymentData(prev => ({ ...prev, email: e.target.value }))}
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    Receipt and account details will be sent here
                  </p>
                </div>

                {/* Billing Information - Only for card payments */}
                {selectedPaymentMethod === 'card' && (
                  <div className="space-y-4">
                    <Label className="text-base font-medium">Billing Information</Label>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name *</Label>
                        <Input 
                          id="firstName" 
                          placeholder="John"
                          value={paymentData.firstName}
                          onChange={(e) => setPaymentData(prev => ({ ...prev, firstName: e.target.value }))}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name *</Label>
                        <Input 
                          id="lastName" 
                          placeholder="Doe"
                          value={paymentData.lastName}
                          onChange={(e) => setPaymentData(prev => ({ ...prev, lastName: e.target.value }))}
                          required
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Instant Activation Notice */}
                <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-950/20">
                  <div className="flex items-center gap-2 mb-1">
                    <Clock className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-medium text-blue-900 dark:text-blue-100">
                      Instant Activation
                    </span>
                  </div>
                  <p className="text-xs text-blue-700 dark:text-blue-200">
                    Your {plan.name} plan will be activated immediately after payment confirmation.
                  </p>
                </div>

                {/* Complete Purchase Button */}
                <Button 
                  onClick={handleCheckout}
                  className="w-full h-12 text-base" 
                  disabled={isProcessing}
                  size="lg"
                >
                  {isProcessing ? (
                    <>
                      <div className="w-4 h-4 mr-2 border-b-2 border-white rounded-full animate-spin"></div>
                      Processing {selectedPaymentMethod.toUpperCase()}...
                    </>
                  ) : (
                    `Pay $${displayPrice} with ${selectedPaymentMethod.toUpperCase()}`
                  )}
                </Button>

                <p className="text-xs text-center text-muted-foreground">
                  By completing this purchase, you agree to our{' '}
                  <a href="/terms" className="underline hover:no-underline">Terms of Service</a> and{' '}
                  <a href="/privacy" className="underline hover:no-underline">Privacy Policy</a>.
                  {billing === 'yearly' ? ' Your subscription will auto-renew annually.' : ' Your subscription will auto-renew monthly.'}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

function CheckoutSkeleton() {
  return (
    <div className="min-h-screen px-4 py-8 bg-background sm:py-12 lg:py-16 sm:px-6 lg:px-8">
      <div className="container max-w-6xl mx-auto">
        <div className="mb-8 text-center">
          <Skeleton className="w-64 h-8 mx-auto mb-4" />
          <Skeleton className="h-4 mx-auto w-96" />
        </div>
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <Skeleton className="w-40 h-6" />
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="w-full h-20" />
              <Skeleton className="w-full h-4" />
              <Skeleton className="w-3/4 h-4" />
              <Skeleton className="w-full h-16" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <Skeleton className="w-48 h-6" />
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="w-full h-32" />
              <Skeleton className="w-full h-10" />
              <Skeleton className="w-full h-10" />
              <Skeleton className="w-full h-12" />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
