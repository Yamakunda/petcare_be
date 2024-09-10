const express = require("express");
const controller = require("../../controllers/pet.controller");
const router = express.Router();


router.get("/pet", controller.getAllPets);
module.exports = router;

