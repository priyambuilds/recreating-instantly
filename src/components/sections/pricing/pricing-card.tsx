"use client"

import { Check } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface PricingCardProps {
    title: string
    price: number
    period: string
    features: string[]
    isPopular?: boolean
    isYearly?: boolean
    className?: string
}

export default function PricingCard ({
    title,
    price,
    period,
    features,
    isPopular = false,
    isYearly = false,
    className
}: PricingCardProps) {
    // Business logic: 20% discount for yearly
    const displayPrice = isYearly ? Math.round(price * 0.8) : price
    // Generate checkout URL with query params
}