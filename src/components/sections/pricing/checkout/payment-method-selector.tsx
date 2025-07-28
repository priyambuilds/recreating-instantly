'use client'

import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Badge } from '@/components/ui/badge'
import { PAYMENT_METHODS } from '@/lib/types/payment/payment-methods'

interface PaymentMethodSelectorProps {
    selectedMethod: string
    onMethodChange: (methodId: string) => void
}

export function PaymentMethodSelector ({
    selectedMethod, onMethodChange
}: PaymentMethodSelectorProps) {
    return (
        <div className="space-y-4">
            <Label className="text-base font-medium">Payment Method</Label>
            <RadioGroup
                value={selectedMethod}
                onValueChange={onMethodChange}
                className="space-y-3"
            >
                {PAYMENT_METHODS.map((method) => (
                    <div key={method.id} className="relative">
                        <RadioGroupItem
                            value={method.id}
                            className="sr-only peer"
                            disabled={!method.available}
                        />
                        <Label
                            htmlFor={method.id}
                            className={`
                                flex items-center gap-4 p-4 rounded-lg border-2 cursor-pointer transition-all
                                peer-checked:border-primary peer-checked:bg-primary/5
                                hover:border-muted-foreground/50
                                ${!method.available ? 'opacity-50 cursor-not-allowed' : ''}
                              `}
                        >
                            <div className="flex items-center flex-1 gap-3">
                                <span className="text-2x1">{method.icon}</span>
                                <div className='flex-1'>
                                    <div className='flex items-center gap-2'>
                                        <span className="font-medium">{method.name}</span>
                                        {!method.available && (
                                            <Badge variant="secondary" className="text-xs">
                                                Coming Soon
                                            </Badge>
                                        )}
                                    </div>
                                    <p className="mt-1 text-sm text-muted-gforeground">{method.description}</p>
                                </div>
                            </div>
                            <div className={`
                                w-4 h-4 rounded-full border-2 transition-all
                                ${selectedMethod === method.id
                                ? 'border-primary bg-primary'
                                : 'border-muted-foreground/30'
                            }
                            `}>
                                {selectedMethod === method.id && (
                                    <div className="w-2 h-2 bg-white rounded-full m-0.5"/>
                                )}
                            </div>
                        </Label>
                    </div>
                ))}
            </RadioGroup>
        </div>
    )
}