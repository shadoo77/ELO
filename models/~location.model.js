var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var locationSchema = new Schema({
  address: {
    street: { type: String, required: false },
    houseNr: { type: String, required: false }
  },
  postcode: { type: String, required: false },
  city: { type: String, required: true, default: "LOCATIE" },
  country: { type: String, required: true, default: "Nederland" },
  organisation: { type: Schema.Types.ObjectId, ref: "organisation" }
});

const Location = mongoose.model("location", locationSchema);
module.exports = Location;
