const { Schema, model } = require("mongoose");

const User = new Schema({
  password: { type: String, required: true, trim: true },
  firstName: { type: String },
  lastName: { type: String },
  email: { type: String, unique: true, trim: true, required: true },
  registration: { type: Date, default: Date.now },
  lastVisit: { type: Date, default: Date.now },
  status: { type: String, default: "Active" },
});

module.exports = model("User", User);
