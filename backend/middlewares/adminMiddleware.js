const pool = require("../config/db");

async function adminMiddleware(req, res, next) {
  try {
    const result = await pool.query("SELECT role FROM users WHERE id = $1", [req.userId]);
    if (!result.rows[0] || result.rows[0].role !== "admin") {
      return res.status(403).json({ message: "Bu alan için admin yetkisi gerekiyor." });
    }
    return next();
  } catch (error) {
    console.error("Admin yetkisi kontrol edilemedi:", error.message);
    return res.status(500).json({ message: "Yetki kontrolü yapılamadı." });
  }
}

module.exports = adminMiddleware;
