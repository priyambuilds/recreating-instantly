"use client"

import { Button } from "@/ui/button"
import Link from 'next/link'

export default function Hero () {
    return (
        <section className="flex items-center justify-center flex-1 px-4 py-20">
            <div className="max-w-2xl mx-auto text-center">
                {/* Main Title */}
                <h1 className="text-4xl font-extrabold tracking-tight text-center scroll-m-20 text-balance">Find, Contact & Close Your Ideal Clients</h1>
                {/* Subtitle */}
                <p className="mb-12 text-2xl font-semibold tracking-tight scroll-m-20 text-muted-foreground md:text-2xl">Instantly helps you find warm leads, scale email campaigns, reach primary inboxes, engage smarter and win more with AI.</p>
                {/* Buttons */}
                <div className="flex flex-col justify-center gap-4 sm:flex-row">
                    <Button
                        asChild
                        variant="outline"
                        size="lg"
                        className="px-8 py-3 text-lg"
                    >
                        <Link href="/auth/login">Login</Link>
                    </Button>
                    <Button
                        asChild
                        variant="default"
                        size="lg"
                        className="px-8 py-3 text-lg"
                    >
                        <Link href="/auth/register">Register</Link>
                    </Button>
                </div>
            </div>
        </section>
    )
}