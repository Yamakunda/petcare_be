const express = require("express");
const controller = require("../../controllers/cart.controller");
const router = express.Router();

router.post("/update", controller.updateCart);
router.get("/:user_id", controller.getCart);
module.exports = router;