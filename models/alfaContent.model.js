const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const audioFragmentSchema = new Schema({
  _id: { type: Schema.Types.ObjectId, required: true },
  paragraphId: { type: Schema.Types.ObjectId, required: true },
  paragrafRef: { type: String, required: true },
  type: { type: String, required: true },
  src: { type: String, required: true },
  description: {
    type: String,
    required: false
  }
});

const AudioFragment = mongoose.model("audiofragmenten", audioFragmentSchema);

const contentFolderSchema = new Schema({
  _id: { type: Schema.Types.ObjectId, required: true },
  paragrafRef: { type: String, required: true },
  path: { type: String, required: true },
  depthLevel: { type: String, required: true },
  content: [
    {
      type: { type: String, required: true },
      items: [{ type: Schema.Types.ObjectId, ref: "audiofragmenten" }]
    }
  ]
});

const paragraphContentSchema = new Schema({
  _id: { type: Schema.Types.ObjectId, required: true },
  value: { type: String, required: true },
  path: { type: String, required: true },
  depthLevel: { type: String, required: true },
  children: [contentFolderSchema]
});

const themeContentSchema = new Schema({
  value: { type: String, required: true },
  path: { type: String, required: true },
  depthLevel: { type: String, required: true },
  children: [paragraphContentSchema]
});

const ThemeContent = mongoose.model("content_theme", themeContentSchema);

module.exports = { ThemeContent, AudioFragment };
