import { ReactNode } from "react";

const RootLayout = ({ children }: { children: ReactNode }) => {
  return (
    <main>
      <div className="flex">
        <div className="mx-auto w-full max-w-5xl">{children}</div>
      </div>
    </main>
  );
};

export default RootLayout;
