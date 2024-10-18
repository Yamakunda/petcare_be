const express = require("express");
const controller = require("../../controllers/order.controller");
const router = express.Router();
const auth_middleware = require("../../middleware/auth.middleware");
const verify_middleware = require("../../middleware/verifyRole.middleware");

router.post("/add", controller.addOrder);
router.post("/cartToOrder", auth_middleware.requireAuth,verify_middleware.verifyRole("user"), controller.cartToOrder);
router.get("/list", auth_middleware.requireAuth,verify_middleware.verifyRole("admin"), controller.getAllOrder);
router.get("/:id", auth_middleware.requireAuth,verify_middleware.verifyRole("admin"), controller.getOrderById);
router.get("/listUser", auth_middleware.requireAuth,verify_middleware.verifyRole("user"), controller.getListOrder);
router.put("/:id", auth_middleware.requireAuth,verify_middleware.verifyRole("admin"), controller.updateOrder); 
router.delete("/:id", auth_middleware.requireAuth,verify_middleware.verifyRole("user"), controller.deleteOrder);
router.post("/rebuy/:id", auth_middleware.requireAuth,verify_middleware.verifyRole("user"), controller.rebuyOrder);
module.exports = router;