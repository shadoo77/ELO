const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const bookCodeSchema = new Schema({
  methode: {
    type: String,
    default: "Alfa",
    required: true
  },
  inUseBy: { type: Schema.Types.ObjectId, ref: "account" },
  activatedOn: {
    type: Date,
    default: Date.now,
    required: true
  },
  activatedBy: {
    type: Schema.Types.ObjectId,
    ref: "account"
  },
  account: {
    username: {
      type: String,
      required: true,
      index: { unique: true }
    },
    password: {
      type: String,
      required: true
    }
  }
});

const BookCodeSchema = mongoose.model(
  "bookCode",
  bookCodeSchema
);

module.exports = BookCodeSchema;
