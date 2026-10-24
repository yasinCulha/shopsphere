const express = require("express");
const requireAuth = require("../middlewares/authMiddleware");
const controller = require("../controllers/favoritesController");

const router = express.Router();

router.get("/", requireAuth, controller.getFavorites);
router.post("/:productId", requireAuth, controller.addToFavorites);
router.delete("/:productId", requireAuth, controller.removeFavorites);

module.exports = router;
