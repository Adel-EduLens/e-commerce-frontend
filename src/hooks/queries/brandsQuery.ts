import { useQuery } from "@tanstack/react-query";
import { api } from "../../lib/axios";

export interface Brand {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

const getBrands = async (): Promise<Brand[]> => {
  const { data } = await api.get("/brands");
  return data.data;
};

export const useBrands = () => {
  return useQuery({
    queryKey: ["brands"],
    queryFn: getBrands,
  });
};