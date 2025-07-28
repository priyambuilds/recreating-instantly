'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface StripePaymentProps {
  onConnect: () => void
}

export function StripePayment({ onConnect }: StripePaymentProps) {
  return (
    <Card className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20">
      <CardContent className="p-6">
        <div className="space-y-4 text-center">
          <div className="text-4xl">🟣</div>
          <div>
            <h3 className="font-semibold">Pay with Stripe</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Secure payment processing with industry-leading security
            </p>
          </div>
          <Button onClick={onConnect} className="w-full">
            Continue with Stripe
          </Button>
          <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <span>🔒</span>
            <span>256-bit SSL encryption</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}