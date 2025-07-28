'use client'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface CardPaymentProps {
    formData: {
        cardNumber: string
        expiry: string
        cvc: string
        cardholderName: string
    }
    onChange: (data: CardPaymentProps['formData']) => void
}

export function CardPayment({ formData, onChange }: CardPaymentProps) {
    return (
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="cardholderName">Cardholder Name</Label>
          <Input 
            id="cardholderName" 
            placeholder="John Doe"
            value={formData.cardholderName}
            onChange={(e) => onChange({ ...formData, cardholderName: e.target.value })}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="cardNumber">Card Number</Label>
          <Input 
            id="cardNumber" 
            placeholder="1234 5678 9012 3456"
            className="font-mono"
            value={formData.cardNumber}
            onChange={(e) => onChange({ ...formData, cardNumber: e.target.value })}
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="expiry">Expiry Date</Label>
            <Input 
              id="expiry" 
              placeholder="MM/YY"
              className="font-mono"
              value={formData.expiry}
              onChange={(e) => onChange({ ...formData, expiry: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="cvc">CVC</Label>
            <Input 
              id="cvc" 
              placeholder="123"
              className="font-mono"
              value={formData.cvc}
              onChange={(e) => onChange({ ...formData, cvc: e.target.value })}
            />
          </div>
        </div>
      </div>
    )
  }