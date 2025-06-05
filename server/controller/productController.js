const Product = require("../models/Product");

class productController {
  async addProduct(req, res) {
    const { name, price, description, discount, type } = req.body;
    console.log('addProduct:', { body: req.body, file: req.file });

    try {
      const candidate = await Product.findOne({ name });
      if (candidate) {
        return res.status(400).json({ message: "Товар с таким названием уже существует" });
      }

      const newProduct = new Product({
        name,
        price: parseFloat(price),
        description,
        discount,
        type,
        image: req.file ? req.file.path : '' // Используем req.file вместо req.files
      });

      await newProduct.save();
      return res.status(200).json({ message: "Товар успешно добавлен", product: newProduct });
    } catch (e) {
      console.error('Ошибка addProduct:', e);
      res.status(400).json({ message: "Ошибка при добавлении товара", error: e.message });
    }
  }

  async getProducts(req, res) {
    try {
      const products = await Product.find();
      res.status(200).json(products);
    } catch (e) {
      console.error('Ошибка getProducts:', e);
      res.status(400).json({ message: "Ошибка при попытке получить весь список товаров" });
    }
  }

  async getProduct(req, res) {
  try {
    let { id } = req.params;
    // Удаляем ObjectId('...') если оно пришло
    if (id.startsWith('ObjectId(')) {
      id = id.replace(/ObjectId\(['"]?/, '').replace(/['"]?\)/, '');
    }
    const product = await Product.findOne({ _id: id });
    if (!product) {
      return res.status(404).json({ message: "Товар не найден" });
    }
    res.status(200).json(product);
  } catch (e) {
    console.error('Ошибка getProduct:', e);
    res.status(400).json({ message: "Ошибка при попытке получить данные товара" });
  }
}

  async changeProduct(req, res) {
  try {
    const { id } = req.params;
    const { name, price, description, discount, type } = req.body;

    // Конвертируем строку в число
    const newPrice = parseFloat(price);

    // Ищем текущий товар
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Товар не найден" });
    }

    // Сохраняем старую цену, если она изменилась
    let updateData = {
      name,
      price: newPrice,
      description,
      type,
      discount
    };

    // Если цена изменилась — сохраняем предыдущую
    if (product.price !== newPrice) {
      updateData.oldPrice = product.price;
    }

    // Если загружено новое изображение
    if (req.file) {
      updateData.image = req.file.path;
    }

    // Обновляем товар
    const updatedProduct = await Product.findByIdAndUpdate(id, updateData, { new: true });
    return res.status(200).json({ message: "Товар успешно изменён", product: updatedProduct });

  } catch (e) {
    console.error('Ошибка changeProduct:', e);
    res.status(400).json({ message: "Ошибка при попытке изменить данные товара" });
  }
}

  async deleteProduct(req, res) {
    try {
      const { id } = req.params;
      const product = await Product.findByIdAndDelete(id);
      if (!product) {
        return res.status(404).json({ message: "Товар не найден" });
      }
      res.status(200).json({ message: "Товар успешно удален" });
    } catch (e) {
      console.error('Ошибка deleteProduct:', e);
      res.status(400).json({ message: "Ошибка при удалении товара" });
    }
  }
}

module.exports = new productController();