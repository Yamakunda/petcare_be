const express = require("express");
const controller = require("../../controllers/otp.controller");
const router = express.Router();
router.post("/verify", controller.verifyOTP);
router.post("/create", controller.createOTP);
module.exports = router;