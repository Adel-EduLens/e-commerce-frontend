import { z } from "zod";

export const prizeSchema = z.object({
  name: z.string().min(1, "Name is required"),
  weight: z.number().min(1, "Weight must be > 0"),
});

export type PrizeFormValues = z.infer<typeof prizeSchema>;