const { Schema, model } = require("mongoose");

const Product = new Schema({
  name: { type: String, required: true },
  images: [{ type: String }],
  price: { type: Number, required: true },
  description: { type: String },
  category: { type: String, },
  type: { type: String, enum: ['promotion', 'catalog', 'discount'], required: true }, // Добавляем поле type
  registrationDate: { type: Date, default: Date.now },
});

module.exports = model("Product", Product);