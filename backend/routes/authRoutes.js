const express = require("express");
const controller = require("../controllers/authController");
const router = express.Router();

router.post("/auth/login", controller.login);
router.post("/admin/login", controller.adminLogin);
router.post("/register", controller.register);
router.post("/auth/refresh", controller.refreshSession);
router.post("/auth/logout", controller.logout);

module.exports = router;
