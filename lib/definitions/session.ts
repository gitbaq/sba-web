import { z } from "zod";

export const SessionPayload = z.object({
  userId: z
    .string()
    .min(2, { message: "User Id must be at least 2 characters long." })
    .trim(),
  expiresAt: z.date(),
});
