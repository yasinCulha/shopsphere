const { z } = require("zod");

const productSchema = z.object({
  title: z.string().trim().min(2).max(200),
  description: z.string().trim().max(5000).default(""),
  category: z.string().trim().min(2).max(100),
  price: z.coerce.number().finite().min(0),
  discountPercentage: z.coerce.number().finite().min(0).max(100).default(0),
  stock: z.coerce.number().int().min(0),
  thumbnail: z.string().trim().url(),
  images: z.array(z.string().url()).default([]),
});

module.exports = { productSchema };
