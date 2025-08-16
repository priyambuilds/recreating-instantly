// src/app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "sonner";
import ThemeProvider from "@/components/theme-provider";

export const metadata: Metadata = {
  title: {
    default: "Instantly Clone - Scale Your Cold Email Outreach",
    template: "%s | Instantly Clone",
  },
  icons: {
    icon: "/logo.png",
  },
  description:
    "Send thousands of emails without landing in spam folders. Automate your outreach with AI-powered personalization.",
  keywords: ["cold email", "email automation", "outreach", "sales"],
  authors: [{ name: "Priyam Dey" }],
  creator: "Priyam Dey",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://aichive.space",
    siteName: "Instantly Clone",
    title: "Instantly Clone - Scale Your Cold Email Outreach",
    description: "Send thousands of emails without landing in spam folders.",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "Instantly Clone",
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Toaster richColors position="top-center" />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
