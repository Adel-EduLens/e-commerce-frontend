import { useQuery } from "@tanstack/react-query";
import { retailApi } from "../../services/retailApi";

export const useRetailBrands = () => {
  return useQuery({
    queryKey: ["retail-brands"],
    queryFn: async () => {
      const response = await retailApi.getRetailBrands();
      // Adjust based on the actual API response shape
      return response.data || response;
    },
  });
};
