const express = require("express");
const controller = require("../controllers/productsController");
const router = express.Router();

router.get("/", controller.listProducts);
router.get("/search", controller.searchProducts);
router.get("/:id", controller.getProductById);
router.get("/category/:category", controller.listProductsByCategory);

module.exports = router;
