const express = require("express");
const controller = require("../../controllers/news.controller");
const router = express.Router();

router.post("/add", controller.addNews);
router.get("/list", controller.getListNews);
router.put("/:id", controller.updateNews); 
router.get("/:id", controller.getNewsById);
router.delete("/:id", controller.deleteNews);
module.exports = router;