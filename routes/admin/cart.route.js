const express = require("express");
const controller = require("../../controllers/cart.controller");
const router = express.Router();
const auth_middleware = require("../../middleware/auth.middleware");
const verify_middleware = require("../../middleware/verifyRole.middleware");

router.post("/addProduct", auth_middleware.requireAuth,verify_middleware.verifyRole("user"), controller.addProductToCart);
router.get("", auth_middleware.requireAuth,verify_middleware.verifyRole("user"), controller.getCart);
router.post("/update", auth_middleware.requireAuth,verify_middleware.verifyRole("user"), controller.adjustProductQuantity);
router.post("/selectProduct", auth_middleware.requireAuth,verify_middleware.verifyRole("user"), controller.selectProduct);
router.delete("/deleteProduct", auth_middleware.requireAuth,verify_middleware.verifyRole("user"), controller.deleteProductFromCart);
router.get("/count",auth_middleware.requireAuth,verify_middleware.verifyRole("user"), controller.countProductInCart);
module.exports = router;