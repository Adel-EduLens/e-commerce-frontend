import { z } from "zod";

export const prizeSchema = z.object({
  name: z.string().min(1, "nameRequired"),
  weight: z.coerce.number().min(1, "weightMin"),
});

export type PrizeFormValues = z.infer<typeof prizeSchema>;

export interface Prize {
  id: string;
  name: string;
  weight: number;
  color?: string;
  isWinning?: boolean;
  createdAt?: string;
}

export interface PrizeWheelSettings {
  minSpentToSpin: number;
  isEnabled: boolean;
  prizes: Prize[];
}

export interface PrizeWinner {
  id: string;
  userId: number;
  userName: string;
  prizeName: string;
  wonAt: string;
}
