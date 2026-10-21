require("dotenv").config();

const pool = require("../config/db");

async function seedProducts() {
  try {
    const response = await fetch("https://dummyjson.com/products?limit=0");

    if (!response.ok) {
      throw new Error(`DummyJSON isteği başarısız: ${response.status}`);
    }

    const data = await response.json();

    console.log(`${data.products.length} ürün indirildi.`);

    for (const product of data.products) {
      await pool.query(
        `INSERT INTO products (
          source_id,
          title,
          description,
          category,
          price,
          discount_percentage,
          rating,
          stock,
          thumbnail,
          images
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        ON CONFLICT (source_id)
        DO UPDATE SET
          title = EXCLUDED.title,
          description = EXCLUDED.description,
          category = EXCLUDED.category,
          price = EXCLUDED.price,
          discount_percentage = EXCLUDED.discount_percentage,
          rating = EXCLUDED.rating,
          stock = EXCLUDED.stock,
          thumbnail = EXCLUDED.thumbnail,
          images = EXCLUDED.images`,
        [
          product.id,
          product.title,
          product.description,
          product.category,
          product.price,
          product.discountPercentage,
          product.rating,
          product.stock,
          product.thumbnail,
          product.images,
        ],
      );
    }

    console.log("Ürünler Neon veritabanına aktarıldı.");
  } catch (error) {
    console.error("Ürün aktarımı başarısız:", error.message);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
}

seedProducts();
