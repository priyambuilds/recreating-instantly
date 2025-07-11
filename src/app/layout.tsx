import "../styles/globals.tailwind.css"
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import Button from "@/components/button";
import Hero from "@/components/hero";
import React from 'react';

export const metadata = {
  title: "Instantly Clone",
  description: "Landing page created with Next.js + Tailwind",
};

export default function RootLayout({children} : {children: React.ReactNode}) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        {children}
        <Hero />
        <Footer />
      </body>
    </html>
  );
}
