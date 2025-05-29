const Basket = require("../models/Basket");

class BasketController {
  async addToBasket(req, res) {
    try {
      const { productId, quantity = 1 } = req.body;
      const userId = req.user.id;

      let basket = await Basket.findOne({ userId });
      if (!basket) {
        basket = new Basket({ userId, products: [] });
      }

      const productIndex = basket.products.findIndex(p => p.productId.toString() === productId);
      if (productIndex >= 0) {
        basket.products[productIndex].quantity += quantity;
      } else {
        basket.products.push({ productId, quantity });
      }

      basket.updatedAt = new Date();
      await basket.save();

      res.status(200).json({ message: "Товар добавлен в корзину", basket });
    } catch (e) {
      console.error("Ошибка addToBasket:", e);
      res.status(400).json({ error: "Ошибка при добавлении в корзину" });
    }
  }

  async updateBasket(req, res) {
    try {
      const { productId, quantity } = req.body;
      const userId = req.user.id;

      const basket = await Basket.findOne({ userId });
      if (!basket) {
        return res.status(404).json({ error: "Корзина не найдена" });
      }

      const productIndex = basket.products.findIndex(p => p.productId.toString() === productId);
      if (productIndex < 0) {
        return res.status(404).json({ error: "Товар не найден в корзине" });
      }

      if (quantity <= 0) {
        basket.products.splice(productIndex, 1);
      } else {
        basket.products[productIndex].quantity = quantity;
      }

      basket.updatedAt = new Date();
      await basket.save();

      res.status(200).json({ message: "Корзина обновлена", basket });
    } catch (e) {
      console.error("Ошибка updateBasket:", e);
      res.status(400).json({ error: "Ошибка при обновлении корзины" });
    }
  }

  async removeFromBasket(req, res) {
    try {
      const { productId } = req.body;
      const userId = req.user.id;

      const basket = await Basket.findOne({ userId });
      if (!basket) {
        return res.status(404).json({ error: "Корзина не найдена" });
      }

      basket.products = basket.products.filter(p => p.productId.toString() !== productId);
      basket.updatedAt = new Date();
      await basket.save();

      res.status(200).json({ message: "Товар удален из корзины", basket });
    } catch (e) {
      console.error("Ошибка removeFromBasket:", e);
      res.status(400).json({ error: "Ошибка при удалении из корзины" });
    }
  }

  async getBasket(req, res) {
    try {
      const userId = req.user.id;
      const basket = await Basket.findOne({ userId }).populate("products.productId");
      res.status(200).json(basket || { userId, products: [] });
    } catch (e) {
      console.error("Ошибка getBasket:", e);
      res.status(500).json({ error: "Ошибка при получении корзины" });
    }
  }
}

module.exports = new BasketController();