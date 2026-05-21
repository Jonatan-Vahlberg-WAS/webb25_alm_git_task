const mongoose = require("mongoose");

const mailSchema = new mongoose.Schema({
  subject: { type: String },
  status: { type: String, enum: ["welcome"] },
  content: { type: String },
  sentAt: { type: Date, default: Date.now },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

module.exports = mongoose.model("Mail", mailSchema);
