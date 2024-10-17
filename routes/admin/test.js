const express = require("express");
const controller = require("../../controllers/consolelog.controller");
const router = express.Router();

router.post("/", controller.log);

module.exports = router;