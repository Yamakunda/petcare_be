const express = require("express");
const controller = require("../../controllers/service.controller");
const router = express.Router();
const auth_middleware = require("../../middleware/auth.middleware");
const verify_middleware = require("../../middleware/verifyRole.middleware");

router.post("/add", auth_middleware.requireAuth,verify_middleware.verifyRole("admin"), controller.addService);
router.get("/list", controller.getListService);
router.get("/admin/list", auth_middleware.requireAuth,verify_middleware.verifyRole("admin", "doctor"), controller.getListService);
router.put("/:id", auth_middleware.requireAuth,verify_middleware.verifyRole("admin"), controller.updateService); 
router.get("/:id", auth_middleware.requireAuth,verify_middleware.verifyRole("admin", "doctor"), controller.getServiceById);
router.delete("/:id", auth_middleware.requireAuth,verify_middleware.verifyRole("admin"), controller.deleteService);

module.exports = router;