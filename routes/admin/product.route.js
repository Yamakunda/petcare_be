const express = require("express");
const controller = require("../../controllers/product.controller");
const router = express.Router();

router.post("/add", controller.addProduct);
router.get("/list", controller.getListProduct);
router.put("/:id", controller.updateProduct); 
router.get("/:id", controller.getProductById);

module.exports = router;