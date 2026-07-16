import { api } from "../lib/axios";

export const influencerService = {
  login: (email: string, password: string) =>
    api.post("/influencer/auth/login", { email, password }),

  getMe: () => api.get("/influencer/auth/me"),

  getDashboard: () => api.get("/influencer/dashboard"),

  getCouponUsers: () => api.get("/influencer/coupon-users"),

  getCommissions: () => api.get("/influencer/commissions"),

  getSettlements: () => api.get("/influencer/settlements"),
};
