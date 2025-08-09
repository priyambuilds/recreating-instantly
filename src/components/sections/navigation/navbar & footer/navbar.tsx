"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Moon, Sun, Menu } from "lucide-react";
import Image from "next/image";
import ROUTES from "@/lib/constants/routes";

const navigationItems = [
  { name: "Home", href: "/" },
  { name: "Pricing", href: "/pricing" },
  { name: "Contact", href: "/contact" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = React.useState(false);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <nav className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container px-4 mx-auto sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center">
              <Image src="/logo.png" alt="Logo" width={40} height={40}></Image>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:block">
            <div className="flex items-baseline ml-10 space-x-6 xl:space-x-8">
              {navigationItems.map((item) =>
                item.href.startsWith("/") ? (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="text-sm font-medium transition-colors text-muted-foreground hover:text-foreground"
                  >
                    {item.name}
                  </Link>
                ) : (
                  <a
                    key={item.name}
                    href={item.href}
                    className="text-sm font-medium transition-colors text-muted-foreground hover:text-foreground"
                  >
                    {item.name}
                  </a>
                )
              )}
            </div>
          </div>

          {/* Right side actions */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            >
              {theme === "light" ? (
                <Moon className="w-4 h-4" />
              ) : (
                <Sun className="w-4 h-4" />
              )}
              <span className="sr-only">Toggle theme</span>
            </Button>

            {/* Desktop Auth Buttons */}
            <div className="items-center hidden space-x-2 md:flex">
              <Link href={ROUTES.SIGN_IN}>
                <Button variant="ghost" size="sm">
                  Sign In
                </Button>
              </Link>
              <Link href={ROUTES.SIGN_UP}>
                <Button size="sm">Sign Up</Button>
              </Link>
            </div>

            {/* Mobile menu button */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="lg:hidden"
                  onClick={() => setIsOpen(true)}
                >
                  <Menu className="w-5 h-5" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[320px] p-0">
                {/* Mobile Menu Header */}
                <div className="flex items-center justify-between p-6 border-b border-border">
                  <Link
                    href="/"
                    className="flex items-center"
                    onClick={() => setIsOpen(false)}
                  >
                    <div className="flex items-center justify-center w-8 h-8 rounded bg-primary">
                      <div className="text-sm font-bold text-primary-foreground">
                        L
                      </div>
                    </div>
                  </Link>
                </div>

                {/* Navigation Links */}
                <div className="px-6 py-6">
                  <div className="space-y-1">
                    {navigationItems.map((item) =>
                      item.href.startsWith("/") ? (
                        <Link
                          key={item.name}
                          href={item.href}
                          className="block px-3 py-3 text-base font-medium transition-colors rounded-md text-foreground hover:text-primary hover:bg-accent"
                          onClick={() => setIsOpen(false)}
                        >
                          {item.name}
                        </Link>
                      ) : (
                        <a
                          key={item.name}
                          href={item.href}
                          className="block px-3 py-3 text-base font-medium transition-colors rounded-md text-foreground hover:text-primary hover:bg-accent"
                          onClick={() => setIsOpen(false)}
                        >
                          {item.name}
                        </a>
                      )
                    )}
                  </div>

                  {/* Mobile Auth Buttons */}
                  <div className="pt-6 mt-6 border-t border-border">
                    <div className="space-y-3">
                      <Button
                        variant="outline"
                        className="justify-center w-full"
                        asChild
                      >
                        <Link href="/login" onClick={() => setIsOpen(false)}>
                          Sign in
                        </Link>
                      </Button>
                      <Button className="justify-center w-full" asChild>
                        <Link href="/register" onClick={() => setIsOpen(false)}>
                          Register
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}
