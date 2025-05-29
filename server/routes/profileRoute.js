const Router = require("express");
const router = new Router();
const controller = require("../controller/authController");
const authMiddleware = require("../middlewares/authMiddleware");

router.get("/getProfile", authMiddleware, controller.profile);
module.exports = router;