const express = require("express");
const controller = require("../../controllers/payment.controller");
const router = express.Router();
const auth_middleware = require("../../middleware/auth.middleware");
const verify_middleware = require("../../middleware/verifyRole.middleware");

router.post("/ZALO", controller.paymentZalo);
router.post("/callbackZALO", controller.callbackZalo);
router.post("/order_status/:app_trans_id", controller.orderStatusZalo);
router.post("/check_order_status/:app_trans_id", controller.checkOrderStatusZalo);
router.post("/refundZALO", controller.refundZalo);
// router.post("/MOMO",controller.paymentMOMO)
// router.post("/callback", controller.callback)
// router.post("/transactionStatusMOMO", controller.transactionStatusMOMO)
module.exports = router;