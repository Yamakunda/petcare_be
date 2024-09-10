const express = require("express");
const controller = require("../../controllers/pet.controller");
const router = express.Router();
router.post("/createpet", controller.createPet);
module.exports = router;


