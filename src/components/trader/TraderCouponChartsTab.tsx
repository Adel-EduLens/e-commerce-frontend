import React from "react";
import { useTranslation } from "react-i18next";
import {
  ShoppingBag, Percent, Tag, Calendar, TrendingUp, Layers
} from "lucide-react";
import { useCouponAnalytics } from "../../hooks/queries/couponsQuery";

function CouponUsageTrendChart({ series }: { series: { monthKey: string; defaultMonth: string; usages: number }[] }) {
  const { t } = useTranslation("traderCoupons");
  const width = 700;
  const height = 220;
  const pad = { top: 20, right: 24, bottom: 36, left: 24 };

  const maxVal = Math.max(...series.map((s) => s.usages), 10);
  const cw = width - pad.left - pad.right;
  const ch = height - pad.top - pad.bottom;

  const pts = series.map((d, i) => ({
    ...d,
    x: pad.left + (cw / Math.max(series.length - 1, 1)) * i,
    y: pad.top + ch - (d.usages / maxVal) * ch,
  }));

  const line = pts.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
  const area = `M ${pts[0].x} ${height - pad.bottom} ${pts.map((p) => `L ${p.x} ${p.y}`).join(" ")} L ${pts[pts.length - 1].x} ${height - pad.bottom} Z`;

  return (
    <div className="space-y-3">
      <div className="relative">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="h-[220px] w-full overflow-visible rounded-2xl bg-background border border-stroke/40"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="couponUsageGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FFAE4C" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#FFAE4C" stopOpacity="0.02" />
            </linearGradient>
          </defs>
          {[0, 1, 2, 3, 4].map((i) => {
            const y = pad.top + (ch / 4) * i;
            return (
              <line key={i} x1={pad.left} x2={width - pad.right} y1={y} y2={y} stroke="var(--stroke)" strokeWidth="1" strokeDasharray="4 4" />
            );
          })}
          <path d={area} fill="url(#couponUsageGradient)" />
          <path d={line} fill="none" stroke="#FFAE4C" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          {pts.map((p, i) => (
            <g key={i} className="group cursor-pointer">
              <circle cx={p.x} cy={p.y} r="8" fill="#FFAE4C" fillOpacity="0.25" />
              <circle cx={p.x} cy={p.y} r="4" fill="#FFAE4C" stroke="white" strokeWidth="2" />
              <title>{`${t(p.monthKey, p.defaultMonth)}: ${p.usages} ${t("usagesCount")}`}</title>
            </g>
          ))}
        </svg>
        <div className="mt-3 grid grid-cols-6 gap-2 font-['Montserrat'] text-xs font-semibold text-gray-text">
          {series.map((d, i) => (
            <span key={i} className="text-center">{t(d.monthKey, d.defaultMonth)}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

function DiscountRangesBreakdown({ ranges, total }: { ranges: { range1_15: number; range16_30: number; range31_50: number; range51Plus: number }; total: number }) {
  const { t } = useTranslation("traderCoupons");
  const items = [
    { label: t("range1_15"), count: ranges.range1_15, color: "bg-blue-500" },
    { label: t("range16_30"), count: ranges.range16_30, color: "bg-emerald-500" },
    { label: t("range31_50"), count: ranges.range31_50, color: "bg-amber-500" },
    { label: t("range51Plus"), count: ranges.range51Plus, color: "bg-rose-500" },
  ];

  return (
    <div className="space-y-4">
      {items.map((item, idx) => {
        const pct = total > 0 ? Math.round((item.count / total) * 100) : 0;
        return (
          <div key={idx} className="space-y-1.5">
            <div className="flex justify-between text-xs font-semibold font-['Montserrat']">
              <span className="text-gray-text">{item.label}</span>
              <span className="text-foreground">{item.count} ({pct}%)</span>
            </div>
            <div className="h-2.5 w-full bg-gray-100 rounded-full overflow-hidden">
              <div className={`h-full ${item.color} rounded-full transition-all duration-500`} style={{ width: `${pct}%` }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

function ScopeBreakdownCard({ scope }: { scope: { global: number; category: number; product: number } }) {
  const { t } = useTranslation("traderCoupons");
  const total = scope.global + scope.category + scope.product;

  const items = [
    { label: t("scopeGlobal"), count: scope.global, text: "text-purple-600", bgLight: "bg-purple-50" },
    { label: t("scopeCategory"), count: scope.category, text: "text-indigo-600", bgLight: "bg-indigo-50" },
    { label: t("scopeProduct"), count: scope.product, text: "text-sky-600", bgLight: "bg-sky-50" },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {items.map((item, idx) => {
        const pct = total > 0 ? Math.round((item.count / total) * 100) : 0;
        return (
          <div key={idx} className={`p-4 rounded-2xl border border-stroke ${item.bgLight} flex flex-col items-center justify-center text-center space-y-1`}>
            <span className={`font-['Montserrat'] text-2xl font-bold ${item.text}`}>{item.count}</span>
            <span className="text-xs font-semibold text-gray-text">{item.label}</span>
            <span className="text-[11px] font-medium text-gray-400">{pct}%</span>
          </div>
        );
      })}
    </div>
  );
}

export default function TraderCouponChartsTab() {
  const { t } = useTranslation("traderCoupons");
  const { data: analytics, isLoading: isLoadingAnalytics } = useCouponAnalytics();

  if (isLoadingAnalytics) {
    return (
      <div className="py-16 text-center text-gray-text font-medium font-['Montserrat']">
        {t("loadingAnalytics")}
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="py-16 text-center text-gray-text font-medium font-['Montserrat']">
        {t("noAnalyticsData")}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Analytics Summary Cards */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-[24px] bg-white border border-stroke p-5 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-text">{t("totalUsages")}</p>
            <p className="font-['Montserrat'] text-2xl font-bold text-foreground mt-1">
              {analytics.summary.totalUsages}
            </p>
          </div>
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-100 text-amber-600">
            <ShoppingBag className="h-5 w-5" />
          </div>
        </div>

        <div className="rounded-[24px] bg-white border border-stroke p-5 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-text">{t("avgDiscountRate")}</p>
            <p className="font-['Montserrat'] text-2xl font-bold text-foreground mt-1">
              {analytics.summary.avgDiscount}%
            </p>
          </div>
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-100 text-blue-600">
            <Percent className="h-5 w-5" />
          </div>
        </div>

        <div className="rounded-[24px] bg-white border border-stroke p-5 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-text">{t("activeCoupons")}</p>
            <p className="font-['Montserrat'] text-2xl font-bold text-foreground mt-1">
              {analytics.summary.activeCoupons} / {analytics.summary.totalCoupons}
            </p>
          </div>
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-green-100 text-green-600">
            <Tag className="h-5 w-5" />
          </div>
        </div>

        <div className="rounded-[24px] bg-white border border-stroke p-5 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-text">{t("inactiveCoupons")}</p>
            <p className="font-['Montserrat'] text-2xl font-bold text-foreground mt-1">
              {analytics.summary.inactiveCoupons + analytics.summary.expiredCoupons}
            </p>
          </div>
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-red-100 text-red-600">
            <Calendar className="h-5 w-5" />
          </div>
        </div>
      </div>

      {/* Usage Trend Chart Panel */}
      <div className="rounded-[24px] border border-stroke bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-['Montserrat'] text-lg font-bold text-foreground flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-amber-500" />
            <span>{t("monthlyUsageTrend")}</span>
          </h2>
        </div>
        <CouponUsageTrendChart series={analytics.monthlyTrend} />
      </div>

      {/* 2-Column Grid: Discount Ranges & Scope Breakdown */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-[24px] border border-stroke bg-white p-6 shadow-sm space-y-4">
          <h2 className="font-['Montserrat'] text-lg font-bold text-foreground flex items-center gap-2">
            <Percent className="h-5 w-5 text-blue-500" />
            <span>{t("discountRanges")}</span>
          </h2>
          <DiscountRangesBreakdown ranges={analytics.discountRanges} total={analytics.summary.totalCoupons} />
        </div>

        <div className="rounded-[24px] border border-stroke bg-white p-6 shadow-sm space-y-4">
          <h2 className="font-['Montserrat'] text-lg font-bold text-foreground flex items-center gap-2">
            <Layers className="h-5 w-5 text-indigo-500" />
            <span>{t("scopeBreakdown")}</span>
          </h2>
          <ScopeBreakdownCard scope={analytics.scopeBreakdown} />
        </div>
      </div>

      {/* Top Performing Coupons Ranking */}
      <div className="rounded-[24px] border border-stroke bg-white p-6 shadow-sm">
        <h2 className="font-['Montserrat'] text-lg font-bold text-foreground mb-4">
          {t("topPerformingCoupons")}
        </h2>

        {analytics.topCoupons.length === 0 ? (
          <div className="py-8 text-center text-gray-text font-medium font-['Montserrat']">
            {t("noCouponsMessage")}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse font-['Montserrat']">
              <thead>
                <tr className="bg-secondary border-b border-stroke text-xs font-bold text-primary uppercase tracking-wider">
                  <th className="py-3 px-4">{t("colCode")}</th>
                  <th className="py-3 px-4">{t("colDiscount")}</th>
                  <th className="py-3 px-4">{t("colRestrictions")}</th>
                  <th className="py-3 px-4">{t("totalUsages")}</th>
                  <th className="py-3 px-4">{t("colStatus")}</th>
                </tr>
              </thead>
              <tbody>
                {analytics.topCoupons.map((coupon, idx) => (
                  <tr key={coupon.id} className="border-b border-stroke text-sm hover:bg-background transition">
                    <td className="py-4 pr-4 font-bold text-foreground flex items-center gap-2">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/20 text-xs text-foreground font-bold">
                        {idx + 1}
                      </span>
                      <span>{coupon.code}</span>
                    </td>
                    <td className="py-4 px-4 font-semibold text-foreground">
                      {coupon.discount}% {t("off")}
                    </td>
                    <td className="py-4 px-4">
                      {coupon.restriction ? (
                        <span className="inline-flex items-center gap-1 rounded-xl bg-blue-50 border border-blue-200 px-2 py-0.5 text-xs text-blue-600 font-medium">
                          {coupon.restriction}
                        </span>
                      ) : (
                        <span className="text-gray-text text-xs">{t("globalCoupon")}</span>
                      )}
                    </td>
                    <td className="py-4 px-4 font-bold text-primary">
                      {coupon.usedCount} {coupon.usageLimit !== null ? `/ ${coupon.usageLimit}` : ""}
                    </td>
                    <td className="py-4 px-4">
                      {coupon.isActive ? (
                        <span className="inline-flex rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-semibold text-green-800">
                          {t("statusActive")}
                        </span>
                      ) : (
                        <span className="inline-flex rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-semibold text-gray-600">
                          {t("statusInactive")}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
