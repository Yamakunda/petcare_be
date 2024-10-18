const express = require("express");
const controller = require("../../controllers/account.controller");
const router = express.Router();
const auth_middleware = require("../../middleware/auth.middleware");
const verify_middleware = require("../../middleware/verifyRole.middleware");

router.post("/create", controller.createAccount);
router.put("/", auth_middleware.requireAuth,verify_middleware.verifyRole("user","admin"), controller.updateAccount); 
router.delete("/:id", controller.deleteAccount);
router.post("/changepass", auth_middleware.requireAuth,verify_middleware.verifyRole("user","admin"), controller.changePassword);
router.post("/forgotpass", controller.forgotPassword);
module.exports = router;