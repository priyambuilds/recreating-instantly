"use client";
import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { 
  MagnifyingGlassIcon, 
  InboxIcon,
  UserIcon,
  Cog8ToothIcon,
  ArrowRightEndOnRectangleIcon,
  ChevronDownIcon,
  Bars3Icon,
  XMarkIcon
  
} from '@heroicons/react/20/solid'

/* 

Desktop Layout
[Brand] | [Home] [Pricing] [Features] ~~~~~~~~ [Search] [Inbox] [User] [≡]
   ↑    ↑                              ↑                          ↑
Section Divider                      Spacer                    Section

Mobile Layout:
[Brand] ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ [Search] [Inbox] [User] [≡]
   ↑                                                                      ↑
Section                                                                Section

*/ 

// NavbarItem Component
function NavbarItem({ 
  href, 
  children, 
  current = false, 
  onClick,
  className = "",
  ...props 
}:{
  href?: string,
  children: React.ReactNode,
  current?: boolean,
  onClick?: () => void,
  className?: string,
}) {
  const baseClasses = "relative px-4 py-2 text-sm font-medium transition-all duration-200 rounded-lg"
  const stateClasses = current 
    ? "bg-gray-100 text-gray-900" 
    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
  if (href) {
    return (
      <Link 
        href={href} 
        className={`${baseClasses} ${stateClasses} ${className}`}
        {...props}
      >
        {children}
        {current && (
          <span className="absolute inset-x-0 -bottom-px h-0.50 rounded-full" />
        )}
      </Link>
    )
  }

  return (
    <button 
      onClick={onClick}
      className={`${baseClasses} ${stateClasses} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}

// NavbarSection Component
function NavbarSection ({
  children, className = ""
}: {
  children: React.ReactNode, className?: string
}) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        {children}
      </div>
    );
}


// Main Navbar Component
export default function Navbar() {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathName = usePathname()

  return (
    <>
      <nav className="sticky top-0 z-50 border-b border-neutral-300">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className='flex items-center justify-between h-16'>
            <NavbarSection>
              <NavbarItem href='/' className='!px-0'>
                <span className='flex items-center justify-center gap-3'>
                  <Image 
                  src="/image.png" 
                  alt="instantly logo"
                  width={120}
                  height={40}
                  priority              
                  className="!px-0 hover:bg-transparent"
                />
                </span>
              </NavbarItem>
            </NavbarSection>

            <NavbarSection className="max-lg:hidden"> 
              <NavbarItem href="/" current = {pathName === '/'}>Home</NavbarItem>
              <NavbarItem href="/pricing" current = {pathName === '/pricing'}>Pricing</NavbarItem>
              <NavbarItem href="/blog" current = {pathName === '/blog'}>Blog</NavbarItem>
              <NavbarItem href="/contact" current = {pathName === '/contact'}>Contact</NavbarItem>
            </NavbarSection>
            
            <NavbarSection>
            <NavbarItem href="/auth/login">Login</NavbarItem>
            <NavbarItem href="/auth/signup">Sign Up</NavbarItem>
            </NavbarSection>
          </div>
        </div>

      </nav>
    </>
  )
}
