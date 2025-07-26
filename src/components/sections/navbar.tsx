"use client"

import * as React from "react"
import Link from "next/link"
import { useTheme } from "next-themes"
import { Button } from "@/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/ui/sheet"
import { Moon, Sun, Menu } from "lucide-react"
import Image from 'next/image'

const navigation = [
  {name: 'home', href: '/'},
  {name: 'pricing', href: '/pricing'},
  {name: 'contact', href: '/contact'}
]

export default function Navbar () {
  const {theme, setTheme} = useTheme()
  const [mounted, setMounted] = React.useState(false)

  // Prevent hydration mismatch
  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <header className="sticky top-0 w-full z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container px-4 mx-auto">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/">
              <Image
                src="/logo.png"
                width={50}
                height={50}
                alt="logo"
                quality={80}
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="items-center hidden space-x-8 md:flex">
            {navigation.map((item) => (
              <Link
                className="text-sm font-medium transition-colors text-muted-foreground hover:text-foreground"
                key={item.name}
                href={item.href}
               >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Right side - Theme toggle, Sign in, Register */}
          <div className="flex items-center space-x-4">
            <Button
             variant="ghost"
             size="icon"
             onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            >
              {theme === 'light' ? (
                <Moon className="w-4 h-4"/>
              ): (
                <Sun className="w-4 h-4"/>
              )}
              <span className="sr-only">Toggle theme</span>
            </Button>

            {/* Desktop Auth Buttons */}
            <div className="items-center hidden space-x-2 md:flex">
              <Button variant="ghost" size="sm">Login In</Button>
              <Button variant="ghost" size="sm">Register</Button>
            </div>

            {/* Mobile Menu Button */}
            
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="w-4 h-4"/>
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="top" className="w-full h-full p-4">
                <nav className="flex flex-col mt-8 space-y-4">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="text-sm font-medium transition-colors text-muted-foreground hover:text-foreground"
                    >
                      {item.name}
                    </Link>
                  ))}
                  <div className="pt-4 space-y-2 border-t">
                    <Button variant="ghost" size="sm" className ="w-full">Login In</Button>
                    <Button variant="ghost" size="sm" className ="w-full">Register</Button>
                  </div>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  )
}