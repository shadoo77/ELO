const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const Schema = mongoose.Schema;

const resetPasswordSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "account" },
  token: { type: String, required: true },
  expires: { type: Date, required: true }
});

const ResetPassword = mongoose.model("reset-password", resetPasswordSchema);
module.exports = ResetPassword;
