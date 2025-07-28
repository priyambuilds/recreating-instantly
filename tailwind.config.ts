// tailwind.config.ts
import type { Config } from 'tailwindcss'

const config: Config = {
  theme: {
    extend: {
      colors: {
        // Neutral system
        neutral: {
          0: 'rgb(var(--neutral-0))',
          50: 'rgb(var(--neutral-50))',
          100: 'rgb(var(--neutral-100))',
          200: 'rgb(var(--neutral-200))',
          300: 'rgb(var(--neutral-300))',
          400: 'rgb(var(--neutral-400))',
          500: 'rgb(var(--neutral-500))',
          600: 'rgb(var(--neutral-600))',
          700: 'rgb(var(--neutral-700))',
          800: 'rgb(var(--neutral-800))',
          900: 'rgb(var(--neutral-900))',
          950: 'rgb(var(--neutral-950))',
        },
        // Brand system
        brand: {
          50: 'rgb(var(--brand-50))',
          100: 'rgb(var(--brand-100))',
          200: 'rgb(var(--brand-200))',
          300: 'rgb(var(--brand-300))',
          400: 'rgb(var(--brand-400))',
          500: 'rgb(var(--brand-500))',
          600: 'rgb(var(--brand-600))',
          700: 'rgb(var(--brand-700))',
          800: 'rgb(var(--brand-800))',
          900: 'rgb(var(--brand-900))',
        },
        // Semantic colors
        success: {
          50: 'rgb(var(--success-50))',
          100: 'rgb(var(--success-100))',
          200: 'rgb(var(--success-200))',
          300: 'rgb(var(--success-300))',
          400: 'rgb(var(--success-400))',
          500: 'rgb(var(--success-500))',
          600: 'rgb(var(--success-600))',
          700: 'rgb(var(--success-700))',
          800: 'rgb(var(--success-800))',
          900: 'rgb(var(--success-900))',
        },
        warning: {
          50: 'rgb(var(--warning-50))',
          100: 'rgb(var(--warning-100))',
          200: 'rgb(var(--warning-200))',
          300: 'rgb(var(--warning-300))',
          400: 'rgb(var(--warning-400))',
          500: 'rgb(var(--warning-500))',
          600: 'rgb(var(--warning-600))',
          700: 'rgb(var(--warning-700))',
          800: 'rgb(var(--warning-800))',
          900: 'rgb(var(--warning-900))',
        },
        danger: {
          50: 'rgb(var(--danger-50))',
          100: 'rgb(var(--danger-100))',
          200: 'rgb(var(--danger-200))',
          300: 'rgb(var(--danger-300))',
          400: 'rgb(var(--danger-400))',
          500: 'rgb(var(--danger-500))',
          600: 'rgb(var(--danger-600))',
          700: 'rgb(var(--danger-700))',
          800: 'rgb(var(--danger-800))',
          900: 'rgb(var(--danger-900))',
        },
        // Semantic aliases
        base: {
          DEFAULT: 'rgb(var(--base-default))',
          secondary: 'rgb(var(--base-secondary))',
          tertiary: 'rgb(var(--base-tertiary))',
          disabled: 'rgb(var(--base-disabled))',
        },
      },
      backgroundColor: {
        'hover-overlay': 'rgb(var(--hover-overlay))',
        'active-overlay': 'rgb(var(--active-overlay))',
        'scrim': 'rgb(var(--scrim))',
        'blanket': 'rgb(var(--blanket))',
        'overlay': 'rgb(var(--overlay))',
      },
      borderRadius: {
        'sm': 'var(--radius-sm)',
        'base': 'var(--radius-base)',
        'lg': 'var(--radius-lg)',
        'xl': 'var(--radius-xl)',
      },
    },
  },
}

export default config