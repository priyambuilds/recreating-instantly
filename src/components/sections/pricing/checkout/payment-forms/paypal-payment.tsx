'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface PayPalPaymentProps {
  onConnect: () => void
}

export function PayPalPayment({ onConnect }: PayPalPaymentProps) {
  return (
    <Card className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20">
      <CardContent className="p-6">
        <div className="space-y-4 text-center">
          <div className="text-4xl">🅿️</div>
          <div>
            <h3 className="font-semibold">Pay with PayPal</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Use your PayPal account or pay with any card
            </p>
          </div>
          <Button onClick={onConnect} className="w-full bg-[#0070ba] hover:bg-[#005a9e]">
            Continue with PayPal
          </Button>
          <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <span>🛡️</span>
            <span>PayPal Buyer Protection</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}