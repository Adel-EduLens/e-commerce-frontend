import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { LogOut, User as UserIcon, Mail, Shield, Phone } from "lucide-react";

export function HomePage() {
  const navigate = useNavigate();
  const { user, isAuthenticated, clearAuth } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated || !user) {
      navigate("/auth");
    }
  }, [isAuthenticated, user, navigate]);

  if (!isAuthenticated || !user) {
    return null;
  }

  const handleLogout = () => {
    clearAuth();
    navigate("/auth");
  };

  return (
    <div className="min-h-screen bg-dark-background flex flex-col justify-center items-center px-4 relative overflow-hidden font-['Inter']">
      {/* Decorative ambient background glows */}
      <div className="absolute w-[500px] h-[500px] rounded-full bg-lime-300/5 blur-[120px] top-[-100px] left-[-100px]" />
      <div className="absolute w-[600px] h-[600px] rounded-full bg-blue-600/5 blur-[150px] bottom-[-200px] right-[-100px]" />

      <div className="w-full max-w-md bg-dark-card border border-neutral-800 rounded-3xl p-8 shadow-2xl relative z-10 text-center">
        {/* Profile Avatar / Icon Container */}
        <div className="mx-auto w-20 h-20 bg-lime-300/10 border border-lime-300/20 rounded-full flex items-center justify-center mb-6 animate-float">
          <UserIcon className="text-lime-300 w-10 h-10" />
        </div>

        {/* Hello & User Name */}
        <h1 className="text-3xl font-extrabold font-['Montserrat'] tracking-tight text-white mb-2">
          Hello, <span className="text-lime-300">{user.name || "User"}</span>!
        </h1>
        <p className="text-gray-text text-sm mb-8">
          Welcome back to your dashboard.
        </p>

        {/* User Details Box */}
        <div className="bg-neutral-900/60 rounded-2xl p-5 border border-neutral-800/80 text-left space-y-4 mb-8">
          <div className="flex items-center gap-3">
            <Mail className="text-gray-text w-4 h-4 shrink-0" />
            <div className="min-w-0">
              <p className="text-xs text-gray-text font-medium">Email Address</p>
              <p className="text-sm text-white truncate font-medium">{user.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Shield className="text-gray-text w-4 h-4 shrink-0" />
            <div>
              <p className="text-xs text-gray-text font-medium">Access Role</p>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-lime-300/10 text-lime-300 mt-0.5 border border-lime-300/20 uppercase">
                {user.role}
              </span>
            </div>
          </div>

          {typeof user.phone === "string" && user.phone && (
            <div className="flex items-center gap-3">
              <Phone className="text-gray-text w-4 h-4 shrink-0" />
              <div>
                <p className="text-xs text-gray-text font-medium">Phone Number</p>
                <p className="text-sm text-white font-medium">{user.phone}</p>
              </div>
            </div>
          )}
        </div>

        {/* Action Button */}
        <button
          onClick={handleLogout}
          className="w-full py-3.5 bg-neutral-800 hover:bg-red-950/40 hover:text-red-400 hover:border-red-900/50 border border-neutral-700 font-bold rounded-2xl transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer group"
        >
          <LogOut className="w-5 h-5 transition-transform group-hover:translate-x-0.5" />
          <span>Log Out</span>
        </button>
      </div>
    </div>
  );
}

export default HomePage;
