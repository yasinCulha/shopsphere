const pool = require("../config/db");
const { productSchema } = require("../schemas/adminProductSchema");

const productColumns = `id, title, description, category, price,
  discount_percentage AS "discountPercentage", rating, stock, thumbnail, images`;

function formatProduct(row) {
  return {
    ...row,
    id: Number(row.id),
    price: Number(row.price),
    discountPercentage: Number(row.discountPercentage),
    rating: Number(row.rating),
    reviews: [],
  };
}

const getDashboard = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT
        (SELECT COUNT(*) FROM products) AS products,
        (SELECT COUNT(*) FROM users WHERE role = 'customer') AS customers,
        (SELECT COUNT(*) FROM orders) AS orders,
        (SELECT COALESCE(SUM(total), 0) FROM orders WHERE status <> 'cancelled') AS sales`,
    );
    const stats = result.rows[0];
    return res.json({
      products: Number(stats.products),
      customers: Number(stats.customers),
      orders: Number(stats.orders),
      sales: Number(stats.sales),
    });
  } catch (error) {
    console.error("Dashboard verileri alınamadı:", error.message);
    return res.status(500).json({ message: "Dashboard verileri alınamadı." });
  }
};

const listProducts = async (req, res) => {
  try {
    const result = await pool.query(`SELECT ${productColumns} FROM products ORDER BY id DESC`);
    return res.json({ products: result.rows.map(formatProduct) });
  } catch (error) {
    console.error("Admin ürünleri alınamadı:", error.message);
    return res.status(500).json({ message: "Ürünler alınamadı." });
  }
};

const createProduct = async (req, res) => {
  const validation = productSchema.safeParse(req.body);
  if (!validation.success) {
    return res.status(400).json({ message: "Ürün bilgilerini kontrol et.", errors: validation.error.flatten().fieldErrors });
  }
  const product = validation.data;
  try {
    const images = product.images.length ? product.images : [product.thumbnail];
    const result = await pool.query(
      `INSERT INTO products (title, description, category, price, discount_percentage, stock, thumbnail, images)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING ${productColumns}`,
      [product.title, product.description, product.category, product.price, product.discountPercentage, product.stock, product.thumbnail, images],
    );
    return res.status(201).json({ message: "Ürün eklendi.", product: formatProduct(result.rows[0]) });
  } catch (error) {
    console.error("Ürün eklenemedi:", error.message);
    return res.status(500).json({ message: "Ürün eklenemedi." });
  }
};

const updateProduct = async (req, res) => {
  const productId = Number(req.params.id);
  const validation = productSchema.safeParse(req.body);
  if (!Number.isInteger(productId) || productId < 1) return res.status(400).json({ message: "Ürün numarası geçersiz." });
  if (!validation.success) {
    return res.status(400).json({ message: "Ürün bilgilerini kontrol et.", errors: validation.error.flatten().fieldErrors });
  }
  const product = validation.data;
  try {
    const images = product.images.length ? product.images : [product.thumbnail];
    const result = await pool.query(
      `UPDATE products SET title=$1, description=$2, category=$3, price=$4,
         discount_percentage=$5, stock=$6, thumbnail=$7, images=$8, updated_at=NOW()
       WHERE id=$9 RETURNING ${productColumns}`,
      [product.title, product.description, product.category, product.price, product.discountPercentage, product.stock, product.thumbnail, images, productId],
    );
    if (!result.rows[0]) return res.status(404).json({ message: "Ürün bulunamadı." });
    return res.json({ message: "Ürün güncellendi.", product: formatProduct(result.rows[0]) });
  } catch (error) {
    console.error("Ürün güncellenemedi:", error.message);
    return res.status(500).json({ message: "Ürün güncellenemedi." });
  }
};

const deleteProduct = async (req, res) => {
  const productId = Number(req.params.id);
  if (!Number.isInteger(productId) || productId < 1) return res.status(400).json({ message: "Ürün numarası geçersiz." });
  try {
    const result = await pool.query("DELETE FROM products WHERE id=$1 RETURNING id", [productId]);
    if (!result.rows[0]) return res.status(404).json({ message: "Ürün bulunamadı." });
    return res.json({ message: "Ürün silindi." });
  } catch (error) {
    console.error("Ürün silinemedi:", error.message);
    return res.status(500).json({ message: "Ürün silinemedi." });
  }
};

const listUsers = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, first_name AS "firstName", last_name AS "lastName", email, created_at AS "createdAt"
       FROM users WHERE role = 'customer' ORDER BY created_at DESC`,
    );
    return res.json({ users: result.rows.map((user) => ({ ...user, id: Number(user.id) })) });
  } catch (error) {
    console.error("Kullanıcılar alınamadı:", error.message);
    return res.status(500).json({ message: "Kullanıcılar alınamadı." });
  }
};

const listOrders = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT o.id, o.status, o.total, o.created_at AS "createdAt",
          u.email,
          COALESCE(json_agg(json_build_object('title', oi.product_title, 'quantity', oi.quantity))
            FILTER (WHERE oi.id IS NOT NULL), '[]'::json) AS items
       FROM orders o JOIN users u ON u.id = o.user_id
       LEFT JOIN order_items oi ON oi.order_id = o.id
       GROUP BY o.id, u.email ORDER BY o.created_at DESC`,
    );
    return res.json({ orders: result.rows.map((order) => ({ ...order, id: Number(order.id), total: Number(order.total) })) });
  } catch (error) {
    console.error("Siparişler alınamadı:", error.message);
    return res.status(500).json({ message: "Siparişler alınamadı." });
  }
};

module.exports = { getDashboard, listProducts, createProduct, updateProduct, deleteProduct, listUsers, listOrders };
