var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var answerSchema = new Schema({
  status: {
    type: Number,
    required: true
  },
  content: [
    {
      type: {
        type: Number,
        required: true
      },
      url: { type: String, required: true }
    }
  ]
});

var exerciseSchema = new Schema({
  order: { type: Number, required: true },
  type: { type: Number, required: true },
  name: { type: String, required: false },
  difficulty: { type: Number, required: true },
  feedback: {
    _id: false,
    required: false,
    type: { type: Number, required: false },
    value_wrong: { type: String, required: false },
    value_correct: { type: String, required: false }
  },
  parentNode: {
    type: Schema.Types.ObjectId,
    ref: "node"
  },
  instruction: [
    {
      type: { type: Number, required: true },
      url: { type: String, required: true }
    }
  ],
  answers: [answerSchema]
});

const Answer = mongoose.model("answer", answerSchema);
const Exercise = mongoose.model("exercise", exerciseSchema);
module.exports = { Exercise, Answer };
