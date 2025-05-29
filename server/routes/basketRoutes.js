const Router = require("express");
const router = new Router();
const controller = require("../controller/BasketController");
const authMiddleware = require("../middlewares/authMiddleware");

router.post("/add", authMiddleware, controller.addToBasket);
router.post("/update", authMiddleware, controller.updateBasket);
router.post("/remove", authMiddleware, controller.removeFromBasket);
router.get("/get", authMiddleware, controller.getBasket);

module.exports = router;