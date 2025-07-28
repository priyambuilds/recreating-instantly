import { Github, Twitter, Instagram, Linkedin } from "lucide-react"
import Image from 'next/image';
import Link from "next/link";

const footerSections = [
  {
    title: "Quick Links",
    links: [
      "Warmup",
      "Pricing",
      "CRM",
      "About",
      "Wall Of Love",
      "Experts",
      "Affiliate",
      "Case Studies",
      "Copilot"
    ]
  },
  {
    title: "Support",
    links: [
      "Help Desk",
      "Roadmap",
      "Facebook Group",
      "Slack Community"
    ]
  },
  {
    title: "Company",
    links: [
      "Terms",
      "Privacy",
      "Don't Sell My Info",
      "Privacy Center",
      "Cookie Declaration"
    ]
  }
]

export default function Footer() {
  return (
    <footer className="border-t bg-background border-border">
      <div className="container px-4 py-12 mx-auto sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Logo and social */}
          <div className="space-y-4">
            <div className="flex items-center">
              <Link href="/"><Image src="/logo.png" alt="Logo" width={40} height={40}></Image></Link>
            </div>
            <div className="flex space-x-4">
              <Link href="#" className="transition-colors text-muted-foreground hover:text-foreground">
                <Twitter className="w-5 h-5" />
              </Link>
              <Link href="#" className="transition-colors text-muted-foreground hover:text-foreground">
                <Instagram className="w-5 h-5" />
              </Link>
              <Link href="#" className="transition-colors text-muted-foreground hover:text-foreground">
                <Github className="w-5 h-5" />
              </Link>
              <Link href="#" className="transition-colors text-muted-foreground hLinkver:text-foreground">
                <Linkedin className="w-5 h-5" />
              </Link>
            </div>
          </div>

          {/* Footer sections */}
          {footerSections.map((section, index) => (
            <div key={index} className="space-y-4">
              <h3 className="font-semibold text-foreground">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <Link 
                      href="#" 
                      className="text-sm transition-colors text-muted-foreground hover:text-foreground"
                    >
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="pt-8 mt-12 text-center border-t border-border">
          <p className="text-sm text-muted-foreground">
            © 2025 Instantly.ai. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}