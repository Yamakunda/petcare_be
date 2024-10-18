const express = require("express");
const controller = require("../../controllers/auth.controller");
const router = express.Router();
//thêm requireAuth vào các route cần xác thực
const auth_middleware = require("../../middleware/auth.middleware");
const verify_middleware = require("../../middleware/verifyRole.middleware");
const verifyJWT = require("../../middleware/auth.middleware");
router.post("/signup", controller.signup);
router.post("/login", controller.login);
router.post("/logout", auth_middleware.requireAuth, controller.logout);
router.get("/refreshtoken", controller.handleRefreshToken);
router.get("/test", verifyJWT.requireAuth,verify_middleware.verifyRole("user"), (req,res)=>{res.send("Hello")});
router.get("/post",auth_middleware.requireAuth, controller.post);
//xai verifyJWT.requireAuth,verify_middleware.verifyRole cho route nao can xac thuc
module.exports = router;