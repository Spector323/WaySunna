const Router = require("express");
const router = new Router();
const controller = require("../controller/productController");
const authMiddleware = require("../middlewares/authMiddleware");
const upload = require("../middlewares/upload");

router.get("/getProducts", controller.getProducts);
router.get("/getProduct/:id", controller.getProduct);
router.post("/addProduct", authMiddleware, upload.single("image"), controller.addProduct); // Изменено на single
router.patch("/changeProduct/:id", authMiddleware, upload.single("image"), controller.changeProduct); // Изменено на single
router.delete("/deleteProduct/:id", authMiddleware, controller.deleteProduct);

module.exports = router;