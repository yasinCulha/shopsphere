const pool = require("../config/db");

async function getCart(req, res) {
  try {
    const result = await pool.query(
      `SELECT
         cart_items.product_id AS "productId",
         cart_items.quantity,
         products.title,
         products.price,
         products.thumbnail,
         products.category
       FROM cart_items
       JOIN products ON products.id = cart_items.product_id
       WHERE cart_items.user_id = $1
       ORDER BY cart_items.created_at DESC`,
      [req.userId],
    );

    res.json({
      items: result.rows.map((item) => ({
        product: {
          id: item.productId,
          title: item.title,
          category: item.category,
          price: Number(item.price),
          thumbnail: item.thumbnail,
        },
        quantity: item.quantity,
      })),
    });
  } catch (error) {
    console.error("Sepet alınamadı:", error.message);
    res.status(500).json({ message: "Sepet alınamadı." });
  }
}

async function addToCart(req, res) {
  const productId = Number(req.body.productId);

  if (!Number.isInteger(productId) || productId <= 0) {
    return res.status(400).json({ message: "Geçerli bir ürün ID'si gönder." });
  }
  try {
    const result = await pool.query(
      `INSERT INTO cart_items (user_id, product_id, quantity)
       VALUES ($1, $2, 1)
       ON CONFLICT (user_id, product_id)
       DO UPDATE SET quantity = cart_items.quantity + 1
       RETURNING user_id, product_id, quantity`,
      [req.userId, productId],
    );

    res.status(201).json({
      message: "Ürün sepete eklendi.",
      item: result.rows[0],
    });
  } catch (error) {
    if (error.code === "23503") {
      return res.status(404).json({ message: "Ürün bulunamadı." });
    }

    console.error("Ürün sepete eklenemedi:", error.message);
    res.status(500).json({ message: "Ürün sepete eklenemedi." });
  }
}
async function removeFromCart(req, res) {
  const productId = Number(req.params.productId);

  if (!Number.isInteger(productId) || productId <= 0) {
    return res.status(400).json({ message: "Geçerli bir ürün ID'si gerekli." });
  }

  try {
    const result = await pool.query(
      `DELETE FROM cart_items
       WHERE user_id = $1 AND product_id = $2
       RETURNING product_id`,
      [req.userId, productId],
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Ürün sepetinde bulunamadı." });
    }

    res.json({ message: "Ürün sepetten silindi." });
  } catch (error) {
    console.error("Ürün sepetten silinemedi:", error.message);
    res.status(500).json({ message: "Ürün sepetten silinemedi." });
  }
}
async function updateCartQuantity(req, res) {
  const productId = Number(req.params.productId);
  const quantity = Number(req.body.quantity);

  if (
    !Number.isInteger(productId) ||
    productId <= 0 ||
    !Number.isInteger(quantity) ||
    quantity <= 0
  ) {
    return res.status(400).json({
      message: "Ürün ID'si ve miktar pozitif tam sayı olmalı.",
    });
  }

  try {
    const result = await pool.query(
      `UPDATE cart_items
       SET quantity = $1
       WHERE user_id = $2 AND product_id = $3
       RETURNING product_id, quantity`,
      [quantity, req.userId, productId],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Ürün sepetinde bulunamadı." });
    }

    res.json({
      message: "Ürün miktarı güncellendi.",
      item: result.rows[0],
    });
  } catch (error) {
    console.error("Sepet miktarı güncellenemedi:", error.message);
    res.status(500).json({ message: "Sepet miktarı güncellenemedi." });
  }
}
module.exports = { getCart, addToCart, removeFromCart, updateCartQuantity };
