const { Schema, model } = require('mongoose');

const User = new Schema({
  name: { type: String, unique: true, required: true },
  email: { type: String, unique: true, required: true },
  phone: { type: String, unique: true, sparse: true },
  password: { type: String, required: true },
  registrationDate: { type: Date, default: Date.now },
  avatar: { type: String },
  roles: [{ type: String, ref: 'Role' }]
});

module.exports = model('User', User);