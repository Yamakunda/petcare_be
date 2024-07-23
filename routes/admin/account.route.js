const express = require("express");
const controller = require("../../controllers/account.controller");
const router = express.Router();

router.post("/create", controller.create);
router.get("/getall", controller.getall);
router.get("/getbyfullname/:fullname", controller.getByFullname);

module.exports = router;