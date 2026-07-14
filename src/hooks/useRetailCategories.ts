import { useQuery, useMutation, useQueryClient, type UseQueryResult, type UseQueryOptions } from "@tanstack/react-query";
import retailApi from "../services/retailApi";
import type { RetailCategory } from "../types/retail";

export function useRetailCategories(
  options?: Omit<UseQueryOptions<{ data: RetailCategory[] }, Error, { data: RetailCategory[] }, string[]>, "queryKey" | "queryFn">
): UseQueryResult<{ data: RetailCategory[] }, Error> {
  return useQuery({
    queryKey: ["retailCategories"],
    queryFn: async (): Promise<{ data: RetailCategory[] }> => {
      const data = await retailApi.getRetailCategories();
      return data;
    },
    ...options,
  });
}

export function useRetailCategory(id?: string | number) {
  return useQuery({
    queryKey: ["retailCategory", id],
    queryFn: async () => {
      if (!id) throw new Error("ID is required");
      const data = await retailApi.getRetailCategoryById(id);
      return data;
    },
    enabled: !!id,
  });
}

export function useRetailCategoryBySlug(slug?: string) {
  return useQuery({
    queryKey: ["retailCategory", "slug", slug],
    queryFn: async () => {
      if (!slug) throw new Error("Slug is required");
      const data = await retailApi.getRetailCategoryBySlug(slug);
      return data;
    },
    enabled: !!slug,
  });
}

export function useCreateRetailCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<RetailCategory> | FormData | Record<string, unknown>) => retailApi.createRetailCategory(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["retailCategories"] });
    },
  });
}

export function useUpdateRetailCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string | number; data: Partial<RetailCategory> | FormData | Record<string, unknown> }) =>
      retailApi.updateRetailCategory({ id, data }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["retailCategories"] });
      queryClient.invalidateQueries({
        queryKey: ["retailCategory", variables.id],
      });
    },
  });
}

export function useDeleteRetailCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string | number) => retailApi.deleteRetailCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["retailCategories"] });
    },
  });
}

export default useRetailCategories;
