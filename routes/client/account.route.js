const express = require("express");
const controller = require("../../controllers/account.controller");
const router = express.Router();
router.post("/create", controller.createAccount);
router.put("/:id", controller.updateAccount); 
router.delete("/:id", controller.deleteAccount);
router.post("/changepass/:id", controller.changePassword);
router.post("/forgotpass", controller.forgotPassword);
module.exports = router;