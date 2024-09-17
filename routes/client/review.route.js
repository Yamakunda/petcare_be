const express = require("express");
const controller = require("../../controllers/review.controller");
const router = express.Router();

router.post("/add", controller.addReview);
router.get("/:id", controller.getReviewById);
router.put("/:reviewId", controller.updateReview);
module.exports = router;

