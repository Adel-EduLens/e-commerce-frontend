import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { Navbar, AccountSidebar } from "../components/shared";

export default function AccountLayout() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated || !user) {
      navigate("/login");
    }
  }, [isAuthenticated, user, navigate]);

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <div className="relative mx-auto min-h-[1400px] w-[1440px] bg-[#F9FAFB]">
      <Navbar />
      <AccountSidebar />
      <Outlet />
    </div>
  );
}
