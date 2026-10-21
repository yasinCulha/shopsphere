"use strict";

const pool = require("../config/db");

const listProducts = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT
        id,
        title,
        description,
        category,
        price,
        discount_percentage AS "discountPercentage",
        rating,
        stock,
        thumbnail,
        images
      FROM products
      ORDER BY id`,
    );
    const products = result.rows.map((row) => ({
      ...row,
      id: Number(row.id),
      price: Number(row.price),
      discountPercentage: Number(row.discountPercentage),
      rating: Number(row.rating),
      reviews: [],
    }));
    res.json({
      products,
      total: result.rowCount,
      skip: 0,
      limit: result.rowCount,
    });
  } catch (error) {
    console.error("Ürünler alınamadı:", error.message);
    res.status(500).json({ message: "Ürünler alınamadı." });
  }
};

const searchProducts = async (req, res) => {
  try {
    const query = String(req.query.q || "").trim();
    if (!query) {
      return res.status(400).json({ message: "Arama Metni Giriniz" });
    }
    const result = await pool.query(
      `SELECT
        id,
        title,
        description,
        category,
        price,
        discount_percentage AS "discountPercentage",
        rating,
        stock,
        thumbnail,
        images
      FROM products
      WHERE title ILIKE $1 OR description ILIKE $1 OR category ILIKE $1
        order by id `,
      [`%${query}%`],
    );

    res.json({
      products: result.rows,
      total: result.rowCount,
      skip: 0,
      limit: result.rowCount,
    });
  } catch (error) {
    console.error("Ürün araması yapılamadı:", error.message);
    res.status(500).json({ message: "Ürün araması yapılamadı." });
  }
};

const getProductById = async (req, res) => {
  try {
    const productId = Number(req.params.id);
    if (!Number.isInteger(productId) || productId <= 0) {
      return res.status(400).json({ message: "Gecersiz urun ID'si" });
    }
    const result = await pool.query(
      `SELECT
        id,
        title,
        description,
        category,
        price,
        discount_percentage AS "discountPercentage",
        rating,
        stock,
        thumbnail,
        images
      FROM products
      where id = $1`,
      [productId],
    );
    if (result.rows.length === 0) {
      return res.status(400).json({ message: "urun bulunamdi" });
    }
    const row = result.rows[0];

    res.json({
      ...row,
      id: Number(row.id),
      price: Number(row.price),
      discountPercentage: Number(row.discountPercentage),
      rating: Number(row.rating),
      reviews: [],
    });
  } catch (error) {
    console.error("Ürünler alınamadı:", error.message);
    res.status(500).json({ message: "Ürünler alınamadı." });
  }
};

const listProductsByCategory = async (req, res) => {
  try {
    const category = req.params.category;
    const result = await pool.query(
      `SELECT
        id,
        title,
        description,
        category,
        price,
        discount_percentage AS "discountPercentage",
        rating,
        stock,
        thumbnail,
        images
      FROM products
      where category = $1
      ORDER BY id `,
      [category],
    );

    res.json({
      products: result.rows,
      total: result.rowCount,
      skip: 0,
      limit: result.rowCount,
    });
  } catch (error) {
    console.error("kategori Ürünler alınamadı:", error.message);
    res.status(500).json({ message: "kategori Ürünler alınamadı." });
  }
};

module.exports = { listProducts, searchProducts, getProductById, listProductsByCategory };
