const express = require("express");
const controller = require("../../controllers/account.controller");
const router = express.Router();
router.put("/:id", controller.updateAccount); 

module.exports = router;