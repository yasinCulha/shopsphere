const pool = require("../config/db");

async function getFavorites(req, res) {
  try {
    const result = await pool.query(
      `SELECT
            products.id,
         products.title,
         products.description,
         products.category,
         products.price,
         products.discount_percentage AS "discountPercentage",
         products.rating,
         products.stock,
         products.thumbnail,
         products.images FROM favorites 
         JOIN products ON products.id = favorites.product_id  
         WHERE favorites.user_id = $1
         ORDER BY favorites.created_at`,
      [req.userId],
    );
    res.json({ favorites: result.rows });
  } catch (error) {
    console.log("FAvoriler alinamadi" + error);
    res.status(500).json({ message: "Favoriler Alinamaid" });
  }
}

async function addToFavorites(req, res) {
  const productId = Number(req.params.productId);

  if (!Number.isInteger(productId) || productId <= 0) {
    return res.status(400).json({ message: "Geçerli bir ürün ID'si gönder." });
  }
  try {
    const result = await pool.query(
      `INSERT INTO favorites (user_id, product_id)
       VALUES ($1, $2)
       ON CONFLICT (user_id, product_id) DO NOTHING 
       RETURNING user_id, product_id`,
      [req.userId, productId],
    );

    res.status(201).json({
      message: "Ürün favorilere eklendi.",
      item: result.rows[0] ?? null,
    });
  } catch (error) {
    if (error.code === "23503") {
      return res.status(404).json({ message: "Ürün bulunamadı." });
    }

    console.error("Ürün favorilere eklenemedi:", error.message);
    res.status(500).json({ message: "Ürün favorilere eklenemedi." });
  }
}

async function removeFavorites(req, res) {
  const productId = Number(req.params.productId);

  if (!Number.isInteger(productId) || productId <= 0) {
    return res.status(400).json({ message: "Geçerli bir ürün ID'si gerekli." });
  }

  try {
    const result = await pool.query(
      `DELETE FROM favorites
       WHERE user_id = $1 AND product_id = $2
       RETURNING product_id`,
      [req.userId, productId],
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Ürün favorilere bulunamadı." });
    }

    res.json({ message: "Ürün favorilere silindi." });
  } catch (error) {
    console.error("Ürün favorilere silinemedi:", error.message);
    res.status(500).json({ message: "Ürün favorilere silinemedi." });
  }
}

module.exports = { getFavorites, addToFavorites, removeFavorites };
