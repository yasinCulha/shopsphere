const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const adminMiddleware = require("../middlewares/adminMiddleware");
const controller = require("../controllers/adminController");

const router = express.Router();

router.use(authMiddleware, adminMiddleware);
router.get("/dashboard", controller.getDashboard);
router.get("/products", controller.listProducts);
router.post("/products", controller.createProduct);
router.put("/products/:id", controller.updateProduct);
router.delete("/products/:id", controller.deleteProduct);
router.get("/users", controller.listUsers);
router.get("/orders", controller.listOrders);

module.exports = router;
