// Импорт модуля jsonwebtoken для работы с JWT
const jwt = require("jsonwebtoken");
// Импорт секретного ключа из конфигурации
const { secret } = require("../config");

// Экспорт middleware функции
module.exports = function (req, res, next) {
  // Проверка метода OPTIONS (для CORS preflight запросов)
  if (req.method === "OPTIONS") {
    next(); // Пропускаем запрос без проверки токена
  }

  try {
    // Получаем токен из заголовка Authorization
    // Формат заголовка: "Bearer <token>"
    const token = req.headers.authorization.split(' ')[1]; // Разделяем строку и берем вторую часть

    // Если токена нет в заголовке
    if (!token) {
      return res.status(403).json({ message: "Пользователь не авторизован" });
    }

    // Верификация токена
    const decodeDate = jwt.verify(token, secret);
    
    // Если верификация успешна - добавляем декодированные данные в запрос
    req.user = decodeDate;
    // Передаем управление следующему middleware
    next();
  } catch (e) {
    // Обработка ошибок (невалидный токен, истек срок действия и т.д.)
    console.log(e);
    return res.status(403).json({ message: "Нет доступа" });
  }
};