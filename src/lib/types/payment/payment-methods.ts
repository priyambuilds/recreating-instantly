export interface PaymentMethod {
    id: string
    name: string
    description: string
    icon: string
    available: boolean
}

export const PAYMENT_METHODS: PaymentMethod[] = [
    {
        id: 'card',
        name: 'Credit/Debit Card',
        icon: '💳',
        description: 'Visa, Mastercard, American Express',
        available: true
      },
      {
        id: 'stripe',
        name: 'Stripe',
        icon: '🟣',
        description: 'Secure payment processing',
        available: true
      },
      {
        id: 'paypal',
        name: 'PayPal',
        icon: '🅿️',
        description: 'Pay with your PayPal account',
        available: true
      },
      {
        id: 'upi',
        name: 'UPI',
        icon: '🇮🇳',
        description: 'GPay, PhonePe, Paytm, BHIM',
        available: true
      }
]