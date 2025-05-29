const Router = require("express");
const router = new Router();
const controller = require("../controller/favoriteController");
const authMiddleware = require("../middlewares/authMiddleware");

router.post("/add", authMiddleware, controller.addToFavorites);
router.post("/remove", authMiddleware, controller.removeFromFavorites);
router.get("/get", authMiddleware, controller.getFavorites);

module.exports = router;