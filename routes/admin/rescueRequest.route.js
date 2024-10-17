const express = require("express");
const controller = require("../../controllers/rescueRequest.controller");
const router = express.Router();
const auth_middleware = require("../../middleware/auth.middleware");
const verify_middleware = require("../../middleware/verifyRole.middleware");

router.post("/add", auth_middleware.requireAuth,verify_middleware.verifyRole("admin"), controller.addRescue);
router.get("/list", auth_middleware.requireAuth,verify_middleware.verifyRole("admin"), controller.getListRescue);
router.put("/:id", auth_middleware.requireAuth,verify_middleware.verifyRole("admin"), controller.updateRescue); 
router.get("/:id", auth_middleware.requireAuth,verify_middleware.verifyRole("admin"), controller.getRescueById);
router.delete("/:id", auth_middleware.requireAuth,verify_middleware.verifyRole("admin"), controller.deleteRescue);
module.exports = router;