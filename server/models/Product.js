const { Schema, model } = require("mongoose");

const Product = new Schema({
  name: { type: String, required: true },
  image: [{ type: String }],
  price: { type: Number,default: 0, required: true },
  description: { type: String },
  oldPrice: { type: Number },
  category: { type: String, },
  discount: { type: Number, default: 0 },
  type: { type: String, enum: ['promotion', 'catalog', 'discount'], required: true }, // Добавляем поле type
  registrationDate: { type: Date, default: Date.now },
});

module.exports = model("Product", Product);