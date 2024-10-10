const express = require("express");
const controller = require("../../controllers/cart.controller");
const router = express.Router();

router.post("/addProduct", controller.addProductToCart);
router.delete("/deleteProduct", controller.deleteProductFromCart);
router.get("/:user_id", controller.getCart);
router.post("/update", controller.adjustProductQuantity);
router.post("/delete/:user_id", controller.deleteAllItemsFromCart);
module.exports = router;