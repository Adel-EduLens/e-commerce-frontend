import type { CSSProperties } from "react";
import { useEffect, useMemo, useState } from "react";
import { Outlet, useMatches, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { Navbar, AccountSidebar, Footer } from "../components/shared";

export type AccountFooterConfig = {
  top?: string;
  height?: string;
  innerHeight?: string;
  style?: CSSProperties;
};

export type AccountLayoutContext = {
  setFooterConfig: (config: AccountFooterConfig) => void;
};

export default function AccountLayout() {
  const navigate = useNavigate();
  const matches = useMatches();
  const { user, isAuthenticated } = useAuthStore();
  const matchedFooterConfig = useMemo<AccountFooterConfig>(() => {
    const deepestMatch = matches[matches.length - 1];
    const matchHandle = deepestMatch?.handle as
      | { footer?: AccountFooterConfig }
      | undefined;

    return matchHandle?.footer ?? { top: "top-[917px]" };
  }, [matches]);
  const [footerConfig, setFooterConfig] = useState<AccountFooterConfig>(matchedFooterConfig);

  useEffect(() => {
    if (!isAuthenticated || !user) {
      navigate("/login");
    }
  }, [isAuthenticated, user, navigate]);

  useEffect(() => {
    setFooterConfig(matchedFooterConfig);
  }, [matchedFooterConfig]);

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <div className="mx-auto flex min-h-screen w-[1440px] flex-col bg-[#F9FAFB]">
      <div className="sticky top-0 z-20 px-12 pt-4.5 pb-3">
        <Navbar />
      </div>
      <div className="flex flex-1 gap-6 px-6 py-3">
        <AccountSidebar />
        <div className="flex-1">
          <Outlet context={{ setFooterConfig }} />
        </div>
      </div>
      <Footer />
    </div>
  );
}
