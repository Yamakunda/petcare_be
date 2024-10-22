const express = require("express");
const controller = require("../../controllers/payment.controller");
const router = express.Router();
const auth_middleware = require("../../middleware/auth.middleware");
const verify_middleware = require("../../middleware/verifyRole.middleware");

router.post("MOMO/",controller.collectionLinkMOMO)
router.post("/callback", controller.callback)
router.post("/transactionStatusMOMO", controller.transactionStatusMOMO)
module.exports = router;