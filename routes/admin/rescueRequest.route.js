const express = require("express");
const controller = require("../../controllers/rescueRequest.controller");
const router = express.Router();

router.post("/add", controller.addRescue);
router.get("/list", controller.getListRescue);
router.put("/:id", controller.updateRescue); 
router.get("/:id", controller.getRescueById);
router.delete("/:id", controller.deleteRescue);
module.exports = router;