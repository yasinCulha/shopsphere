import { z } from "zod";

const nameSchema = z
  .string()
  .trim()
  .min(2, "En az 2 karakter girilmelidir.")
  .max(50, "En fazla 50 karakter girilebilir.")
  .regex(
    /^[a-zA-ZçÇğĞıİöÖşŞüÜ]+(?:[ '-][a-zA-ZçÇğĞıİöÖşŞüÜ]+)*$/,
    "Sadece harf kullanabilirsiniz.",
  );

export const registerSchema = z.object({
  firstName: nameSchema,

  lastName: nameSchema,

  email: z.string().trim().email("Geçerli bir e-posta adresi giriniz."),

  password: z.string().min(8, "Şifre en az 8 karakter olmalıdır."),
});

export type RegisterFormData = z.infer<typeof registerSchema>;
