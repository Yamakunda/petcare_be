const express = require("express");
const controller = require("../../controllers/order.controller");
const router = express.Router();

router.post("/add", controller.addOrder);
router.post("/cartToOrder", controller.cartToOrder);
router.get("/list", controller.getAllOrder);
router.get("/list/:id", controller.getListOrder);
router.put("/:id", controller.updateOrder); 
router.get("/:id", controller.getOrderById);
router.delete("/:id", controller.deleteOrder);
router.post("/rebuy/:id", controller.rebuyOrder);
module.exports = router;