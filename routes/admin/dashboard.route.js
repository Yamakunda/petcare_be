const express = require("express");
const controller = require("../../controllers/dashboard.controller");
const router = express.Router();
const auth_middleware = require("../../middleware/auth.middleware");
const verify_middleware = require("../../middleware/verifyRole.middleware");

router.get("/count", auth_middleware.requireAuth,verify_middleware.verifyRole("admin"), controller.getDashboard);
router.get("/graph/order", auth_middleware.requireAuth,verify_middleware.verifyRole("admin"), controller.getGraphOrderData);
router.get("/graph/appointment", auth_middleware.requireAuth,verify_middleware.verifyRole("admin"), controller.getGraphAppointmentData);
router.get("/graph/adopt", auth_middleware.requireAuth,verify_middleware.verifyRole("admin"), controller.getGraphPetData);
router.get("/graph/rescue", auth_middleware.requireAuth,verify_middleware.verifyRole("admin"), controller.getGraphRescueRequestData);
router.get("/graph/revenue", auth_middleware.requireAuth,verify_middleware.verifyRole("admin"), controller.getGraphRevenueData);
module.exports = router;