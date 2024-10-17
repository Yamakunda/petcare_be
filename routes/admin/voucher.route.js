const express = require("express");
const controller = require("../../controllers/voucher.controller");
const router = express.Router();
const auth_middleware = require("../../middleware/auth.middleware");
const verify_middleware = require("../../middleware/verifyRole.middleware");

router.post("/add", auth_middleware.requireAuth,verify_middleware.verifyRole("admin"), controller.createVoucher);
router.get("/list", auth_middleware.requireAuth,verify_middleware.verifyRole("admin"), controller.getAllVouchers);
router.put("/:id", auth_middleware.requireAuth,verify_middleware.verifyRole("admin"), controller.updateVoucher); 
router.get("/:id", auth_middleware.requireAuth,verify_middleware.verifyRole("admin"), controller.getVouchertById);
router.delete("/:id",auth_middleware.requireAuth,verify_middleware.verifyRole("admin"), controller.deleteVoucher);
router.get("/code/:code", auth_middleware.requireAuth,verify_middleware.verifyRole("admin","user"),controller.getVoucherByCode);
module.exports = router;