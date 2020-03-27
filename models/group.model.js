var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var groupSchema = new Schema({
  name: String,
  organisation: {
    type: Schema.Types.ObjectId,
    ref: "organisation"
  },
  lessTimes: [
    {
      day: { type: String, required: false },
      start: { type: Date, required: false },
      end: { type: Date, required: false },
      location: { type: String, required: false }
    }
  ],
  isActive: {
    type: Boolean,
    required: true,
    default: true
  },
  teachers: [{ type: Schema.Types.ObjectId, ref: "account" }],
  students: [{ type: Schema.Types.ObjectId, ref: "account" }]
});

const Group = mongoose.model("group", groupSchema);
module.exports = Group;
