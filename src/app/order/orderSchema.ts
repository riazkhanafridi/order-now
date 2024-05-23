import { z } from "zod";

export const orderStatusSchema = z.object({
  status: z.enum([
    "PENDING",
    "ACCEPTED",
    "OUT_FOR_DELIVERY",
    "DELIVERED",
    "CANCELLED",
  ]),
});
