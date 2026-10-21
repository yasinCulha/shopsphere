"use strict";

const pool = require("../config/db");
const bcrypt = require("bcryptjs");
const { loginSchema } = require("../schemas/loginSchema");
const { registerSchema } = require("../schemas/registerSchema");
const { createAccessToken, createRefreshToken, hashRefreshToken, setRefreshCookie } = require("../utils/authTokens");

const login = async (req, res) => {
  try {
    const validation = loginSchema.safeParse(req.body);

    if (!validation.success) {
      return res.status(400).json({
        message: "E-posta ve şifre bilgilerini kontrol et.",
        errors: validation.error.flatten().fieldErrors,
      });
    }

    const email = validation.data.email.toLowerCase();
    const password = validation.data.password;

    const result = await pool.query(
      `SELECT id, first_name, last_name, email, password_hash, image
       FROM users
       WHERE email = $1`,
      [email],
    );

    const user = result.rows[0];

    if (!user) {
      return res.status(401).json({
        message: "E-posta veya şifre hatalı.",
      });
    }

    const passwordIsCorrect = await bcrypt.compare(
      password,
      user.password_hash,
    );

    if (!passwordIsCorrect) {
      return res.status(401).json({
        message: "E-posta veya şifre hatalı.",
      });
    }

    const refreshToken = createRefreshToken();
    const refreshTokenHash = hashRefreshToken(refreshToken);

    await pool.query(
      `INSERT INTO refresh_tokens (user_id, token_hash, expires_at)
       VALUES ($1, $2, NOW() + INTERVAL '7 days')`,
      [user.id, refreshTokenHash],
    );

    setRefreshCookie(res, refreshToken);

    const accessToken = createAccessToken(Number(user.id));

    res.json({
      message: "Giriş başarılı.",
      accessToken,
      user: {
        id: Number(user.id),
        firstName: user.first_name,
        lastName: user.last_name,
        email: user.email,
        image: user.image,
      },
    });
  } catch (error) {
    console.error("Giriş hatası:", error.message);
    res.status(500).json({ message: "Giriş yapılamadı." });
  }
};

const register = async (req, res) => {
  try {
    const validation = registerSchema.safeParse(req.body);

    if (!validation.success) {
      return res.status(400).json({
        message: "Form bilgileri geçersiz.",
        errors: validation.error.flatten().fieldErrors,
      });
    }
    const { firstName, lastName, email, password } = validation.data;

    const normalizedEmail = email.trim().toLowerCase();

    const existingUSer = await pool.query(
      "SELECT id FROM users WHERE email= $1",
      [normalizedEmail],
    );
    if ((existingUSer.rowCount ?? 0) > 0) {
      return res.status(409).json({
        message: "Bu e-posta adresiyle kullanici var ",
      });
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const result = await pool.query(
      `INSERT INTO users (first_name, last_name, email, password_hash)
       VALUES ($1, $2, $3, $4)
       RETURNING id, first_name, last_name, email, image`,
      [firstName.trim(), lastName.trim(), normalizedEmail, passwordHash],
    );
    const user = result.rows[0];
    const refreshToken = createRefreshToken();
    const refreshTokenHash = hashRefreshToken(refreshToken);

    await pool.query(
      `INSERT INTO refresh_tokens (user_id, token_hash, expires_at)
   VALUES ($1, $2, NOW() + INTERVAL '7 days')`,
      [user.id, refreshTokenHash],
    );
    setRefreshCookie(res, refreshToken);
    const accessToken = createAccessToken(Number(user.id));

    res.status(201).json({
      message: "Hesap oluşturuldu.",
      accessToken,
      user: {
        id: Number(user.id),
        firstName: user.first_name,
        lastName: user.last_name,
        email: user.email,
        image: user.image,
      },
    });
  } catch (error) {
    console.error("Kayıt hatası:", error.message);
    res.status(500).json({ message: "Hesap oluşturulamadı." });
  }
};

const refreshSession = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return res.status(401).json({ message: "Oturum bulunamadı." });
  }

  const client = await pool.connect();

  try {
    const tokenHash = hashRefreshToken(refreshToken);

    await client.query("BEGIN");

    const result = await client.query(
      `SELECT
        refresh_tokens.id AS token_id,
        users.id,
        users.first_name,
        users.last_name,
        users.email,
        users.image
       FROM refresh_tokens
       JOIN users ON users.id = refresh_tokens.user_id
       WHERE refresh_tokens.token_hash = $1
         AND refresh_tokens.expires_at > NOW()
         AND refresh_tokens.revoked_at IS NULL
       FOR UPDATE`,
      [tokenHash],
    );

    if (result.rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(401).json({ message: "Oturumun süresi dolmuş." });
    }

    const user = result.rows[0];

    await client.query(
      "UPDATE refresh_tokens SET revoked_at = NOW() WHERE id = $1",
      [user.token_id],
    );

    const newRefreshToken = createRefreshToken();
    const newTokenHash = hashRefreshToken(newRefreshToken);

    await client.query(
      `INSERT INTO refresh_tokens (user_id, token_hash, expires_at)
       VALUES ($1, $2, NOW() + INTERVAL '7 days')`,
      [user.id, newTokenHash],
    );

    await client.query("COMMIT");

    setRefreshCookie(res, newRefreshToken);

    const accessToken = createAccessToken(Number(user.id));

    res.json({
      accessToken,
      user: {
        id: Number(user.id),
        firstName: user.first_name,
        lastName: user.last_name,
        email: user.email,
        image: user.image,
      },
    });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Oturum yenileme hatası:", error.message);
    res.status(500).json({ message: "Oturum yenilenemedi." });
  } finally {
    client.release();
  }
};

const logout = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (refreshToken) {
      const tokenHash = hashRefreshToken(refreshToken);

      await pool.query(
        `UPDATE refresh_tokens
         SET revoked_at = NOW()
         WHERE token_hash = $1
           AND revoked_at IS NULL`,
        [tokenHash],
      );
    }

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/api/auth",
    });

    return res.json({ message: "Çıkış yapıldı." });
  } catch (error) {
    console.error("Çıkış hatası:", error.message);
    return res.status(500).json({ message: "Çıkış yapılamadı." });
  }
};

module.exports = { login, register, refreshSession, logout };
