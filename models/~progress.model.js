var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var progressSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "user"
  },
  exercise: {
    type: Schema.Types.ObjectId,
    ref: "exercise"
  },
  isCompleted: {
    // Deprecated
    type: Boolean,
    required: true,
    default: false
  },
  correctCounter: {
    // Replacing isCompleted
    type: Number,
    required: true,
    default: 0
  },
  attempts: [
    {
      started: { type: Date, required: false },
      completed: {
        type: Date,
        default: Date.now,
        required: false
      },
      answered: [
        {
          type: Schema.Types.ObjectId,
          ref: "answer",
          required: false
        }
      ],
      status: { type: Number, required: true }
    }
  ]
});

const Progress = mongoose.model("progress", progressSchema);
module.exports = Progress;
