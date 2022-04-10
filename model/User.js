const { Schema, model } = require("mongoose");

const User = new Schema({
  username: { type: String, unique: true, trim: true, required: true },
  password: { type: String, required: true, trim: true },
  firstName: { type: String },
  lastName: { type: String },
  email: { type: String, required: true },
  registration: { type: Date, default: Date.now },
  lastVisit: { type: Date, default: Date.now },
  status: { type: String, default: "active" },
});

module.exports = model("User", User);
