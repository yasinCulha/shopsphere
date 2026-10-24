const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const controller = require("../controllers/accountController");

const router = express.Router();

router.use(authMiddleware);
router.get("/profile", controller.getProfile);
router.patch("/profile", controller.updateProfile);
router.get("/addresses", controller.getAddresses);
router.post("/addresses", controller.createAddress);
router.put("/addresses/:id", controller.updateAddress);
router.delete("/addresses/:id", controller.deleteAddress);
router.get("/orders", controller.getOrders);

module.exports = router;
