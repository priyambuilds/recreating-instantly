import Navbar from "@/components/navbar";
import Hero from "@/components/hero";
import Footer from "@/components/footer";

export default function Home() {
  return (
    <div className="flex w-full flex-col items-start min-h-screen bg-white">
      <Navbar />
      <Hero />
      <Footer />
    </div>
  );
}
