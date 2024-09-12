const express = require("express");
const controller = require("../../controllers/pet.controller");
const router = express.Router();

router.post("/add", controller.addPet);
router.get("/list", controller.getListPet);
router.put("/:id", controller.updatePet); 
router.get("/:id", controller.getPetById);
router.delete("/:id", controller.deletePet);
module.exports = router;