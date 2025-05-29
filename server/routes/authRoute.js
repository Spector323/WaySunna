const Router = require("express");
const router = new Router();
const controller = require("../controller/authController");
const { check } = require("express-validator");
const authMiddleware = require("../middlewares/authMiddleware");
const upload = require("../middlewares/upload");

router.post(
  "/registration",
  upload.single("avatar"),
  [
    check("name", "Имя пользователя не может быть пустым").trim().notEmpty(),
    check("email", "Некорректный email").isEmail(),
    check("password", "Пароль должен быть от 6 до 10 символов").isLength({ min: 6, max: 10 })
  ],
  controller.registration
);

router.post("/login", controller.login);

router.get("/users", authMiddleware, controller.getUsers);

router.get('/profile', authMiddleware, controller.profile);

router.post('/updateProfile', authMiddleware, upload.single('avatar'), controller.updateProfile);

router.delete('/deleteProfile', authMiddleware, controller.deleteProfile);
module.exports = router;