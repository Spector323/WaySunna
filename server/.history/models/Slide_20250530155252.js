const { Schema, model } = require("mongoose");

const Slide = new Schema({
  title: { type: String, required: true },
  description: { type: String },
  buttonText: { type: String },
  isVideo: { type: Boolean, default: false },
  srcUrl: { type: String, },
  registrationDate: { type: Date, default: Date.now },
});

module.exports = model("Slide", Slide);