import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().trim().email("Geçerli bir e-posta giriniz."),
  password: z.string().min(1, "Şifre gereklidir."),
});

export type LoginFormData = z.infer<typeof loginSchema>;
