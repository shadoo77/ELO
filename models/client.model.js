const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const clientsSchema = new Schema({
  client: {
    type: Schema.Types.ObjectId,
    ref: "account",
    required: true
  },
  ip: { type: String, required: true },
  sessionStart: {
    type: Date,
    required: true,
    default: Date.now // UTC time @see: https://docs.mongodb.com/manual/tutorial/model-time-data/
  }
});

const Client = mongoose.model("client", clientsSchema);

module.exports = Client;
