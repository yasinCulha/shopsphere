"use strict";

const pool = require("../config/db");

const healthCheck = (req, res) => {
  res.json({ message: "ShopShere backend calisiyor" });
};

const databaseCheck = async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");

    res.json({
      message: "NEon Veri Tabanina Baglandi",
      databaseTime: result.rows[0].now,
    });
  } catch (error) {
    console.log("veri tabani baglantisi" + error);
    res.status(500).json({ message: "veri tabanina baglanilamadi " });
  }
};

module.exports = { healthCheck, databaseCheck };
