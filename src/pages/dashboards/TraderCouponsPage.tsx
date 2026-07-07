import React, { useEffect, useState } from "react";
import { AxiosError } from "axios";
import { toast } from "sonner";
import { Trash2, Plus, Calendar, Tag, Percent, ShoppingBag, Eye } from "lucide-react";
import { api } from "../../lib/axios";
import { useQueryClient } from "@tanstack/react-query";
import { useCoupons } from "../../hooks/queries/couponsQuery";
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
  const [isSubmitting, setIsSubmitting] = useState(false);


  const handleCreateCoupon = async (e: React.FormEvent) => {
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

    try {
      setIsSubmitting(true);
      const payload = {
        code: code.trim().toUpperCase(),
        discount: Number(discount),
        validUntil: new Date(validUntil).toISOString(),
        categoryId: selectedCategory || null,
        productId: selectedProduct || null,
      };

      await api.post("/coupons", payload);
      toast.success("Coupon created successfully!");
      
      // Reset form
      setCode("");
      setDiscount(10);
      setValidUntil("");
      setSelectedCategory("");
      setSelectedProduct("");
      
      queryClient.invalidateQueries({ queryKey: ['coupons'] });
    } catch (error) {
      handleApiError(error, "Failed to create coupon");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteCoupon = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this coupon?")) return;

    try {
      await api.delete(`/coupons/${id}`);
      toast.success("Coupon deleted successfully");
      queryClient.invalidateQueries({ queryKey: ['coupons'] });
    } catch (error) {
      toast.error("Failed to delete coupon");
    }
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
              {coupons.filter(c => new Date(c.validUntil) > new Date()).length}
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
              <label className="block text-sm font-semibold text-gray-text mb-1">Category Restriction (Optional)</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full h-11 px-4 border border-stroke rounded-2xl font-['Montserrat'] text-sm focus:outline-none focus:border-secondary"
              >
                <option value="">No Restriction (Applies to all)</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-text mb-1">Product Restriction (Optional)</label>
              <select
                value={selectedProduct}
                onChange={(e) => setSelectedProduct(e.target.value)}
                className="w-full h-11 px-4 border border-stroke rounded-2xl font-['Montserrat'] text-sm focus:outline-none focus:border-secondary"
              >
                <option value="">No Restriction (Applies to all)</option>
                {products.map((prod) => (
                  <option key={prod.id} value={prod.id}>
                    {prod.name}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-12 bg-secondary text-white hover:bg-black font-['Montserrat'] text-sm font-bold rounded-2xl transition disabled:opacity-50"
            >
              {isSubmitting ? "Creating..." : "Create Coupon"}
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
                        <td className="py-4 px-4 font-['Montserrat'] text-xs text-gray-text">
                          {new Date(coupon.validUntil).toLocaleDateString()}
                        </td>
                        <td className="py-4 px-4">
                          {isExpired ? (
                            <span className="inline-flex rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-semibold text-red-800">
                              Expired
                            </span>
                          ) : (
                            <span className="inline-flex rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-semibold text-green-800">
                              Active
                            </span>
                          )}
                        </td>
                        <td className="py-4 pl-4 text-right">
                          <button
                            type="button"
                            onClick={() => handleDeleteCoupon(coupon.id)}
                            className="text-red-500 hover:text-red-700 transition"
                            aria-label="Delete coupon"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
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
    </div>
  );
}
