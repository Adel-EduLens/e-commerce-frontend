import { useMutation } from "@tanstack/react-query";
import { api } from "../../lib/axios";
import { useAuthStore } from "../../store/useAuthStore";
import type { User } from "../../types/auth";

interface UpdateTraderMeData {
  name?: string;
  address?: string;
}

const updateTraderMe = async (data: UpdateTraderMeData): Promise<User> => {
  const res = await api.patch("/trader/me", data);
  return res.data.data;
};

export const useUpdateTraderMe = () => {
  const updateUser = useAuthStore((s) => s.updateUser);
  return useMutation({
    mutationFn: updateTraderMe,
    onSuccess: (updatedTrader) => {
      updateUser(updatedTrader);
    },
  });
};
