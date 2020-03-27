const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { interactionSchema } = require("./slides.interactions.model");

const BaseTagInteraction = mongoose.model(
  "interaction_tags",
  interactionSchema
);

const StandardSchema = new Schema({
  percentages: {
    correct: { type: Number },
    wrong: { type: Number },
    progress: { type: Number }
  },
  attempts: { type: Number }
});

// Slideshow Interaction
var slideshowInteractionSchema = new Schema({
  percentages: {
    correct: { type: Number },
    wrong: { type: Number },
    progress: { type: Number }
  },
  attempts: { type: Number },
  parent: { type: Schema.Types.ObjectId, ref: "slideshow" }
});

const SlideshowInteraction = BaseTagInteraction.discriminator(
  "slideshow_interaction",
  slideshowInteractionSchema
);

// Tag Interaction
var TagInteractionSchema = new Schema({
  percentages: {
    correct: { type: Number },
    wrong: { type: Number },
    progress: { type: Number }
  },
  attempts: { type: Number },
  parent: { type: Schema.Types.ObjectId, ref: "tag" }
});

const TagInteraction = BaseTagInteraction.discriminator(
  "tag_interaction",
  TagInteractionSchema
);

module.exports = {
  BaseTagInteraction,
  TagInteraction,
  SlideshowInteraction
};
