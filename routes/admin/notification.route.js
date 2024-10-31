const express = require("express");
const controller = require("../../controllers/notification.controller");
const router = express.Router();
const auth_middleware = require("../../middleware/auth.middleware");
const verify_middleware = require("../../middleware/verifyRole.middleware");

router.get("/list/:user_id", auth_middleware.requireAuth,verify_middleware.verifyRole("admin"), controller.getUserListNotifications);
router.get("/user", auth_middleware.requireAuth,verify_middleware.verifyRole("user"), controller.getUserNotifications);
router.post("/add", auth_middleware.requireAuth, controller.createNotification);
// router.put("/:id", controller.updateNotification); 
router.get("/:id", auth_middleware.requireAuth,verify_middleware.verifyRole("user"), controller.getNotificationById);
router.delete("/:id", controller.deleteNotification);
module.exports = router;