import { api } from "../lib/axios";
import type { RetailProduct, RetailCategory } from "../types/retail";

const API_PREFIX = "/retail-products";

function normalizeProductResponse(response: unknown): RetailProduct | null {
  if (!response) return null;
  const res = response as Record<string, unknown>;
  if (res.product) return res.product as RetailProduct;
  if (res.data) {
    const data = res.data as Record<string, unknown>;
    if (data.product) return data.product as RetailProduct;
    return res.data as RetailProduct;
  }
  return response as RetailProduct;
}

export const retailApi = {
  async getRetailProducts(params: Record<string, string | number | boolean | undefined> = {}) {
    const response = await api.get(`${API_PREFIX}/`, { params });
    return response.data;
  },

  async getRetailProductById(id: string | number) {
    const response = await api.get(`${API_PREFIX}/${id}`);
    return normalizeProductResponse(response.data);
  },



  async getRetailCategories() {
    const response = await api.get(`/retail-category/categories`);
    return response.data;
  },

  async getRetailCategoryById(id: string | number) {
    const response = await api.get(`/retail-category/categories/${id}`);
    return response.data;
  },

  async getRetailCategoryBySlug(slug: string) {
    const response = await api.get(
      `/retail-category/categories/slug/${encodeURIComponent(slug)}`,
    );
    return response.data;
  },

  async createRetailCategory(data: Partial<RetailCategory> | FormData | Record<string, unknown>) {
    const response = await api.post(`/retail-category/categories`, data);
    return response.data;
  },

  async updateRetailCategory({ id, data }: { id: string | number; data: Partial<RetailCategory> | FormData | Record<string, unknown> }) {
    const response = await api.put(`/retail-category/categories/${id}`, data);
    return response.data;
  },

  async deleteRetailCategory(id: string | number) {
    const response = await api.delete(`/retail-category/categories/${id}`);
    return response.data;
  },

  async getRetailNotifyMe(userId?: string | number) {
    if (!userId) return [];
    const response = await api.get(`${API_PREFIX}/notify-me/user/${userId}`);
    return response.data;
  },

  async createRetailNotifyMe(payload: {
    retailProductId: string | number;
    userId?: string | number;
  }) {
    const response = await api.post(`${API_PREFIX}/notify-me`, {
      retailProductId: payload.retailProductId,
    });

    return response.data;
  },

  async createRetailProduct(data: Partial<RetailProduct> | FormData | Record<string, unknown>) {
    const response = await api.post(`${API_PREFIX}/`, data);
    return response.data;
  },

  async updateRetailProduct({ id, data }: { id: string | number; data: Partial<RetailProduct> | FormData | Record<string, unknown> }) {
    const response = await api.patch(`${API_PREFIX}/${id}`, data);
    return response.data;
  },

  async deleteRetailProduct(id: string | number) {
    const response = await api.delete(`${API_PREFIX}/${id}`);
    return response.data;
  },

  async getRetailBrands() {
    const response = await api.get(`/retail-brand`);
    return response.data;
  },
};

export default retailApi;
