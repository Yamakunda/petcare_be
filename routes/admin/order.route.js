const express = require("express");
const controller = require("../../controllers/order.controller");
const router = express.Router();

router.post("/add", controller.addOrder);
router.post("/cartToOrder", controller.cartToOrder);
router.get("/list", controller.getListOrder);
router.put("/:id", controller.updateOrder); 
router.get("/:id", controller.getOrderById);
router.delete("/:id", controller.deleteOrder);
module.exports = router;