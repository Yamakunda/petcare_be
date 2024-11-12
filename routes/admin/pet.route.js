const express = require("express");
const controller = require("../../controllers/pet.controller");
const router = express.Router();
const auth_middleware = require("../../middleware/auth.middleware");
const verify_middleware = require("../../middleware/verifyRole.middleware");

router.post("/add", auth_middleware.requireAuth,verify_middleware.verifyRole("admin"), controller.addPet);
router.get("/admin/list", auth_middleware.requireAuth,verify_middleware.verifyRole("admin"), controller.getListPet);
router.get("/list", controller.getListPet);
router.put("/:id", auth_middleware.requireAuth,verify_middleware.verifyRole("admin","user"), controller.updatePet); 
router.get("/:id", controller.getPetById);
router.delete("/:id", auth_middleware.requireAuth,verify_middleware.verifyRole("admin"), controller.deletePet);
module.exports = router;
