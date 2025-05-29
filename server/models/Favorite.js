const { Schema, model } = require("mongoose");

const Favorite = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
  addedAt: { type: Date, default: Date.now }
});

module.exports = model("Favorite", Favorite);