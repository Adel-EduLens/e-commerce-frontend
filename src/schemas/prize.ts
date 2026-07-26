import { z } from "zod";

export const prizeSchema = z.object({
  name: z.string().min(1, "nameRequired"),
  weight: z.coerce.number().min(1, "weightMin"),
});

export type PrizeFormValues = z.infer<typeof prizeSchema>;
