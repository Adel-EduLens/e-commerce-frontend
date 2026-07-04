import { useQuery } from "@tanstack/react-query";
import { api } from "../../lib/axios";

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  brand: string;
  rating: number;
  traderId: number;
  categoryId: string;
  createdAt: string;
  updatedAt: string;

  category: {
    id: string;
    name: string;
    createdAt: string;
    updatedAt: string;
  };

  images: {
    id: string;
    url: string;
    productId: string;
  }[];

  sizes: {
    id: string;
    size: string;
    productId: string;
  }[];

  colors: {
    id: string;
    color: string;
    productId: string;
  }[];
}

const getProducts = async (): Promise<Product[]> => {
  const { data } = await api.get("/products");
  return data.data;
};

export const useProducts = () => {
  return useQuery({
    queryKey: ["products"],
    queryFn: getProducts,
  });
};