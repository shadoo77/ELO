const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { slideTypes } = require("../services/config");
const discrimExt = "_interaction";

// Base slide
const interactionSchema = new Schema({
  // TODO: Where to place version control when slide changes?
  slide: {
    type: Schema.Types.ObjectId,
    ref: "slide"
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "account"
  },
  start_time: { type: Date, required: false },
  submit_time: {
    type: Date,
    default: Date.now,
    required: true
  },
  isAccepted: Boolean
});

const Interaction = mongoose.model(
  "interaction",
  interactionSchema
);

// Multiplechoice Interaction
var multiplechoiceInteractionSchema = new Schema({
  answered: [String]
});

const MultiplechoiceInteraction = Interaction.discriminator(
  slideTypes.MULTICHOICE + discrimExt,
  multiplechoiceInteractionSchema
);

module.exports = {
  Interaction,
  MultiplechoiceInteraction
};
