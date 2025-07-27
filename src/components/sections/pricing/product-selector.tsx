'use client'

import { Button } from '@/components/ui/button'

interface ProductOption {
    id: string
    name: string
    icon: string
}

interface ProductSelectorProps {
    products: ProductOption[]
    selected: string
    onSelect: (productId: string) => void
    className?:string
}

export function ProductSelector({
    products,
    selected,
    onSelect,
    className
}:ProductSelectorProps) {
    return (
        <div className={`flex flex-wrap justify-center gap-3 ${className}`}>
            {products.map((product) => (
                <Button
                    key={product.id}
                    variant={selected === product.id ? 'default' : 'outline'}
                    onClick={() => onSelect(product.id)}
                    className="flex items-center gap-2 px-6 font-medium h-11"
                >
                    <span className="text-base">{product.icon}</span>
                    <span>{product.name}</span>
                </Button>
            ))}
        </div>
    )
}