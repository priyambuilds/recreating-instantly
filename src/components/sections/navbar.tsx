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
  href: string,
  children: React.ReactNode,
  current?: boolean,
  onClick?: () => void,
  className?: string,
}) {
  const baseClasses = "flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-colors"
  const stateClasses = current? "bg-gray-100 text-gray-900" 
    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50" 
if (href) {
  return(
    <Link href={href} className={`${baseClasses} ${stateClasses} ${className}`} {...props}>{children}</Link>
  )
} else {
  return (
    <button onClick={onClick} className={`${baseClasses} ${stateClasses} ${className}`} {...props}>{children}</button>
  )
}}

// NavbarSection Component
function NavbarSection ({
  children, className = ""
}: {
  children: React.ReactNode, className?: string
}) {
    return (
      <div className={`flex items-center gap-1 ${className}`}>
        {children}
      </div>
    );
}

// NavbarSpacer Component
function NavbarSpacer () {
    return (<div className="flex-1" />)
}

// NavbarDivider Component
function NavbarDivider ({className}:{className?: string} ) {
  return (
  <div className={`w-px h-6 bg-gray-300 ${className}`}>
  </div>
)}

// Main Navbar Component
export default function Navbar() {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathName = usePathname()

  return (
    <>
      <nav>
        <NavbarSection>
          <NavbarItem href='/' className='!px-0'>
            <span className='flex items-center justify-center gap-3'>
              <Image 
              src="/image.png" 
              alt="instantly logo"
              width={120}
              height={40}
              priority              
              className="object-contain w-auto h-8 sm:h-10 lg:h-12"
            />
            </span>
          </NavbarItem>
        </NavbarSection>
        <NavbarDivider className="max-lg:hidden" />

        <NavbarSection className="max-lg:hidden"> 
          <NavbarItem href="/" current = {pathName === '/'}>Home</NavbarItem>
          <NavbarItem href="/pricing" current = {pathName === '/pricing'}>Pricing</NavbarItem>
          <NavbarItem href="blog" current = {pathName === 'blog'}>Blog</NavbarItem>
          <NavbarItem href="/contact" current = {pathName === '/contact'}>Contact</NavbarItem>
        </NavbarSection>

        <NavbarSpacer/>

      </nav>
    </>
  )
}
