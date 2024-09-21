const express = require("express");
const controller = require("../../controllers/appointment.controller");
const router = express.Router();

router.post("/add", controller.addAppointment);
router.get("/list", controller.getListAppointment);
router.put("/:id", controller.updateAppointment); 
router.get("/:id", controller.getAppointmentById);
router.delete("/:id", controller.deleteAppointment);
module.exports = router;