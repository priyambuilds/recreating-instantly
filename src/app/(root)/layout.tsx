import { ReactNode } from "react";

import Navbar from "@/sections/navigation/navbar & footer/navbar";
import Footer from "@/sections/navigation/navbar & footer/footer";

const RootLayout = ({ children }: { children: ReactNode }) => {
  return (
    <main>
      <Navbar />
      <div className="flex">
        <section className="flex flex-col flex-1 px-6 sm:px-14 pt-36 pb-6 max-md:pb-14 min-h-screen">
          <div className="mx-auto w-full max-w-5xl">{children}</div>
        </section>
      </div>
      <Footer/>
    </main>
  );
};

export default RootLayout;
