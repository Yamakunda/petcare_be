const express = require("express");
const controller = require("../../controllers/order.controller");
const router = express.Router();
const auth_middleware = require("../../middleware/auth.middleware");
const verify_middleware = require("../../middleware/verifyRole.middleware");

router.post("/add", controller.addOrder);
router.post("/cartToOrder", controller.cartToOrder);

router.get("/list", auth_middleware.requireAuth,verify_middleware.verifyRole("admin"), controller.getAllOrder);
router.get("/:id", auth_middleware.requireAuth,verify_middleware.verifyRole("admin"), controller.getOrderById);
router.get("/list/:id", controller.getListOrder);

router.put("/:id", controller.updateOrder); 
router.delete("/:id", controller.deleteOrder);
router.post("/rebuy/:id", controller.rebuyOrder);
module.exports = router;