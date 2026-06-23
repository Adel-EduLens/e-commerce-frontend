import React, { useState, useEffect } from "react";
import { useAuthStore } from "../../store/useAuthStore";
import { useNavigate } from "react-router-dom";
import {
  Users,
  Store,
  DollarSign,
  TrendingUp,
  Settings,
  Shield,
  Activity,
  LogOut,
  ChevronRight,
  UserCheck,
  Ban,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import { toast } from "sonner";
import { api } from "../../lib/axios";

interface DemoUser {
  id: string;
  name: string;
  email: string;
  role: "user" | "trader" | "admin";
  createdAt: string;
  status: "active" | "suspended";
}

export default function AdminDashboard() {
  const { user, clearAuth } = useAuthStore();
  const navigate = useNavigate();
  const [users, setUsers] = useState<DemoUser[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Initialize demo users list
  useEffect(() => {
    setUsers([
      { id: "1", name: "Alice Johnson", email: "alice@example.com", role: "user", createdAt: "2026-06-15", status: "active" },
      { id: "2", name: "David Miller", email: "david.m@trader.com", role: "trader", createdAt: "2026-06-10", status: "active" },
      { id: "3", name: "Sophia Stark", email: "sophia@example.com", role: "user", createdAt: "2026-06-20", status: "active" },
      { id: "4", name: "Nasu Trader", email: "trader@nasu.com", role: "trader", createdAt: "2026-06-23", status: "active" },
      { id: "5", name: "Emma Watson", email: "emma@example.com", role: "user", createdAt: "2026-06-01", status: "suspended" },
    ]);
  }, []);

  const handleLogout = () => {
    clearAuth();
    toast.success("Logged out successfully");
    navigate("/auth");
  };

  const toggleUserStatus = (userId: string) => {
    setUsers(
      users.map((u) => {
        if (u.id === userId) {
          const newStatus = u.status === "active" ? "suspended" : "active";
          toast.success(`User status updated to ${newStatus}`);
          return { ...u, status: newStatus };
        }
        return u;
      })
    );
  };

  const promoteToTrader = (userId: string) => {
    setUsers(
      users.map((u) => {
        if (u.id === userId) {
          toast.success(`${u.name} has been promoted to Trader!`);
          return { ...u, role: "trader" };
        }
        return u;
      })
    );
  };

  return (
    <div className="min-h-screen bg-dark-background text-white font-['Inter'] flex">
      {/* Sidebar */}
      <aside className="w-64 border-r border-neutral-800 bg-neutral-950 p-6 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 mb-8">
            <Shield className="text-red-500" size={28} />
            <span className="font-extrabold font-['Montserrat'] text-xl tracking-wider">
              ADMIN<span className="text-red-500">PORTAL</span>
            </span>
          </div>

          <div className="space-y-2">
            <button className="w-full flex items-center gap-3 px-4 py-3 bg-red-600/10 text-red-500 rounded-xl font-medium text-sm text-left">
              <Activity size={18} />
              <span>Overview</span>
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-text hover:text-white hover:bg-neutral-900 rounded-xl font-medium text-sm text-left transition-all">
              <Users size={18} />
              <span>User Management</span>
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-text hover:text-white hover:bg-neutral-900 rounded-xl font-medium text-sm text-left transition-all">
              <Store size={18} />
              <span>Trader Approvals</span>
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-text hover:text-white hover:bg-neutral-900 rounded-xl font-medium text-sm text-left transition-all">
              <Settings size={18} />
              <span>Settings</span>
            </button>
          </div>
        </div>

        <div>
          <div className="flex items-center gap-3 p-3 bg-neutral-900 rounded-xl mb-4">
            <div className="w-9 h-9 rounded-full bg-red-500 flex items-center justify-center font-bold text-white text-sm">
              AD
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-semibold truncate">{user?.name || "Admin"}</p>
              <span className="text-xs text-red-500 font-semibold tracking-wider uppercase">
                {user?.role}
              </span>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 border border-neutral-800 hover:border-red-500/30 hover:bg-red-500/10 text-gray-text hover:text-red-500 rounded-xl font-semibold text-sm transition-all cursor-pointer"
          >
            <LogOut size={16} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-8 overflow-y-auto">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-extrabold font-['Montserrat']">System Dashboard</h1>
            <p className="text-gray-text text-sm mt-1">Platform overview and user privilege logs</p>
          </div>
          <button
            onClick={() => navigate("/")}
            className="px-5 py-2.5 bg-white text-dark-background hover:bg-lime-300 font-semibold rounded-xl text-sm transition-all"
          >
            Back to Storefront
          </button>
        </header>

        {/* Stats Grid */}
        <section className="grid grid-cols-4 gap-6 mb-8">
          <div className="bg-neutral-900/60 border border-neutral-800 rounded-2xl p-6">
            <div className="flex justify-between items-start mb-4">
              <span className="text-gray-text text-sm font-semibold uppercase tracking-wider">
                Total Revenue
              </span>
              <DollarSign className="text-lime-300" size={20} />
            </div>
            <p className="text-3xl font-extrabold font-['Montserrat'] text-white">$124,580</p>
            <div className="flex items-center gap-1 mt-2 text-lime-300 text-xs font-semibold">
              <TrendingUp size={14} />
              <span>+18.2% this week</span>
            </div>
          </div>

          <div className="bg-neutral-900/60 border border-neutral-800 rounded-2xl p-6">
            <div className="flex justify-between items-start mb-4">
              <span className="text-gray-text text-sm font-semibold uppercase tracking-wider">
                Active Users
              </span>
              <Users className="text-sky-400" size={20} />
            </div>
            <p className="text-3xl font-extrabold font-['Montserrat'] text-white">4,829</p>
            <div className="flex items-center gap-1 mt-2 text-sky-400 text-xs font-semibold">
              <TrendingUp size={14} />
              <span>+4.7% signups</span>
            </div>
          </div>

          <div className="bg-neutral-900/60 border border-neutral-800 rounded-2xl p-6">
            <div className="flex justify-between items-start mb-4">
              <span className="text-gray-text text-sm font-semibold uppercase tracking-wider">
                Active Traders
              </span>
              <Store className="text-amber-400" size={20} />
            </div>
            <p className="text-3xl font-extrabold font-['Montserrat'] text-white">186</p>
            <div className="flex items-center gap-1 mt-2 text-amber-400 text-xs font-semibold">
              <CheckCircle size={14} />
              <span>12 pending approval</span>
            </div>
          </div>

          <div className="bg-neutral-900/60 border border-neutral-800 rounded-2xl p-6">
            <div className="flex justify-between items-start mb-4">
              <span className="text-gray-text text-sm font-semibold uppercase tracking-wider">
                System Health
              </span>
              <Activity className="text-emerald-400" size={20} />
            </div>
            <p className="text-3xl font-extrabold font-['Montserrat'] text-emerald-400">99.98%</p>
            <div className="flex items-center gap-1 mt-2 text-emerald-400 text-xs font-semibold">
              <span>All nodes operational</span>
            </div>
          </div>
        </section>

        {/* User Management Section */}
        <section className="bg-neutral-900/40 border border-neutral-800 rounded-3xl p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold font-['Montserrat']">User Registration Directory</h3>
            <span className="px-3 py-1 bg-neutral-800 text-gray-text rounded-full text-xs font-semibold">
              Live Platform Users
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-neutral-800 text-gray-text text-xs uppercase font-semibold">
                  <th className="py-4 px-2">Name / Email</th>
                  <th className="py-4 px-2">Role</th>
                  <th className="py-4 px-2">Joined Date</th>
                  <th className="py-4 px-2">Status</th>
                  <th className="py-4 px-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800/50 text-sm">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-neutral-900/20 transition-all">
                    <td className="py-4 px-2">
                      <div>
                        <p className="font-semibold text-white">{u.name}</p>
                        <p className="text-xs text-gray-text">{u.email}</p>
                      </div>
                    </td>
                    <td className="py-4 px-2">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                          u.role === "admin"
                            ? "bg-red-500/10 text-red-500 border border-red-500/20"
                            : u.role === "trader"
                            ? "bg-amber-500/10 text-amber-500 border border-amber-500/20"
                            : "bg-sky-500/10 text-sky-500 border border-sky-500/20"
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className="py-4 px-2 text-gray-text">{u.createdAt}</td>
                    <td className="py-4 px-2">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                          u.status === "active"
                            ? "bg-emerald-500/10 text-emerald-400"
                            : "bg-red-500/10 text-red-400"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            u.status === "active" ? "bg-emerald-400" : "bg-red-400"
                          }`}
                        />
                        {u.status}
                      </span>
                    </td>
                    <td className="py-4 px-2 text-right">
                      <div className="flex justify-end gap-2">
                        {u.role === "user" && (
                          <button
                            onClick={() => promoteToTrader(u.id)}
                            className="p-1.5 bg-neutral-800 hover:bg-amber-500/20 text-gray-text hover:text-amber-500 rounded-lg transition-all"
                            title="Promote to Trader"
                          >
                            <UserCheck size={16} />
                          </button>
                        )}
                        <button
                          onClick={() => toggleUserStatus(u.id)}
                          className={`p-1.5 bg-neutral-800 rounded-lg transition-all ${
                            u.status === "active"
                              ? "hover:bg-red-500/20 text-gray-text hover:text-red-400"
                              : "hover:bg-emerald-500/20 text-gray-text hover:text-emerald-400"
                          }`}
                          title={u.status === "active" ? "Suspend Account" : "Activate Account"}
                        >
                          {u.status === "active" ? <Ban size={16} /> : <CheckCircle size={16} />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}
