import ROUTES from "@/lib/constants/routes";
import { Button } from "@/ui/button";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="flex items-center justify-center flex-1 px-4 py-20">
      <div className="max-w-2xl mx-auto text-center">
        {/* Main Title */}
        <h1 className="text-4xl font-extrabold tracking-tight text-center text-balance scroll-m-20">
          Find, Contact & Close Your Ideal Clients
        </h1>
        {/* Subtitle */}
        <p className="mb-12 text-2xl font-semibold tracking-tight text-muted-foreground md:text-2xl scroll-m-20">
          Instantly helps you find warm leads, scale email campaigns, reach
          primary inboxes, engage smarter and win more with AI.
        </p>
        {/* Buttons */}
        <div className="flex flex-col justify-center gap-4 sm:flex-row">
          <Button
            asChild
            variant="outline"
            size="lg"
            className="px-8 py-3 text-lg"
          >
            <Link href={ROUTES.SIGN_IN}>Sign In</Link>
          </Button>
          <Button
            asChild
            variant="default"
            size="lg"
            className="px-8 py-3 text-lg"
          >
            <Link href={ROUTES.SIGN_UP}>Sign up</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
