const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const statsSchema = new Schema({
  tag: {
    type: Schema.Types.ObjectId,
    ref: "tag",
    index: true,
    required: true
  },
  correct: { type: Number, required: true, default: 0 },
  wrong: { type: Number, required: true, default: 0 },
  attempts: { type: Number, required: false, default: 0 },
  lastCorrect: { type: Number, required: true, default: 0 },
  lastWrong: { type: Number, required: true, default: 0 }
});

const progressOverviewSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "account",
    index: true,
    required: true
  },
  publication: { type: Schema.Types.ObjectId, ref: "tag" },
  themes: [statsSchema] // 10*3
});

const progressThemeSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "account",
    index: true,
    required: true
  },
  parent: {
    type: Schema.Types.ObjectId,
    ref: "tag",
    index: true,
    required: true
  },
  publication: { type: Schema.Types.ObjectId, ref: "tag" },
  difficulty: { type: Number, required: true },
  paragraphs: [statsSchema], // 7*1 =7
  assignments: [statsSchema] // 10*7 = 70
});

// Export
const ProgressOverview = mongoose.model(
  "progress_overview",
  progressOverviewSchema
);
const Progress = mongoose.model("progress_theme", progressThemeSchema);

module.exports = { ProgressOverview, Progress };
