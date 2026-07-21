import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseQueryOptions,
  type UseQueryResult,
} from "@tanstack/react-query";
import { api } from "../../lib/axios";
import { AxiosError } from "axios";
import { toast } from "sonner";

// =======================================================
// TYPES & INTERFACES (STRICT TYPES - NO ANY)
// =======================================================

export interface ShippingCity {
  id: string;
  name: string;
  shippingCost: number;
  countryId: string;
  country?: ShippingCountry;
  createdAt: string;
  updatedAt: string;
}

export interface ShippingCountry {
  id: string;
  name: string;
  code?: string | null;
  cities?: ShippingCity[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateShippingCountryData {
  name: string;
  code?: string;
}

export interface UpdateShippingCountryData {
  name?: string;
  code?: string;
}

export interface CreateShippingCityData {
  name: string;
  shippingCost?: number;
  countryId: string;
}

export interface UpdateShippingCityData {
  name?: string;
  shippingCost?: number;
  countryId?: string;
}

interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

interface ApiErrorResponse {
  message?: string;
  errors?: Record<string, string[]>;
}

// =======================================================
// SHIPPING COUNTRY QUERIES & MUTATIONS
// =======================================================

// GET ALL COUNTRIES
const getShippingCountries = async (): Promise<ShippingCountry[]> => {
  const { data } = await api.get<ApiResponse<ShippingCountry[]>>("/shipping/countries");
  return data.data;
};

export const useShippingCountries = (
  options?: Omit<
    UseQueryOptions<ShippingCountry[], AxiosError<ApiErrorResponse>>,
    "queryKey" | "queryFn"
  >
): UseQueryResult<ShippingCountry[], AxiosError<ApiErrorResponse>> => {
  return useQuery({
    queryKey: ["shipping-countries"],
    queryFn: getShippingCountries,
    ...options,
  });
};

// GET COUNTRY BY ID
const getShippingCountryById = async (id: string): Promise<ShippingCountry> => {
  const { data } = await api.get<ApiResponse<ShippingCountry>>(`/shipping/countries/${id}`);
  return data.data;
};

export const useShippingCountry = (
  id: string,
  options?: Omit<
    UseQueryOptions<ShippingCountry, AxiosError<ApiErrorResponse>>,
    "queryKey" | "queryFn"
  >
): UseQueryResult<ShippingCountry, AxiosError<ApiErrorResponse>> => {
  return useQuery({
    queryKey: ["shipping-countries", id],
    queryFn: () => getShippingCountryById(id),
    enabled: Boolean(id),
    ...options,
  });
};

// CREATE COUNTRY
const createShippingCountry = async (
  payload: CreateShippingCountryData
): Promise<ShippingCountry> => {
  const { data } = await api.post<ApiResponse<ShippingCountry>>("/shipping/countries", payload);
  return data.data;
};

export const useCreateShippingCountry = () => {
  const queryClient = useQueryClient();

  return useMutation<
    ShippingCountry,
    AxiosError<ApiErrorResponse>,
    CreateShippingCountryData,
    { toastId: string | number }
  >({
    mutationFn: createShippingCountry,
    onMutate: () => {
      return { toastId: toast.loading("Creating shipping country...") };
    },
    onSuccess: (_, __, context) => {
      toast.success("Shipping country created successfully!", { id: context?.toastId });
      queryClient.invalidateQueries({ queryKey: ["shipping-countries"] });
    },
    onError: (err, _, context) => {
      const msg = err.response?.data?.message || err.message || "Failed to create shipping country";
      toast.error(msg, { id: context?.toastId });
    },
  });
};

// UPDATE COUNTRY
const updateShippingCountry = async ({
  id,
  data: payload,
}: {
  id: string;
  data: UpdateShippingCountryData;
}): Promise<ShippingCountry> => {
  const { data } = await api.patch<ApiResponse<ShippingCountry>>(
    `/shipping/countries/${id}`,
    payload
  );
  return data.data;
};

export const useUpdateShippingCountry = () => {
  const queryClient = useQueryClient();

  return useMutation<
    ShippingCountry,
    AxiosError<ApiErrorResponse>,
    { id: string; data: UpdateShippingCountryData },
    { toastId: string | number }
  >({
    mutationFn: updateShippingCountry,
    onMutate: () => {
      return { toastId: toast.loading("Updating shipping country...") };
    },
    onSuccess: (_, { id }, context) => {
      toast.success("Shipping country updated successfully!", { id: context?.toastId });
      queryClient.invalidateQueries({ queryKey: ["shipping-countries"] });
      queryClient.invalidateQueries({ queryKey: ["shipping-countries", id] });
    },
    onError: (err, _, context) => {
      const msg = err.response?.data?.message || err.message || "Failed to update shipping country";
      toast.error(msg, { id: context?.toastId });
    },
  });
};

// DELETE COUNTRY
const deleteShippingCountry = async (id: string): Promise<void> => {
  await api.delete(`/shipping/countries/${id}`);
};

export const useDeleteShippingCountry = () => {
  const queryClient = useQueryClient();

  return useMutation<
    void,
    AxiosError<ApiErrorResponse>,
    string,
    { toastId: string | number }
  >({
    mutationFn: deleteShippingCountry,
    onMutate: () => {
      return { toastId: toast.loading("Deleting shipping country...") };
    },
    onSuccess: (_, __, context) => {
      toast.success("Shipping country deleted successfully!", { id: context?.toastId });
      queryClient.invalidateQueries({ queryKey: ["shipping-countries"] });
      queryClient.invalidateQueries({ queryKey: ["shipping-cities"] });
    },
    onError: (err, _, context) => {
      const msg = err.response?.data?.message || err.message || "Failed to delete shipping country";
      toast.error(msg, { id: context?.toastId });
    },
  });
};

// =======================================================
// SHIPPING CITY QUERIES & MUTATIONS
// =======================================================

// GET CITIES (OPTIONAL FILTER BY COUNTRY ID)
const getShippingCities = async (countryId?: string): Promise<ShippingCity[]> => {
  const { data } = await api.get<ApiResponse<ShippingCity[]>>("/shipping/cities", {
    params: countryId ? { countryId } : undefined,
  });
  return data.data;
};

export const useShippingCities = (
  countryId?: string,
  options?: Omit<
    UseQueryOptions<ShippingCity[], AxiosError<ApiErrorResponse>>,
    "queryKey" | "queryFn"
  >
): UseQueryResult<ShippingCity[], AxiosError<ApiErrorResponse>> => {
  return useQuery({
    queryKey: ["shipping-cities", countryId],
    queryFn: () => getShippingCities(countryId),
    ...options,
  });
};

// GET CITY BY ID
const getShippingCityById = async (id: string): Promise<ShippingCity> => {
  const { data } = await api.get<ApiResponse<ShippingCity>>(`/shipping/cities/${id}`);
  return data.data;
};

export const useShippingCity = (
  id: string,
  options?: Omit<
    UseQueryOptions<ShippingCity, AxiosError<ApiErrorResponse>>,
    "queryKey" | "queryFn"
  >
): UseQueryResult<ShippingCity, AxiosError<ApiErrorResponse>> => {
  return useQuery({
    queryKey: ["shipping-cities", "detail", id],
    queryFn: () => getShippingCityById(id),
    enabled: Boolean(id),
    ...options,
  });
};

// CREATE CITY
const createShippingCity = async (
  payload: CreateShippingCityData
): Promise<ShippingCity> => {
  const { data } = await api.post<ApiResponse<ShippingCity>>("/shipping/cities", payload);
  return data.data;
};

export const useCreateShippingCity = () => {
  const queryClient = useQueryClient();

  return useMutation<
    ShippingCity,
    AxiosError<ApiErrorResponse>,
    CreateShippingCityData,
    { toastId: string | number }
  >({
    mutationFn: createShippingCity,
    onMutate: () => {
      return { toastId: toast.loading("Creating shipping city...") };
    },
    onSuccess: (_, __, context) => {
      toast.success("Shipping city created successfully!", { id: context?.toastId });
      queryClient.invalidateQueries({ queryKey: ["shipping-cities"] });
      queryClient.invalidateQueries({ queryKey: ["shipping-countries"] });
    },
    onError: (err, _, context) => {
      const msg = err.response?.data?.message || err.message || "Failed to create shipping city";
      toast.error(msg, { id: context?.toastId });
    },
  });
};

// UPDATE CITY
const updateShippingCity = async ({
  id,
  data: payload,
}: {
  id: string;
  data: UpdateShippingCityData;
}): Promise<ShippingCity> => {
  const { data } = await api.patch<ApiResponse<ShippingCity>>(
    `/shipping/cities/${id}`,
    payload
  );
  return data.data;
};

export const useUpdateShippingCity = () => {
  const queryClient = useQueryClient();

  return useMutation<
    ShippingCity,
    AxiosError<ApiErrorResponse>,
    { id: string; data: UpdateShippingCityData },
    { toastId: string | number }
  >({
    mutationFn: updateShippingCity,
    onMutate: () => {
      return { toastId: toast.loading("Updating shipping city...") };
    },
    onSuccess: (_, { id }, context) => {
      toast.success("Shipping city updated successfully!", { id: context?.toastId });
      queryClient.invalidateQueries({ queryKey: ["shipping-cities"] });
      queryClient.invalidateQueries({ queryKey: ["shipping-cities", "detail", id] });
      queryClient.invalidateQueries({ queryKey: ["shipping-countries"] });
    },
    onError: (err, _, context) => {
      const msg = err.response?.data?.message || err.message || "Failed to update shipping city";
      toast.error(msg, { id: context?.toastId });
    },
  });
};

// DELETE CITY
const deleteShippingCity = async (id: string): Promise<void> => {
  await api.delete(`/shipping/cities/${id}`);
};

export const useDeleteShippingCity = () => {
  const queryClient = useQueryClient();

  return useMutation<
    void,
    AxiosError<ApiErrorResponse>,
    string,
    { toastId: string | number }
  >({
    mutationFn: deleteShippingCity,
    onMutate: () => {
      return { toastId: toast.loading("Deleting shipping city...") };
    },
    onSuccess: (_, __, context) => {
      toast.success("Shipping city deleted successfully!", { id: context?.toastId });
      queryClient.invalidateQueries({ queryKey: ["shipping-cities"] });
      queryClient.invalidateQueries({ queryKey: ["shipping-countries"] });
    },
    onError: (err, _, context) => {
      const msg = err.response?.data?.message || err.message || "Failed to delete shipping city";
      toast.error(msg, { id: context?.toastId });
    },
  });
};
