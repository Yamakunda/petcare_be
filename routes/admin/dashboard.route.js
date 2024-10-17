const express = require("express");
const controller = require("../../controllers/dashboard.controller");
const router = express.Router();
const auth_middleware = require("../../middleware/auth.middleware");
const verify_middleware = require("../../middleware/verifyRole.middleware");

router.get("/", auth_middleware.requireAuth,verify_middleware.verifyRole("admin"), controller.getDashboard);

module.exports = router;