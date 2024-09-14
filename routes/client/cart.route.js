const express = require("express");
const controller = require("../../controllers/cart.controller");
const router = express.Router();

router.post("/update", controller.updateCart);
module.exports = router;