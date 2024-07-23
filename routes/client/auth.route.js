const express = require("express");
const controller = require("../../controllers/auth.controller");
const router = express.Router();
//thêm requireAuth vào các route cần xác thực
const auth_middleware = require("../../middleware/auth.middleware");

router.post("/signup", controller.signup);
router.post("/login", controller.login);
router.get("/post",auth_middleware.requireAuth, controller.post);
module.exports = router;