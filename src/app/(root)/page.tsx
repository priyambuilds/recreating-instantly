import { Button } from "@/ui/button"
import Link from 'next/link'

export default function Hero () {
    return (
        <section className="flex flex-1 justify-center items-center px-4 py-20">
            <div className="mx-auto max-w-2xl text-center">
                {/* Main Title */}
                <h1 className="font-extrabold text-4xl text-center text-balance tracking-tight scroll-m-20">Find, Contact & Close Your Ideal Clients</h1>
                {/* Subtitle */}
                <p className="mb-12 font-semibold text-muted-foreground text-2xl md:text-2xl tracking-tight scroll-m-20">Instantly helps you find warm leads, scale email campaigns, reach primary inboxes, engage smarter and win more with AI.</p>
                {/* Buttons */}
                <div className="flex sm:flex-row flex-col justify-center gap-4">
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