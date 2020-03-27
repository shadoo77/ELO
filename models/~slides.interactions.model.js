const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { slideTypes } = require("../services/config");
const discrimExt = "_interaction";

// Base slide
const interactionSchema = new Schema({
  // TODO: Where to place version control when slide changes?
  user: {
    type: Schema.Types.ObjectId,
    ref: "account"
  },
  depthLevel: {
    // Use values from tagLevels in config.js
    type: String,
    required: true
  },
  submit_time: {
    type: Date,
    default: Date.now,
    required: true
  }
});

const Interaction = mongoose.model("interaction_slide", interactionSchema);

// Multiplechoice Interaction
var multiplechoiceInteractionSchema = new Schema({
  start_time: { type: Date, required: false }, // Memory?
  answered: [String],
  isAccepted: Boolean
});

const MultiplechoiceInteraction = Interaction.discriminator(slideTypes.MULTICHOICE + discrimExt, multiplechoiceInteractionSchema);

// Matching Interaction
var MatchingInteractionSchema = new Schema({
  // TODO: !!!
});

const MatchingInteraction = Interaction.discriminator(slideTypes.MATCHING + discrimExt, MatchingInteractionSchema);

module.exports = {
  Interaction,
  // TagInteraction,
  MultiplechoiceInteraction,
  interactionSchema
};
