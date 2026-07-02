import type { PropsWithChildren } from "react";
import { Outlet } from "react-router-dom";
import { Footer, Navbar } from "../components/shared";

export default function UserLayout({ children }: PropsWithChildren) {
  return (
    <div className="relative mx-auto min-h-[1498px] w-[1440px] bg-[#F9FAFB]">
      <Navbar />
      <div className="absolute left-[24px] top-[122px] right-[24px]">
        {children ?? <Outlet />}
      </div>
      <Footer top="top-[1056px]" />
    </div>
  );
}
