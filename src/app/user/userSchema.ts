import { z } from "zod";

const MAX_FILE_SIZE = 1024 * 1024 * 5;

const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpeg",
  "image/jpeg",
  "image/webp",
];

export const shopKeeperSchema = z.object({
  name: z.string().min(3).max(20),
  email: z.string().email(),
  password: z.string().min(6),
  phoneNo: z.string().min(10).max(15),
  // address: z.number(),
  businessName: z.string().min(3).max(30),
  // picture: z.string(),
  // nic_front: z.string(),
  // nic_back: z.string(),
  role: z.enum(["SHOPKEEPER", "ADMIN", "DRIVER"]),
});

export const loginUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(["SHOPKEEPER", "ADMIN", "DRIVER"]),
});

export const updateShopKeeperStatusSchema = z.object({
  status: z.enum(["PENDING", "APPROVE", "REJECT", "BLOCK"]),
});
