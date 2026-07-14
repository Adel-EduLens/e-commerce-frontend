import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "../../lib/axios";

export interface ShopBanner {
  id: string;
  title: string;
  description: string;
  buttonText?: string;
  buttonLink?: string;
  image: string;
  backgroundColor: string;
  isActive: boolean;
  order: number;
  type: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateShopBannerData {
  title: string;
  description: string;
  buttonText?: string;
  buttonLink?: string;
  image: string;
  backgroundColor: string;
  isActive?: boolean;
  order?: number;
  type?: string;
}

export interface UpdateShopBannerData {
  title?: string;
  description?: string;
  buttonText?: string;
  buttonLink?: string;
  image?: string;
  backgroundColor?: string;
  isActive?: boolean;
  order?: number;
  type?: string;
}


// ================= GET ALL =================

const getShopBanners = async (type?: string): Promise<ShopBanner[]> => {
  const { data } = await api.get("/shop-banners", {
    params: type ? { type } : undefined,
  });

  return data.data;
};

export const useShopBanners = (type?: string) => {
  return useQuery({
    queryKey: ["shop-banners", type],
    queryFn: () => getShopBanners(type),
  });
};


// ================= GET ACTIVE =================

const getActiveShopBanners = async (type?: string): Promise<ShopBanner[]> => {
  const { data } = await api.get("/shop-banners/active", {
    params: type ? { type } : undefined,
  });

  return data.data;
};

export const useActiveShopBanners = (type?: string) => {
  return useQuery({
    queryKey: ["shop-banners", "active", type],
    queryFn: () => getActiveShopBanners(type),
  });
};


// ================= GET SINGLE =================

const getShopBanner = async (id: string): Promise<ShopBanner> => {
  const { data } = await api.get(`/shop-banners/${id}`);

  return data.data;
};

export const useShopBanner = (id: string) => {
  return useQuery({
    queryKey: ["shop-banner", id],
    queryFn: () => getShopBanner(id),
    enabled: !!id,
  });
};


// ================= CREATE =================

const createShopBanner = async (
  bannerData: CreateShopBannerData
): Promise<ShopBanner> => {
  const { data } = await api.post("/shop-banners", bannerData);

  return data.data;
};

export const useCreateShopBanner = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createShopBanner,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["shop-banners"],
      });
    },
  });
};


// ================= UPDATE =================

const updateShopBanner = async ({
  id,
  data: bannerData,
}: {
  id: string;
  data: UpdateShopBannerData;
}): Promise<ShopBanner> => {
  const { data } = await api.patch(
    `/shop-banners/${id}`,
    bannerData
  );

  return data.data;
};

export const useUpdateShopBanner = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateShopBanner,

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["shop-banners"],
      });

      queryClient.invalidateQueries({
        queryKey: ["shop-banner", variables.id],
      });
    },
  });
};


// ================= DELETE =================

const deleteShopBanner = async (id: string) => {
  const { data } = await api.delete(`/shop-banners/${id}`);

  return data;
};

export const useDeleteShopBanner = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteShopBanner,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["shop-banners"],
      });
    },
  });
};