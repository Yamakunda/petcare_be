const express = require("express");
const controller = require("../../controllers/adopt.controller");


const router = express.Router();

router.post("/add", controller.addAdopt);
router.get("/list", controller.getListAdopt);
router.put("/:id", controller.updateAdopt); 
router.get("/:id", controller.getAdoptById);
router.delete("/:id", controller.deleteAdopt);
module.exports = router;