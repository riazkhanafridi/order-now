import { z } from "zod";

export const subCategorySchema = z.object({
  name: z.string().min(3),
  categoryId: z.number(),
});
