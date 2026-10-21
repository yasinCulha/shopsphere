const { z } = require("zod");

const loginSchema = z.object({
  email: z.string().trim().email("Geçerli bir e-posta giriniz."),
  password: z.string().min(1, "Şifre gereklidir."),
});

module.exports = { loginSchema };
