import { useQuery } from "@tanstack/react-query";
import { api } from "../../lib/axios";

export interface Category {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

const getCategories = async (): Promise<Category[]> => {
  const { data } = await api.get("/categories");
  return data.data;
};

export const useCategories = () => {
  return useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });
};
