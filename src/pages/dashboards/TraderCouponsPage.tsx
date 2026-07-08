import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { Trash2, Plus, Calendar, Tag, Percent, ShoppingBag, Eye, ChevronDown, X } from "lucide-react";
import { api } from "../../lib/axios";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { useCoupons } from "../../hooks/queries/couponsQuery";
import type { Coupon } from "../../hooks/queries/couponsQuery";
import { useCategories } from "../../hooks/queries/categoriesQuery";
import { useProducts } from "../../hooks/queries/productsQuery";
import { handleApiError } from '../../lib/utils';

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
            className="absolute right-3 text-gray-400 hover:text-gray-600 focus:outline-none"
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
              className="w-full text-left px-4 py-2.5 font-['Montserrat'] text-sm font-medium hover:bg-gray-50 border-b border-[#F3F4F6] text-gray-text"
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
                No matches found
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default function TraderCouponsPage() {
  const queryClient = useQueryClient();
  const { data: coupons = [], isLoading: isLoadingCoupons } = useCoupons();
  const { data: categories = [], isLoading: isLoadingCategories } = useCategories();
  const { data: productsData, isLoading: isLoadingProducts } = useProducts({ limit: 100 });
  const products = productsData?.products || [];
  const loading = isLoadingCoupons || isLoadingCategories || isLoadingProducts;

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

  // TanStack Query Mutations
  const createCouponMutation = useMutation({
    mutationFn: async (payload: any) => {
      const { data } = await api.post("/coupons", payload);
      return data;
    },
    onSuccess: () => {
      toast.success("Coupon created successfully!");
      // Reset form
      setCode("");
      setDiscount(10);
      setValidUntil("");
      setSelectedCategory("");
      setSelectedProduct("");
      setUsageLimit("");
      queryClient.invalidateQueries({ queryKey: ['coupons'] });
    },
    onError: (error) => {
      handleApiError(error, "Failed to create coupon");
    }
  });

  const toggleCouponMutation = useMutation({
    mutationFn: async ({ id, isActive }: { id: string; isActive: boolean }) => {
      const { data } = await api.patch(`/coupons/${id}`, { isActive });
      return data;
    },
    onSuccess: (_, variables) => {
      toast.success(`Coupon ${variables.isActive ? "activated" : "deactivated"} successfully`);
      queryClient.invalidateQueries({ queryKey: ['coupons'] });
    },
    onError: (error) => {
      handleApiError(error, "Failed to update coupon status");
    }
  });

  const handleCreateCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) {
      toast.error("Coupon code is required");
      return;
    }
    if (discount <= 0 || discount > 100) {
      toast.error("Discount percentage must be between 1 and 100");
      return;
    }
    if (!validUntil) {
      toast.error("Expiration date is required");
      return;
    }

    const payload = {
      code: code.trim().toUpperCase(),
      discount: Number(discount),
      validUntil: new Date(validUntil).toISOString(),
      categoryId: selectedCategory || null,
      productId: selectedProduct || null,
      usageLimit: usageLimit ? Number(usageLimit) : null,
    };

    createCouponMutation.mutate(payload);
  };

  const handleToggleCouponActive = (id: string, currentStatus: boolean) => {
    toggleCouponMutation.mutate({ id, isActive: !currentStatus });
  };

  return (
    <div className="space-y-6">
      {/* ── Heading / Stat cards ── */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-[24px] bg-white border border-stroke p-6 shadow-sm flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/25 text-foreground">
            <Percent className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-text">Active Coupons</p>
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
            <p className="text-sm font-semibold text-gray-text">Total Coupons</p>
            <p className="font-['Montserrat'] text-2xl font-bold text-foreground">{coupons.length}</p>
          </div>
        </div>
        <div className="rounded-[24px] bg-white border border-stroke p-6 shadow-sm flex items-center gap-4 sm:col-span-2 lg:col-span-1">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-100 text-red-600">
            <Calendar className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-text">Expired Coupons</p>
            <p className="font-['Montserrat'] text-2xl font-bold text-foreground">
              {coupons.filter(c => new Date(c.validUntil) <= new Date()).length}
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* ── Create Coupon Form ── */}
        <div className="rounded-3xl border border-stroke bg-white p-6 shadow-sm h-fit">
          <h2 className="font-['Montserrat'] text-lg font-bold text-foreground mb-4 flex items-center gap-2">
            <Plus className="h-5 w-5 text-primary" style={{ strokeWidth: 3 }} />
            Create Coupon
          </h2>
          <form onSubmit={handleCreateCoupon} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-text mb-1">Coupon Code</label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="e.g. SUMMER30"
                className="w-full h-11 px-4 border border-stroke rounded-2xl font-['Montserrat'] text-sm focus:outline-none focus:border-secondary"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-text mb-1">Discount (%)</label>
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
              <label className="block text-sm font-semibold text-gray-text mb-1">Valid Until</label>
              <input
                type="datetime-local"
                value={validUntil}
                onChange={(e) => setValidUntil(e.target.value)}
                className="w-full h-11 px-4 border border-stroke rounded-2xl font-['Montserrat'] text-sm focus:outline-none focus:border-secondary"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-text mb-1">Usage Limit (Optional)</label>
              <input
                type="number"
                min="1"
                value={usageLimit}
                onChange={(e) => setUsageLimit(e.target.value)}
                placeholder="e.g. 100 (Blank for unlimited)"
                className="w-full h-11 px-4 border border-stroke rounded-2xl font-['Montserrat'] text-sm focus:outline-none focus:border-secondary"
              />
            </div>

            <SearchableSelect
              label="Category Restriction (Optional)"
              placeholder="Search or select category..."
              options={categories}
              value={selectedCategory}
              onChange={setSelectedCategory}
              emptyLabel="No Restriction (Applies to all)"
            />

            <SearchableSelect
              label="Product Restriction (Optional)"
              placeholder="Search or select product..."
              options={products}
              value={selectedProduct}
              onChange={setSelectedProduct}
              emptyLabel="No Restriction (Applies to all)"
            />

            <button
              type="submit"
              disabled={createCouponMutation.isPending}
              className="w-full h-12 bg-secondary text-white hover:bg-black font-['Montserrat'] text-sm font-bold rounded-2xl transition disabled:opacity-50"
            >
              {createCouponMutation.isPending ? "Creating..." : "Create Coupon"}
            </button>
          </form>
        </div>

        {/* ── Coupons List Table ── */}
        <div className="rounded-3xl border border-stroke bg-white p-6 shadow-sm lg:col-span-2">
          <h2 className="font-['Montserrat'] text-lg font-bold text-foreground mb-4">
            Coupon Management
          </h2>

          {loading ? (
            <div className="py-12 text-center text-gray-text font-medium font-['Montserrat']">
              Loading coupons...
            </div>
          ) : coupons.length === 0 ? (
            <div className="py-12 text-center text-gray-text font-medium font-['Montserrat']">
              No coupons created yet. Use the left form to add your first coupon!
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-stroke text-xs font-bold text-gray-text uppercase tracking-wider">
                    <th className="py-3 pr-4">Code</th>
                    <th className="py-3 px-4">Discount</th>
                    <th className="py-3 px-4">Restrictions</th>
                    <th className="py-3 px-4">Uses / Limit</th>
                    <th className="py-3 px-4">Expiry</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 pl-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {coupons.map((coupon) => {
                    const isExpired = new Date(coupon.validUntil) <= new Date();
                    return (
                      <tr key={coupon.id} className="border-b border-[#F3F4F6] text-sm text-[#1D2939] hover:bg-background transition">
                        <td className="py-4 pr-4 font-['Montserrat'] font-bold text-foreground">
                          {coupon.code}
                        </td>
                        <td className="py-4 px-4 font-['Montserrat'] font-semibold">
                          {coupon.discount}% OFF
                        </td>
                        <td className="py-4 px-4">
                          {coupon.product ? (
                            <span className="inline-flex items-center gap-1 rounded-xl bg-blue-50 border border-blue-200 px-2 py-0.5 text-xs text-blue-600 font-medium">
                              <ShoppingBag className="h-3 w-3" />
                              {coupon.product.name}
                            </span>
                          ) : coupon.category ? (
                            <span className="inline-flex items-center gap-1 rounded-xl bg-purple-50 border border-purple-200 px-2 py-0.5 text-xs text-purple-600 font-medium">
                              <Tag className="h-3 w-3" />
                              {coupon.category.name}
                            </span>
                          ) : (
                            <span className="text-gray-text text-xs">Global Coupon</span>
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
                              Inactive
                            </span>
                          ) : isExpired ? (
                            <span className="inline-flex rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-semibold text-red-800">
                              Expired
                            </span>
                          ) : coupon.usageLimit !== null && coupon.usedCount >= coupon.usageLimit ? (
                            <span className="inline-flex rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-800">
                              Limit Reached
                            </span>
                          ) : (
                            <span className="inline-flex rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-semibold text-green-800">
                              Active
                            </span>
                          )}
                        </td>
                        <td className="py-4 pl-4 text-right">
                          <div className="flex items-center justify-end gap-3">
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedCouponForModal(coupon);
                                setIsModalOpen(true);
                              }}
                              className="text-[#667085] hover:text-primary transition"
                              aria-label="View coupon usages"
                              title="View usages"
                            >
                              <Eye className="h-5 w-5" />
                            </button>
                            {/* Toggle switch for active status */}
                            <button
                              type="button"
                              onClick={() => handleToggleCouponActive(coupon.id, coupon.isActive)}
                              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                                coupon.isActive ? "bg-green-500" : "bg-gray-300"
                              }`}
                              role="switch"
                              aria-checked={coupon.isActive}
                              title={coupon.isActive ? "Deactivate Coupon" : "Activate Coupon"}
                            >
                              <span
                                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                                  coupon.isActive ? "translate-x-5" : "translate-x-0"
                                }`}
                              />
                            </button>
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
                  Coupon Usages: <span className="text-secondary">{selectedCouponForModal.code}</span>
                </h3>
                <p className="text-xs font-semibold text-gray-text mt-0.5">
                  Discount: {selectedCouponForModal.discount}% OFF &middot; Limit: {selectedCouponForModal.usageLimit !== null ? selectedCouponForModal.usageLimit : "Unlimited"}
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsModalOpen(false);
                  setSelectedCouponForModal(null);
                }}
                className="p-2 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-600 transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto custom-scrollbar">
              {!selectedCouponForModal.usages || selectedCouponForModal.usages.length === 0 ? (
                <div className="py-12 text-center text-gray-text font-medium font-['Montserrat']">
                  No users have used this coupon yet.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-stroke text-xs font-bold text-gray-text uppercase tracking-wider">
                        <th className="py-2.5 pr-4">User Name</th>
                        <th className="py-2.5 px-4">Email</th>
                        <th className="py-2.5 px-4">Phone</th>
                        <th className="py-2.5 pl-4 text-right">Used At</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedCouponForModal.usages.map((usage) => (
                        <tr key={usage.id} className="border-b border-[#F3F4F6] text-sm text-[#1D2939] hover:bg-background transition">
                          <td className="py-3 pr-4 font-['Montserrat'] font-semibold text-foreground">
                            {usage.user.name || "N/A"}
                          </td>
                          <td className="py-3 px-4 font-['Montserrat'] text-gray-text">
                            {usage.user.email}
                          </td>
                          <td className="py-3 px-4 font-['Montserrat'] text-gray-text">
                            {usage.user.phone || "N/A"}
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
    </div>
  );
}
