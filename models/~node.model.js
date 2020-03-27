var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var nodeSchema = new Schema({
  name: { type: String, required: true },
  depth: { type: Number, required: true },
  color: { type: String },
  icon: { type: String, required: true },
  ancestors: [
    {
      type: Schema.Types.ObjectId,
      ref: "node"
    }
  ],
  parent: {
    type: Schema.Types.ObjectId,
    ref: "node"
  }
});

const Node = mongoose.model("node", nodeSchema);
module.exports = Node;
