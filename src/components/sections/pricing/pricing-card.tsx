"use client"

import Link from 'next/link'
import { Check, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

export interface PricingPlan {
    id: string
    name: string
    monthlyPrice: number | null
    yearlyPrice: number | null
    features: string[]
    popular?: boolean
  }
  
  export interface PricingCardProps {
    plan: PricingPlan
    billing: 'monthly' | 'yearly'
    productId?: string
    savings?: number
    metrics?: {
      label: string
      value: string | number
    }[]
    className?: string
    onSelect?: (planId: string, billing: 'monthly' | 'yearly') => void
  }

export default function PricingCard ({
    plan, 
    billing, 
    productId = 'default',
    savings = 20,
    metrics = [],
    className,
    onSelect
}: PricingCardProps) {
    const price= billing === 'yearly' ? plan.yearlyPrice : plan.monthlyPrice
    const isPopular = plan.popular
    const isEnterprise = price === null

    const formatNumber = (num: number | string) => {
        if (typeof num === 'string') return num
        return num.toLocaleString
    }

    const handleSelect = () => {
        if(onSelect) {
            onSelect(plan.id, billing)
        }
    }
}