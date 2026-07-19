import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { Trash2, Plus, Calendar, Tag, Percent, ShoppingBag, Eye, ChevronDown, X } from "lucide-react";
import { api } from "../../lib/axios";
import { Toggle } from "../../components/ui";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { useCoupons } from "../../hooks/queries/couponsQuery";
import type { Coupon } from "../../hooks/queries/couponsQuery";
import { useCategories } from "../../hooks/queries/categoriesQuery";
import { useProducts } from "../../hooks/queries/productsQuery";
import { handleApiError } from '../../lib/utils';
import { useRetailCategories } from "../../hooks/useRetailCategories";
import { useRetailProducts } from "../../hooks/useRetailProducts";

interface Category {
  id: string;
  name: string;
}

interface Product {
  id: string;
  name: string;
}

function SearchableSelect({
  label,
  placeholder,
  options,
  value,
  onChange,
  emptyLabel,
}: {
  label: string;
  placeholder: string;
  options: { id: string; name: string }[];
  value: string;
  onChange: (value: string) => void;
  emptyLabel: string;
}) {
  const { t } = useTranslation("traderCoupons");
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Sync search query when value changes from outside (e.g. form reset)
  useEffect(() => {
    if (!value) {
      setSearchQuery("");
    } else {
      const selected = options.find((opt) => opt.id === value);
      if (selected) {
        setSearchQuery(selected.name);
      }
    }
  }, [value, options]);

  const filteredOptions = searchQuery
    ? options.filter((opt) =>
      opt.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
    : options;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setIsOpen(true);
    if (!e.target.value) {
      onChange("");
    }
  };

  const handleSelectOption = (id: string, name: string) => {
    onChange(id);
    setSearchQuery(name);
    setIsOpen(false);
  };

  const handleClear = () => {
    onChange("");
    setSearchQuery("");
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <label className="block text-sm font-semibold text-gray-text mb-1">
        {label}
      </label>
      <div className="relative flex items-center">
        <input
          type="text"
          value={searchQuery}
          onChange={handleInputChange}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          className="w-full h-11 pl-4 pr-10 border border-stroke rounded-2xl font-['Montserrat'] text-sm focus:outline-none focus:border-secondary"
        />
        {searchQuery ? (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 text-gray-text hover:text-foreground focus:outline-none"
          >
            <X className="h-4 w-4" />
          </button>
        ) : (
          <ChevronDown className="absolute right-3 h-4 w-4 text-gray-400 pointer-events-none" />
        )}
      </div>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
          <div className="absolute left-0 right-0 top-[calc(100%+4px)] z-20 flex max-h-60 flex-col overflow-y-auto rounded-2xl bg-white border border-stroke shadow-lg">
            <button
              type="button"
              onClick={() => handleSelectOption("", "")}
              className="w-full text-left px-4 py-2.5 font-['Montserrat'] text-sm font-medium hover:bg-gray-light border-b border-stroke text-gray-text"
            >
              {emptyLabel}
            </button>
            {filteredOptions.length > 0 ? (
              filteredOptions.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => handleSelectOption(opt.id, opt.name)}
                  className={`w-full text-left px-4 py-2.5 font-['Montserrat'] text-sm hover:bg-primary/10 transition-colors ${value === opt.id ? "bg-primary/20 font-semibold text-foreground" : "text-foreground"
                    }`}
                >
                  {opt.name}
                </button>
              ))
            ) : (
              <div className="px-4 py-3 text-center text-sm text-gray-text">
                {t("noMatchesFound")}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default function TraderCouponsPage() {
  const { t } = useTranslation("traderCoupons");
  const queryClient = useQueryClient();
  const { data: coupons = [], isLoading: isLoadingCoupons } = useCoupons();
  const { data: categories = [], isLoading: isLoadingCategories } = useCategories();
  const { data: productsData, isLoading: isLoadingProducts } = useProducts({ limit: 100 });
  const { data: retailCategoriesData, isLoading: isLoadingRetailCategories } = useRetailCategories();
  const { data: retailProductsData, isLoading: isLoadingRetailProducts } = useRetailProducts({ limit: 100 });

  const products = productsData?.products || [];
  const retailProducts = retailProductsData?.data?.products || [];
  const retailCategories = retailCategoriesData?.data || [];

  const categoryOptions = [
    ...categories.map(c => ({ id: c.id, name: c.name })),
    ...retailCategories.map(c => ({ id: `retail-${c.id}`, name: `${c.name} (${t("retail", "Retail")})` }))
  ];

  const productOptions = [
    ...products.map(p => ({ id: p.id, name: p.name })),
    ...retailProducts.map(p => ({ id: `retail-${p.id}`, name: `${p.name} (${t("retail", "Retail")})` }))
  ];

  const loading = isLoadingCoupons || isLoadingCategories || isLoadingProducts || isLoadingRetailCategories || isLoadingRetailProducts;

  // Form State
  const [code, setCode] = useState("");
  const [discount, setDiscount] = useState(10);
  const [validUntil, setValidUntil] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedProduct, setSelectedProduct] = useState("");
  const [usageLimit, setUsageLimit] = useState("");
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCouponForModal, setSelectedCouponForModal] = useState<Coupon | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // TanStack Query Mutations
  const createCouponMutation = useMutation({
    mutationFn: async (payload: any) => {
      const { data } = await api.post("/coupons", payload);
      return data;
    },
    onSuccess: () => {
      toast.success(t("couponCreatedSuccess"));
      // Reset form
      setCode("");
      setDiscount(10);
      setValidUntil("");
      setSelectedCategory("");
      setSelectedProduct("");
      setUsageLimit("");
      setIsCreateModalOpen(false);
      queryClient.invalidateQueries({ queryKey: ['coupons'] });
    },
    onError: (error) => {
      handleApiError(error, t("failedToCreateCoupon"));
    }
  });

  const toggleCouponMutation = useMutation({
    mutationFn: async ({ id, isActive }: { id: string; isActive: boolean }) => {
      const { data } = await api.patch(`/coupons/${id}`, { isActive });
      return data;
    },
    onSuccess: (_, variables) => {
      toast.success(variables.isActive ? t("couponActivatedSuccess") : t("couponDeactivatedSuccess"));
      queryClient.invalidateQueries({ queryKey: ['coupons'] });
    },
    onError: (error) => {
      handleApiError(error, t("failedToUpdateCouponStatus"));
    }
  });

  const handleCreateCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) {
      toast.error(t("couponCodeRequired"));
      return;
    }
    if (discount <= 0 || discount > 100) {
      toast.error(t("discountRangeError"));
      return;
    }
    if (!validUntil) {
      toast.error(t("expirationDateRequired"));
      return;
    }

    const isRetailCategory = selectedCategory.startsWith("retail-");
    const isRetailProduct = selectedProduct.startsWith("retail-");

    const payload = {
      code: code.trim().toUpperCase(),
      discount: Number(discount),
      validUntil: new Date(validUntil).toISOString(),
      categoryId: isRetailCategory ? null : (selectedCategory || null),
      productId: isRetailProduct ? null : (selectedProduct || null),
      retailCategoryId: isRetailCategory ? Number(selectedCategory.replace("retail-", "")) : null,
      retailProductId: isRetailProduct ? Number(selectedProduct.replace("retail-", "")) : null,
      usageLimit: usageLimit ? Number(usageLimit) : null,
    };

    createCouponMutation.mutate(payload);
  };

  const handleToggleCouponActive = (id: string, currentStatus: boolean) => {
    toggleCouponMutation.mutate({ id, isActive: !currentStatus });
  };

  return (
    <div className="space-y-6">
      {/* ── Heading / Create Coupon Trigger ── */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-['Montserrat'] text-2xl font-bold text-foreground">{t("traderCouponsTitle")}</h1>
          <p className="text-sm text-gray-text">{t("traderCouponsSubtitle")}</p>
        </div>
        <button
          type="button"
          onClick={() => setIsCreateModalOpen(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-secondary text-secondary-foreground hover:bg-primary hover:text-primary-foreground font-['Montserrat'] text-sm font-bold rounded-2xl transition cursor-pointer shadow-sm"
        >
          <Plus className="h-5 w-5" style={{ strokeWidth: 3 }} />
          <span>{t("createCoupon")}</span>
        </button>
      </div>

      {/* ── Stat cards ── */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-[24px] bg-white border border-stroke p-6 shadow-sm flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/25 text-foreground">
            <Percent className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-text">{t("activeCoupons")}</p>
            <p className="font-['Montserrat'] text-2xl font-bold text-foreground">
              {coupons.filter(c => c.isActive && new Date(c.validUntil) > new Date()).length}
            </p>
          </div>
        </div>
        <div className="rounded-[24px] bg-white border border-stroke p-6 shadow-sm flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/25 text-foreground">
            <Tag className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-text">{t("totalCoupons")}</p>
            <p className="font-['Montserrat'] text-2xl font-bold text-foreground">{coupons.length}</p>
          </div>
        </div>
        <div className="rounded-[24px] bg-white border border-stroke p-6 shadow-sm flex items-center gap-4 sm:col-span-2 lg:col-span-1">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-100 text-red-600">
            <Calendar className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-text">{t("expiredCoupons")}</p>
            <p className="font-['Montserrat'] text-2xl font-bold text-foreground">
              {coupons.filter(c => new Date(c.validUntil) <= new Date()).length}
            </p>
          </div>
        </div>
      </div>

      {/* ── Coupons List Table ── */}
      <div className="rounded-3xl border border-stroke bg-white p-6 shadow-sm w-full">
        <h2 className="font-['Montserrat'] text-lg font-bold text-foreground mb-4">
          {t("couponManagement")}
        </h2>

        {loading ? (
          <div className="py-12 text-center text-gray-text font-medium font-['Montserrat']">
            {t("loadingCoupons")}
          </div>
        ) : coupons.length === 0 ? (
          <div className="py-12 text-center text-gray-text font-medium font-['Montserrat']">
            {t("noCouponsMessage")}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-secondary border-b border-stroke text-xs font-bold text-primary uppercase tracking-wider">
                  <th className="py-3 px-4">{t("colCode")}</th>
                  <th className="py-3 px-4">{t("colDiscount")}</th>
                  <th className="py-3 px-4">{t("colRestrictions")}</th>
                  <th className="py-3 px-4">{t("colUsesLimit")}</th>
                  <th className="py-3 px-4">{t("colExpiry")}</th>
                  <th className="py-3 px-4">{t("colStatus")}</th>
                  <th className="py-3 px-4">{t("colUsedBy")}</th>
                  <th className="py-3 px-4 text-right">{t("colActions")}</th>
                </tr>
              </thead>
              <tbody>
                {coupons.map((coupon) => {
                  const isExpired = new Date(coupon.validUntil) <= new Date();
                  return (
                    <tr key={coupon.id} className="border-b border-stroke text-sm text-foreground hover:bg-background transition">
                      <td className="py-4 pr-4 font-['Montserrat'] font-bold text-foreground">
                        {coupon.code}
                      </td>
                      <td className="py-4 px-4 font-['Montserrat'] font-semibold">
                        {coupon.discount}% {t("off")}
                      </td>
                      <td className="py-4 px-4">
                        {coupon.product ? (
                          <span className="inline-flex items-center gap-1 rounded-xl bg-blue-50 border border-blue-200 px-2 py-0.5 text-xs text-blue-600 font-medium">
                            <ShoppingBag className="h-3 w-3" />
                            {coupon.product.name}
                          </span>
                        ) : coupon.retailProduct ? (
                          <span className="inline-flex items-center gap-1 rounded-xl bg-blue-50 border border-blue-200 px-2 py-0.5 text-xs text-blue-600 font-medium">
                            <ShoppingBag className="h-3 w-3" />
                            {coupon.retailProduct.name} (Retail)
                          </span>
                        ) : coupon.category ? (
                          <span className="inline-flex items-center gap-1 rounded-xl bg-purple-50 border border-purple-200 px-2 py-0.5 text-xs text-purple-600 font-medium">
                            <Tag className="h-3 w-3" />
                            {coupon.category.name}
                          </span>
                        ) : coupon.retailCategory ? (
                          <span className="inline-flex items-center gap-1 rounded-xl bg-purple-50 border border-purple-200 px-2 py-0.5 text-xs text-purple-600 font-medium">
                            <Tag className="h-3 w-3" />
                            {coupon.retailCategory.name} (Retail)
                          </span>
                        ) : (
                          <span className="text-gray-text text-xs">{t("globalCoupon")}</span>
                        )}
                      </td>
                      <td className="py-4 px-4 font-['Montserrat'] text-xs font-semibold text-gray-text">
                        {coupon.usedCount} / {coupon.usageLimit !== null ? coupon.usageLimit : "∞"}
                      </td>
                      <td className="py-4 px-4 font-['Montserrat'] text-xs text-gray-text">
                        {new Date(coupon.validUntil).toLocaleDateString()}
                      </td>
                      <td className="py-4 px-4">
                        {!coupon.isActive ? (
                          <span className="inline-flex rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-semibold text-gray-600">
                            {t("statusInactive")}
                          </span>
                        ) : isExpired ? (
                          <span className="inline-flex rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-semibold text-red-800">
                            {t("statusExpired")}
                          </span>
                        ) : coupon.usageLimit !== null && coupon.usedCount >= coupon.usageLimit ? (
                          <span className="inline-flex rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-800">
                            {t("statusLimitReached")}
                          </span>
                        ) : (
                          <span className="inline-flex rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-semibold text-green-800">
                            {t("statusActive")}
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-4">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedCouponForModal(coupon);
                            setIsModalOpen(true);
                          }}
                          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-primary/10 text-secondary hover:bg-primary/20 transition text-xs font-semibold cursor-pointer"
                          aria-label={t("viewUsages")}
                          title={t("viewUsages")}
                        >
                          <Eye className="h-4 w-4" />
                          <span>{t("viewUsages")}</span>
                        </button>
                      </td>
                      <td className="py-4 pl-4 text-right">
                        <div className="flex items-center justify-end gap-3">
                          {/* Toggle switch for active status */}
                          <Toggle
                            checked={coupon.isActive}
                            onChange={() => handleToggleCouponActive(coupon.id, coupon.isActive)}
                            size="md"
                            variant="success"
                            title={coupon.isActive ? t("deactivateCoupon") : t("activateCoupon")}
                          />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── Coupon Usages Modal ── */}
      {isModalOpen && selectedCouponForModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => {
              setIsModalOpen(false);
              setSelectedCouponForModal(null);
            }}
          />
          <div className="relative w-full max-w-2xl rounded-3xl bg-white border border-stroke p-6 shadow-xl z-10 flex flex-col max-h-[80vh] overflow-hidden">
            <div className="flex items-center justify-between pb-4 border-b border-stroke mb-4">
              <div>
                <h3 className="font-['Montserrat'] text-lg font-bold text-foreground">
                  {t("couponUsages")}: <span className="text-secondary">{selectedCouponForModal.code}</span>
                </h3>
                <p className="text-xs font-semibold text-gray-text mt-0.5">
                  {t("discountLabel")}: {selectedCouponForModal.discount}% {t("off")} &middot; {t("limitLabel")}: {selectedCouponForModal.usageLimit !== null ? selectedCouponForModal.usageLimit : t("unlimited")}
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsModalOpen(false);
                  setSelectedCouponForModal(null);
                }}
                className="p-2 hover:bg-gray-light rounded-full text-gray-text hover:text-foreground transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto custom-scrollbar">
              {!selectedCouponForModal.usages || selectedCouponForModal.usages.length === 0 ? (
                <div className="py-12 text-center text-gray-text font-medium font-['Montserrat']">
                  {t("noUsagesYet")}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-secondary border-b border-stroke text-xs font-bold text-primary uppercase tracking-wider">
                        <th className="py-3 px-4">{t("colUserName")}</th>
                        <th className="py-3 px-4">{t("colEmail")}</th>
                        <th className="py-3 px-4">{t("colPhone")}</th>
                        <th className="py-3 px-4 text-right">{t("colUsedAt")}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedCouponForModal.usages.map((usage) => (
                        <tr key={usage.id} className="border-b border-stroke text-sm text-foreground hover:bg-background transition">
                          <td className="py-3 pr-4 font-['Montserrat'] font-semibold text-foreground">
                            {usage.user.name || t("na")}
                          </td>
                          <td className="py-3 px-4 font-['Montserrat'] text-gray-text">
                            {usage.user.email}
                          </td>
                          <td className="py-3 px-4 font-['Montserrat'] text-gray-text">
                            {usage.user.phone || t("na")}
                          </td>
                          <td className="py-3 pl-4 text-right font-['Montserrat'] text-xs text-gray-text">
                            {new Date(usage.usedAt).toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── Create Coupon Modal ── */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-lg rounded-3xl border border-stroke bg-white p-6 shadow-xl animate-scale-up max-h-[90vh] overflow-y-auto animate-duration-200">
            <button
              type="button"
              onClick={() => setIsCreateModalOpen(false)}
              className="absolute top-4 right-4 text-gray-text hover:text-foreground transition cursor-pointer"
              aria-label="Close modal"
            >
              <X className="h-6 w-6" />
            </button>

            <h2 className="font-['Montserrat'] text-xl font-bold text-foreground mb-6 flex items-center gap-2">
              <Plus className="h-6 w-6 text-primary" style={{ strokeWidth: 3 }} />
              {t("createNewCoupon")}
            </h2>

            <form onSubmit={handleCreateCoupon} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-text mb-1">{t("couponCodeLabel")}</label>
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder={t("couponCodePlaceholder")}
                  className="w-full h-11 px-4 border border-stroke rounded-2xl font-['Montserrat'] text-sm focus:outline-none focus:border-secondary"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-text mb-1">{t("discountPercentageLabel")}</label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={discount}
                  onChange={(e) => setDiscount(Number(e.target.value))}
                  className="w-full h-11 px-4 border border-stroke rounded-2xl font-['Montserrat'] text-sm focus:outline-none focus:border-secondary"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-text mb-1">{t("validUntilLabel")}</label>
                <input
                  type="datetime-local"
                  value={validUntil}
                  onChange={(e) => setValidUntil(e.target.value)}
                  className="w-full h-11 px-4 border border-stroke rounded-2xl font-['Montserrat'] text-sm focus:outline-none focus:border-secondary"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-text mb-1">{t("usageLimitLabel")}</label>
                <input
                  type="number"
                  min="1"
                  value={usageLimit}
                  onChange={(e) => setUsageLimit(e.target.value)}
                  placeholder={t("usageLimitPlaceholder")}
                  className="w-full h-11 px-4 border border-stroke rounded-2xl font-['Montserrat'] text-sm focus:outline-none focus:border-secondary"
                />
              </div>

              <SearchableSelect
                label={t("categoryRestrictionLabel")}
                placeholder={t("searchCategoryPlaceholder")}
                options={categoryOptions}
                value={selectedCategory}
                onChange={setSelectedCategory}
                emptyLabel={t("noRestrictionLabel")}
              />

              <SearchableSelect
                label={t("productRestrictionLabel")}
                placeholder={t("searchProductPlaceholder")}
                options={productOptions}
                value={selectedProduct}
                onChange={setSelectedProduct}
                emptyLabel={t("noRestrictionLabel")}
              />

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="flex-1 h-12 border border-stroke text-foreground hover:bg-background font-['Montserrat'] text-sm font-bold rounded-2xl transition cursor-pointer"
                >
                  {t("cancel")}
                </button>
                <button
                  type="submit"
                  disabled={createCouponMutation.isPending}
                  className="flex-1 h-12 bg-secondary text-secondary-foreground hover:bg-primary hover:text-primary-foreground font-['Montserrat'] text-sm font-bold rounded-2xl transition disabled:opacity-50 cursor-pointer"
                >
                  {createCouponMutation.isPending ? t("creating") : t("createCoupon")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
