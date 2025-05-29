const Favorite = require("../models/Favorite");

class favoriteController {
  async addToFavorites(req, res) {
    try {
      const { productId } = req.body;
      const userId = req.user.id; // Из authMiddleware

      const existingFavorite = await Favorite.findOne({ userId, productId });
      if (existingFavorite) {
        return res.status(400).json({ message: "Товар уже в избранном" });
      }

      const favorite = new Favorite({ userId, productId });
      await favorite.save();

      res.status(200).json({ message: "Товар добавлен в избранное", favorite });
    } catch (e) {
      console.error("Ошибка addToFavorites:", e);
      res.status(400).json({ message: "Ошибка при добавлении в избранное" });
    }
  }

  async removeFromFavorites(req, res) {
    try {
      const { productId } = req.body;
      const userId = req.user.id;

      const favorite = await Favorite.findOneAndDelete({ userId, productId });
      if (!favorite) {
        return res.status(404).json({ message: "Товар не найден в избранном" });
      }

      res.status(200).json({ message: "Товар удален из избранного" });
    } catch (e) {
      console.error("Ошибка removeFromFavorites:", e);
      res.status(400).json({ message: "Ошибка при удалении из избранного" });
    }
  }

  async getFavorites(req, res) {
    try {
      const userId = req.user.id;
      const favorites = await Favorite.find({ userId }).populate("productId");
      res.status(200).json(favorites.map(f => f.productId));
    } catch (e) {
      console.error("Ошибка getFavorites:", e);
      res.status(400).json({ message: "Ошибка при получении избранного" });
    }
  }
}

module.exports = new favoriteController();