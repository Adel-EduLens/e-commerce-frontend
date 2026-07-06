import type { PropsWithChildren } from "react";
import { Outlet } from "react-router-dom";
import { Footer, Navbar } from "../components/shared";

export default function UserLayout({ children }: PropsWithChildren) {
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-[1440px] flex-col bg-background">
      <div className="sticky top-0 z-20 px-4 sm:px-6 lg:px-12 pt-[18px] pb-[12px]">
        <Navbar />
      </div>
      <div className="flex-1 px-4 sm:px-6 py-[12px]">
        {children ?? <Outlet />}
      </div>
      <Footer />
    </div>
  );
}
