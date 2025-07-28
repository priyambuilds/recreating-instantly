'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

interface UPIPaymentProps {
  formData: { upiId: string }
  onChange: (data: { upiId: string }) => void
  onQRCode: () => void
}

export function UPIPayment({ formData, onChange, onQRCode }: UPIPaymentProps) {
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'qr'>('upi')

  const upiApps = [
    { name: 'Google Pay', icon: '🟢', id: 'gpay' },
    { name: 'PhonePe', icon: '🟣', id: 'phonepe' },
    { name: 'Paytm', icon: '🔵', id: 'paytm' },
    { name: 'BHIM', icon: '🟠', id: 'bhim' }
  ]

  return (
    <div className="space-y-6">
      {/* UPI Method Selector */}
      <div className="flex gap-2">
        <Button
          variant={paymentMethod === 'upi' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setPaymentMethod('upi')}
        >
          UPI ID
        </Button>
        <Button
          variant={paymentMethod === 'qr' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setPaymentMethod('qr')}
        >
          QR Code
        </Button>
      </div>

      {paymentMethod === 'upi' ? (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="upiId">UPI ID</Label>
            <Input 
              id="upiId" 
              placeholder="yourname@paytm"
              value={formData.upiId}
              onChange={(e) => onChange({ ...formData, upiId: e.target.value })}
            />
          </div>

          <Separator />

          <div>
            <Label className="text-sm font-medium">Popular UPI Apps</Label>
            <div className="grid grid-cols-2 gap-3 mt-3">
              {upiApps.map((app) => (
                <Button
                  key={app.id}
                  variant="outline"
                  className="justify-start h-12 gap-3"
                  onClick={() => {/* Handle app selection */}}
                >
                  <span className="text-lg">{app.icon}</span>
                  <span className="text-sm">{app.name}</span>
                </Button>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <Card className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-950/20 dark:to-red-950/20">
          <CardContent className="p-6">
            <div className="space-y-4 text-center">
              <div className="text-4xl">📱</div>
              <div>
                <h3 className="font-semibold">Scan QR Code</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Use any UPI app to scan and pay
                </p>
              </div>
              <Button onClick={onQRCode} className="w-full">
                Generate QR Code
              </Button>
              <div className="text-xs text-muted-foreground">
                Works with GPay, PhonePe, Paytm, and all UPI apps
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}