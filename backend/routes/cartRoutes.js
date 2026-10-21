const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const controller = require("../controllers/cartController");

const router = express.Router();

router.get("/", authMiddleware, controller.getCart);
router.post("/", authMiddleware, controller.addToCart);
router.patch("/:productId", authMiddleware, controller.updateCartQuantity);
router.delete("/:productId", authMiddleware, controller.removeFromCart);

module.exports = router;
