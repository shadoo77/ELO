const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { slideTypes } = require("../services/config");
const discriminator = "_interaction";

const interactionSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "account"
  },
  slide: {
    type: Schema.Types.ObjectId,
    ref: "slide"
  },
  submit_time: {
    type: Date,
    default: Date.now,
    required: true
  }
});

const Interaction = mongoose.model("interaction_slide", interactionSchema);

// InfoSlide Interaction
var InfoInteractionSchema = new Schema({
  isAccepted: Boolean
});

const InfoInteraction = Interaction.discriminator(
  slideTypes.INFO + discriminator,
  InfoInteractionSchema
);

// MultipleChoice Interaction
var MultipleChoiceInteractionSchema = new Schema({
  start_time: { type: Date, required: false },
  answered: [mongoose.Schema.Types.ObjectId],
  isAccepted: Boolean
});

const MultipleChoiceInteraction = Interaction.discriminator(
  slideTypes.MULTICHOICE + discriminator,
  MultipleChoiceInteractionSchema
);

// Matching Interaction
var MatchingInteractionSchema = new Schema({
  start_time: { type: Date, required: false },
  answered: [[mongoose.Schema.Types.ObjectId, mongoose.Schema.Types.ObjectId]],
  isAccepted: Boolean
});

const MatchingInteraction = Interaction.discriminator(
  slideTypes.MATCHING + discriminator,
  MatchingInteractionSchema
);

// Flashcard Interaction
var FlashcardInteractionSchema = new Schema({
  start_time: { type: Date, required: false },
  duration: Number
});

const FlashcardInteraction = Interaction.discriminator(
  slideTypes.FLASHCARD + discriminator,
  FlashcardInteractionSchema
);

module.exports = {
  Interaction,
  InfoInteraction,
  MultipleChoiceInteraction,
  FlashcardInteraction,
  MatchingInteraction
};
