const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const assignmentSchema = new Schema({
  _id: false,
  tag: { type: Schema.Types.ObjectId, ref: "tag" }, // Slideshow._id
  correct: { type: Number },
  wrong: { type: Number },
  attempts: { type: Number }
});

const paragraphSchema = new Schema({
  _id: false,
  tag: { type: Schema.Types.ObjectId, ref: "tag" }, // Paragraph._id
  correct: { type: Number },
  wrong: { type: Number },
  attempts: { type: Number },
  difficulty: { type: Number, required: true },
  difficultyBridge: { type: Schema.Types.ObjectId, required: true },
  children: [assignmentSchema]
});

const themeSchema = new Schema({
  _id: false,
  tag: { type: Schema.Types.ObjectId, ref: "tag" }, // Thema._id
  correct: { type: Number },
  wrong: { type: Number },
  attempts: { type: Number },
  children: [paragraphSchema]
});

const pubSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "account"
  },
  tag: { type: Schema.Types.ObjectId, ref: "tag" }, // Publication._id
  children: [themeSchema]
});

const StatsModel = mongoose.model("statistics", pubSchema);

module.exports = {
  StatsModel
};
