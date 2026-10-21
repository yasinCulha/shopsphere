const express = require("express");
const controller = require("../controllers/systemController");
const router = express.Router();

router.get("/health", controller.healthCheck);
router.get("/db-check", controller.databaseCheck);

module.exports = router;
