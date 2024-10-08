const express = require("express");
const controller = require("../../controllers/voucher.controller");
const router = express.Router();

router.post("/add", controller.createVoucher);
router.get("/list", controller.getAllVouchers);
router.put("/:id", controller.updateVoucher); 
router.get("/:id", controller.getVouchertById);
router.delete("/:id", controller.deleteVoucher);
router.get("/code/:code", controller.getVoucherByCode);
module.exports = router;