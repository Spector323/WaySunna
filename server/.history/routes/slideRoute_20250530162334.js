const Router = require("express");
const router = new Router();
const controller = require("../controller/slideController");
const authMiddleware = require("../middlewares/authMiddleware");
const upload = require("../middlewares/upload");

router.get("/getSlides", controller.getSlides);
router.get("/getSlide/:id", controller.getSlide);
router.post("/addSlide", upload.single("image"), controller.addSlide);
router.post("/addSlide/video", upload.single("video"), controller.addSlide);
router.patch("/changeSlide/:id", authMiddleware, upload.single("image"), controller.changeSlide);
router.delete("/deleteSlide/:id", authMiddleware, controller.deleteSlide);

module.exports = router;