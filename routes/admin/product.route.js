const express = require("express");
const controller = require("../../controllers/product.controller");
const router = express.Router();
const auth_middleware = require("../../middleware/auth.middleware");
const verify_middleware = require("../../middleware/verifyRole.middleware");

router.post("/add", auth_middleware.requireAuth,verify_middleware.verifyRole("admin"), controller.addProduct);
router.get("/list", controller.getListProductUser);
router.get("/listFilter", controller.getListProductFilter);
router.get("/intro", controller.getProductIntro);
router.get("/admin/list", auth_middleware.requireAuth,verify_middleware.verifyRole("admin"), controller.getListProduct);
router.put("/:id", auth_middleware.requireAuth,verify_middleware.verifyRole("admin"), controller.updateProduct); 
router.get("/:id", controller.getProductById);
router.delete("/:id", auth_middleware.requireAuth,verify_middleware.verifyRole("admin"), controller.deleteProduct);
router.get("/searchProductByName/:name", controller.searchProductByName);

module.exports = router;