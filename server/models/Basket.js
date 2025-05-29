const { Schema, model } = require("mongoose");

const Basket = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  products: [{
    productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    quantity: { type: Number, default: 1, min: 1 }
  }],
  updatedAt: { type: Date, default: Date.now }
});

module.exports = model("Basket", Basket);