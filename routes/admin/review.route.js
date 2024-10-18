const express = require("express");
const controller = require("../../controllers/review.controller");
const router = express.Router();
const auth_middleware = require("../../middleware/auth.middleware");
const verify_middleware = require("../../middleware/verifyRole.middleware");

router.post("/add", auth_middleware.requireAuth,verify_middleware.verifyRole("user","admin"), controller.addReview);
router.get("/:id", controller.getReviewById);
router.put("/:reviewId", auth_middleware.requireAuth,verify_middleware.verifyRole("user","admin"), controller.updateReview);
router.delete("/:reviewId", auth_middleware.requireAuth,verify_middleware.verifyRole("user","admin"), controller.deleteReview);
module.exports = router;

