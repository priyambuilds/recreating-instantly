import { useState } from 'react'

interface Toast {
  title: string
  description?: string
  variant?: 'default' | 'destructive'
}

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([])

  const toast = ({ title, description, variant = 'default' }: Toast) => {
    console.log(`${variant === 'destructive' ? 'ERROR' : 'SUCCESS'}: ${title}`, description)
    // In production, integrate with actual toast system
    if (variant === 'destructive') {
      alert(`Error: ${title}\n${description}`)
    } else {
      alert(`Success: ${title}\n${description}`)
    }
  }

  return { toast, toasts }
}