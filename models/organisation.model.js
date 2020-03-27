var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var organisationSchema = new Schema({
  name: { type: String, index: true },
  teachers: [
    {
      type: Schema.Types.ObjectId,
      ref: "accountSchema"
    }
  ]
});

const Organisation = mongoose.model("organisation", organisationSchema);
module.exports = Organisation;
