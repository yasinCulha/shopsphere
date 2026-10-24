const { z } = require("zod");

const nameSchema = z
  .string()
  .trim()
  .min(2, "En az 2 karakter gir.")
  .max(50, "En fazla 50 karakter girilebilir.")
  .regex(
    /^[a-zA-ZçÇğĞıİöÖşŞüÜ]+(?:[ '-][a-zA-ZçÇğĞıİöÖşŞüÜ]+)*$/,
    "Ad ve soyadda sadece harf kullanabilirsin.",
  );

const profileSchema = z.object({
  firstName: nameSchema,
  lastName: nameSchema,
});

const addressSchema = z.object({
  title: z.string().trim().min(2, "Adres başlığı gir.").max(60),
  recipientName: z
    .string()
    .trim()
    .min(2, "Alıcı adı en az 2 karakter olmalı.")
    .max(120, "Alıcı adı en fazla 120 karakter olabilir.")
    .regex(
      /^[a-zA-ZçÇğĞıİöÖşŞüÜ]+(?:[ '-][a-zA-ZçÇğĞıİöÖşŞüÜ]+)*$/,
      "Alıcı adında sayı veya sembol kullanma.",
    ),
  phone: z
    .string()
    .trim()
    .regex(/^05\d{9}$/, "Telefonu 05XXXXXXXXX biçiminde, 11 rakam olarak gir."),
  city: z.string().trim().min(2, "Şehir gir.").max(80),
  district: z.string().trim().min(2, "İlçe gir.").max(80),
  postalCode: z.string().trim().max(20).default(""),
  addressLine: z.string().trim().min(8, "Açık adres en az 8 karakter olmalı."),
  isDefault: z.boolean().default(false),
});

module.exports = { profileSchema, addressSchema };
