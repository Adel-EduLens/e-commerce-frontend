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
    <div className="relative mx-auto min-h-[1400px] w-[1440px] bg-[#F9FAFB]">
      <Navbar />
      <AccountSidebar />
      <Outlet context={{ setFooterConfig }} />
      <Footer
        top={footerConfig.top}
        height={footerConfig.height}
        innerHeight={footerConfig.innerHeight}
        style={footerConfig.style}
      />
    </div>
  );
}
