import React, { useState } from "react";
import { useAuthStore } from "../../store/useAuthStore";
import { useNavigate } from "react-router-dom";
import {
  User as UserIcon,
  ShoppingBag,
  Heart,
  MapPin,
  Settings,
  LogOut,
  ChevronRight,
  TrendingUp,
  Tag,
  Gift
} from "lucide-react";
import { toast } from "sonner";

export default function UserDashboard() {
  const { user, clearAuth } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    clearAuth();
    toast.success("Logged out successfully");
    navigate("/auth");
  };

  return (
    <div className="min-h-screen bg-dark-background text-white font-['Inter'] flex">
      {/* Sidebar */}
      <aside className="w-64 border-r border-neutral-800 bg-neutral-950 p-6 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 mb-8">
            <UserIcon className="text-lime-300" size={28} />
            <span className="font-extrabold font-['Montserrat'] text-xl tracking-wider">
              MY<span className="text-lime-300">ACCOUNT</span>
            </span>
          </div>

          <div className="space-y-2">
            <button className="w-full flex items-center gap-3 px-4 py-3 bg-lime-300/10 text-lime-300 rounded-xl font-medium text-sm text-left">
              <ShoppingBag size={18} />
              <span>Purchase History</span>
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-text hover:text-white hover:bg-neutral-900 rounded-xl font-medium text-sm text-left transition-all">
              <Heart size={18} />
              <span>My Wishlist</span>
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-text hover:text-white hover:bg-neutral-900 rounded-xl font-medium text-sm text-left transition-all">
              <MapPin size={18} />
              <span>Shipping Addresses</span>
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-text hover:text-white hover:bg-neutral-900 rounded-xl font-medium text-sm text-left transition-all">
              <Settings size={18} />
              <span>Security Settings</span>
            </button>
          </div>
        </div>

        <div>
          <div className="flex items-center gap-3 p-3 bg-neutral-900 rounded-xl mb-4">
            <div className="w-9 h-9 rounded-full bg-lime-300 flex items-center justify-center font-bold text-dark-background text-sm uppercase">
              {user?.name?.slice(0, 2) || "US"}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-semibold truncate">{user?.name || "Customer"}</p>
              <span className="text-xs text-lime-300 font-semibold tracking-wider uppercase">
                Customer
              </span>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 border border-neutral-800 hover:border-lime-500/30 hover:bg-lime-500/10 text-gray-text hover:text-lime-300 rounded-xl font-semibold text-sm transition-all cursor-pointer"
          >
            <LogOut size={16} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-extrabold font-['Montserrat']">My Dashboard</h1>
            <p className="text-gray-text text-sm mt-1">View order history, claim perks, and track style shipments</p>
          </div>
          <button
            onClick={() => navigate("/")}
            className="px-5 py-2.5 bg-white text-dark-background hover:bg-lime-300 font-bold rounded-xl text-sm transition-all shadow-lg"
          >
            Go Shop
          </button>
        </header>

        {/* Perks Grid */}
        <section className="grid grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-lime-300/10 to-neutral-900 border border-lime-300/20 rounded-2xl p-6">
            <div className="flex justify-between items-start mb-4">
              <span className="text-lime-300 text-xs font-bold uppercase tracking-wider">
                My Style Level
              </span>
              <TrendingUp className="text-lime-300" size={18} />
            </div>
            <p className="text-2xl font-extrabold font-['Montserrat'] text-white">Elite Icon</p>
            <span className="text-xs text-gray-text mt-2 block">1,240 XP to Next Tier</span>
          </div>

          <div className="bg-neutral-900/60 border border-neutral-800 rounded-2xl p-6">
            <div className="flex justify-between items-start mb-4">
              <span className="text-gray-text text-xs font-semibold uppercase tracking-wider">
                Vouchers Available
              </span>
              <Tag className="text-purple-400" size={18} />
            </div>
            <p className="text-2xl font-extrabold font-['Montserrat'] text-white">3 Active</p>
            <span className="text-xs text-purple-400 font-semibold mt-2 block">15% off coupon ends in 2d</span>
          </div>

          <div className="bg-neutral-900/60 border border-neutral-800 rounded-2xl p-6">
            <div className="flex justify-between items-start mb-4">
              <span className="text-gray-text text-xs font-semibold uppercase tracking-wider">
                Reward Points
              </span>
              <Gift className="text-emerald-400" size={18} />
            </div>
            <p className="text-2xl font-extrabold font-['Montserrat'] text-white">450 Points</p>
            <span className="text-xs text-gray-text mt-2 block">Redeemable for free shipping</span>
          </div>
        </section>

        {/* Order History */}
        <section className="bg-neutral-900/40 border border-neutral-800 rounded-3xl p-6 mb-8">
          <h3 className="text-xl font-bold font-['Montserrat'] mb-6">Recent Orders</h3>
          
          <div className="space-y-4">
            <div className="p-4 bg-neutral-900/80 border border-neutral-800 rounded-2xl flex justify-between items-center hover:border-neutral-700 transition-all">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-neutral-800 rounded-xl flex items-center justify-center font-bold text-white text-sm">
                  #928
                </div>
                <div>
                  <p className="font-semibold text-white">Amber Blaze Classic Tee + cargo</p>
                  <p className="text-xs text-gray-text">Ordered on June 21, 2026</p>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <p className="font-extrabold font-['Montserrat'] text-lime-300">$295.00</p>
                <span className="px-3 py-1 bg-lime-300/10 text-lime-300 text-xs font-bold rounded-full border border-lime-300/20">
                  Shipped
                </span>
                <ChevronRight size={16} className="text-gray-text" />
              </div>
            </div>

            <div className="p-4 bg-neutral-900/80 border border-neutral-800 rounded-2xl flex justify-between items-center hover:border-neutral-700 transition-all">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-neutral-800 rounded-xl flex items-center justify-center font-bold text-white text-sm">
                  #871
                </div>
                <div>
                  <p className="font-semibold text-white">Plain Maxi Tabard Dress (M)</p>
                  <p className="text-xs text-gray-text">Ordered on May 15, 2026</p>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <p className="font-extrabold font-['Montserrat'] text-lime-300">$120.00</p>
                <span className="px-3 py-1 bg-neutral-800 text-gray-text text-xs font-bold rounded-full">
                  Delivered
                </span>
                <ChevronRight size={16} className="text-gray-text" />
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
