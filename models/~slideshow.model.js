const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const slideshowSchema = new Schema({
  name: { type: String, required: true },
  parent: {
    type: Schema.Types.ObjectId,
    ref: "tag"
  },
  tag: { type: Schema.Types.ObjectId, ref: "tag" },
  // Content slides
  slides: [{ type: Schema.Types.ObjectId, ref: "slide" }],
  difficulty: { type: Number, required: true },
  shuffle: { type: Boolean, default: false }
});

const Slideshow = mongoose.model("slideshow", slideshowSchema);

module.exports = { Slideshow };
