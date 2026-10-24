const pool = require("../config/db");
const { addressSchema, profileSchema } = require("../schemas/accountSchemas");

function formatAddress(row) {
  return {
    id: Number(row.id),
    title: row.title,
    recipientName: row.recipient_name,
    phone: row.phone,
    city: row.city,
    district: row.district,
    postalCode: row.postal_code,
    addressLine: row.address_line,
    isDefault: row.is_default,
  };
}

const getProfile = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, first_name, last_name, email, image, created_at
       FROM users WHERE id = $1`,
      [req.userId],
    );
    if (!result.rows[0]) return res.status(404).json({ message: "Kullanıcı bulunamadı." });
    const user = result.rows[0];
    return res.json({
      user: {
        id: Number(user.id),
        firstName: user.first_name,
        lastName: user.last_name,
        email: user.email,
        image: user.image,
        createdAt: user.created_at,
      },
    });
  } catch (error) {
    console.error("Profil alınamadı:", error.message);
    return res.status(500).json({ message: "Profil bilgileri alınamadı." });
  }
};

const updateProfile = async (req, res) => {
  const validation = profileSchema.safeParse(req.body);
  if (!validation.success) {
    return res.status(400).json({
      message: "Ad ve soyad bilgilerini kontrol et.",
      errors: validation.error.flatten().fieldErrors,
    });
  }

  try {
    const { firstName, lastName } = validation.data;
    const result = await pool.query(
      `UPDATE users SET first_name = $1, last_name = $2
       WHERE id = $3
       RETURNING id, first_name, last_name, email, image, created_at`,
      [firstName, lastName, req.userId],
    );
    if (!result.rows[0]) return res.status(404).json({ message: "Kullanıcı bulunamadı." });
    const user = result.rows[0];
    return res.json({
      message: "Profil güncellendi.",
      user: {
        id: Number(user.id),
        firstName: user.first_name,
        lastName: user.last_name,
        email: user.email,
        image: user.image,
        createdAt: user.created_at,
      },
    });
  } catch (error) {
    console.error("Profil güncellenemedi:", error.message);
    return res.status(500).json({ message: "Profil güncellenemedi." });
  }
};

const getAddresses = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, title, recipient_name, phone, city, district,
              postal_code, address_line, is_default
       FROM user_addresses WHERE user_id = $1
       ORDER BY is_default DESC, created_at DESC`,
      [req.userId],
    );
    return res.json({ addresses: result.rows.map(formatAddress) });
  } catch (error) {
    console.error("Adresler alınamadı:", error.message);
    return res.status(500).json({ message: "Adresler alınamadı." });
  }
};

const createAddress = async (req, res) => {
  const validation = addressSchema.safeParse(req.body);
  if (!validation.success) {
    return res.status(400).json({ message: "Adres bilgilerini kontrol et.", errors: validation.error.flatten().fieldErrors });
  }

  const client = await pool.connect();
  try {
    const address = validation.data;
    await client.query("BEGIN");
    if (address.isDefault) {
      await client.query("UPDATE user_addresses SET is_default = FALSE WHERE user_id = $1", [req.userId]);
    }
    const result = await client.query(
      `INSERT INTO user_addresses
        (user_id, title, recipient_name, phone, city, district, postal_code, address_line, is_default)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING id, title, recipient_name, phone, city, district, postal_code, address_line, is_default`,
      [req.userId, address.title, address.recipientName, address.phone, address.city, address.district, address.postalCode, address.addressLine, address.isDefault],
    );
    await client.query("COMMIT");
    return res.status(201).json({ message: "Adres eklendi.", address: formatAddress(result.rows[0]) });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Adres eklenemedi:", error.message);
    return res.status(500).json({ message: "Adres eklenemedi." });
  } finally {
    client.release();
  }
};

const updateAddress = async (req, res) => {
  const validation = addressSchema.safeParse(req.body);
  const addressId = Number(req.params.id);
  if (!Number.isInteger(addressId) || addressId < 1) return res.status(400).json({ message: "Adres numarası geçersiz." });
  if (!validation.success) {
    return res.status(400).json({ message: "Adres bilgilerini kontrol et.", errors: validation.error.flatten().fieldErrors });
  }

  const client = await pool.connect();
  try {
    const address = validation.data;
    await client.query("BEGIN");
    if (address.isDefault) {
      await client.query("UPDATE user_addresses SET is_default = FALSE WHERE user_id = $1", [req.userId]);
    }
    const result = await client.query(
      `UPDATE user_addresses SET title=$1, recipient_name=$2, phone=$3,
         city=$4, district=$5, postal_code=$6, address_line=$7,
         is_default=$8, updated_at=NOW()
       WHERE id=$9 AND user_id=$10
       RETURNING id, title, recipient_name, phone, city, district, postal_code, address_line, is_default`,
      [address.title, address.recipientName, address.phone, address.city, address.district, address.postalCode, address.addressLine, address.isDefault, addressId, req.userId],
    );
    if (!result.rows[0]) {
      await client.query("ROLLBACK");
      return res.status(404).json({ message: "Adres bulunamadı." });
    }
    await client.query("COMMIT");
    return res.json({ message: "Adres güncellendi.", address: formatAddress(result.rows[0]) });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Adres güncellenemedi:", error.message);
    return res.status(500).json({ message: "Adres güncellenemedi." });
  } finally {
    client.release();
  }
};

const deleteAddress = async (req, res) => {
  const addressId = Number(req.params.id);
  if (!Number.isInteger(addressId) || addressId < 1) return res.status(400).json({ message: "Adres numarası geçersiz." });
  try {
    const result = await pool.query("DELETE FROM user_addresses WHERE id=$1 AND user_id=$2", [addressId, req.userId]);
    if (!result.rowCount) return res.status(404).json({ message: "Adres bulunamadı." });
    return res.json({ message: "Adres silindi." });
  } catch (error) {
    console.error("Adres silinemedi:", error.message);
    return res.status(500).json({ message: "Adres silinemedi." });
  }
};

const getOrders = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT o.id, o.status, o.total, o.created_at,
         COALESCE(json_agg(json_build_object(
           'productId', oi.product_id, 'title', oi.product_title,
           'price', oi.unit_price, 'quantity', oi.quantity
         )) FILTER (WHERE oi.id IS NOT NULL), '[]'::json) AS items
       FROM orders o
       LEFT JOIN order_items oi ON oi.order_id = o.id
       WHERE o.user_id = $1
       GROUP BY o.id
       ORDER BY o.created_at DESC`,
      [req.userId],
    );
    return res.json({ orders: result.rows.map((order) => ({
      id: Number(order.id), status: order.status, total: Number(order.total),
      createdAt: order.created_at, items: order.items,
    })) });
  } catch (error) {
    console.error("Siparişler alınamadı:", error.message);
    return res.status(500).json({ message: "Siparişler alınamadı." });
  }
};

module.exports = { getProfile, updateProfile, getAddresses, createAddress, updateAddress, deleteAddress, getOrders };
