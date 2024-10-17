const express = require("express");
const controller = require("../../controllers/appointment.controller");
const router = express.Router();
const auth_middleware = require("../../middleware/auth.middleware");
const verify_middleware = require("../../middleware/verifyRole.middleware");

router.post("/add", auth_middleware.requireAuth,verify_middleware.verifyRole("admin","doctor"), controller.addAppointment);
router.get("/list", auth_middleware.requireAuth,verify_middleware.verifyRole("admin","doctor"), controller.getListAppointment);
router.put("/:id", auth_middleware.requireAuth,verify_middleware.verifyRole("admin","doctor"), controller.updateAppointment); 
router.get("/:id", auth_middleware.requireAuth,verify_middleware.verifyRole("admin","doctor"), controller.getAppointmentById);
router.delete("/:id", auth_middleware.requireAuth,verify_middleware.verifyRole("admin","doctor"), controller.deleteAppointment);
module.exports = router;