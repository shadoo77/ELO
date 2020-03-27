const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { slideTypes } = require("./../services/config");

// Instruction schema
const contentCollectionSchema = new Schema({
  _id: { type: Schema.Types.ObjectId },
  type: { type: Number, required: true },

  items: [
    {
      _id: { type: Schema.Types.ObjectId },
      type: { type: Number, required: true },
      value: { type: String, required: true },
      description: {
        type: String,
        required: false
      }
    }
  ]
});

// Base slide
const slideSchema = new Schema({
  name: String,
  order: Number,
  icon: { type: String, required: true }
  // tagged: [
  //   {
  //     type: Schema.Types.ObjectId,
  //     ref: "tag"
  //   }
  // ]
});

// Placeholder for interactions that won't be persisted in db
slideSchema
  .virtual("interactions")
  .get(function() {
    return this.interactions;
  })
  .set(function(val) {
    this.interactions = val;
  });

const Slide = mongoose.model("slide", slideSchema);

// Info slide
const infoSchema = new Schema({
  content: [contentCollectionSchema],
  instructions: [contentCollectionSchema]
});

const InfoSlide = Slide.discriminator(slideTypes.INFO, infoSchema);

// Input woorden slide
const inputWoordenSchema = new Schema({
  content: [contentCollectionSchema],
  instructions: [contentCollectionSchema]
});
const InputWoordenSlide = Slide.discriminator(
  slideTypes.INPUT_WOORDEN,
  inputWoordenSchema
);

// Input zinnen slide
const inputZinnenSchema = new Schema({
  content: [contentCollectionSchema],
  instructions: [contentCollectionSchema]
});
const InputZinnennSlide = Slide.discriminator(
  slideTypes.INPUT_ZINNEN,
  inputZinnenSchema
);

// Input liedje slide
const inputLiedjeSchema = new Schema({
  content: [contentCollectionSchema],
  instructions: [contentCollectionSchema]
});
const InputLiedjeSlide = Slide.discriminator(
  slideTypes.INPUT_LIEDJE,
  inputLiedjeSchema
);

// Input woorden slide
const taalbeatSchema = new Schema({
  content: [contentCollectionSchema],
  instructions: [contentCollectionSchema]
});

const TaalbeatSlide = Slide.discriminator(slideTypes.TAAL_BEAT, taalbeatSchema);

// Matching slide
const matchingSchema = new Schema({
  content: [contentCollectionSchema],
  instructions: [contentCollectionSchema],
  possibleAnswers: [contentCollectionSchema],
  shuffleAnswers: { type: Boolean, default: false }
});

const MatchingSlide = Slide.discriminator(slideTypes.MATCHING, matchingSchema);

// drag and drop slide
const dragAndDropSchema = new Schema({});
const DragAndDropSlide = Slide.discriminator(
  slideTypes.DRAG_AND_DROP,
  dragAndDropSchema
);

// MemoryA slide
const memoryASchema = new Schema({});
const MemoryASlide = Slide.discriminator(slideTypes.MEMORY_A, memoryASchema);

// MemoryB slide
const memoryBSchema = new Schema({});
const MemoryBSlide = Slide.discriminator(slideTypes.MEMORY_B, memoryBSchema);

// Multiplechoice question slide
var multichoiceSchema = new Schema({
  content: [contentCollectionSchema],
  instructions: [contentCollectionSchema],
  possibleAnswers: [contentCollectionSchema],
  correctAnswers: [{ type: Schema.Types.ObjectId, required: true }],
  shuffleAnswers: { type: Boolean, default: false }
});

const MultichoiceSlide = Slide.discriminator(
  slideTypes.MULTICHOICE,
  multichoiceSchema
);

// Flashcard slide
var flashcardSchema = new Schema({
  card: {
    content: {
      // PLAINAUDIO, PLAINIMAGE, AUDIOCOVER, ..
      type: { type: Number, required: true },
      values: [
        {
          type: { type: Number, required: true },
          value: { type: String, required: true }
        }
      ]
    }
  }
});

const FlashcardSlide = Slide.discriminator(
  slideTypes.FLASHCARD,
  flashcardSchema
);

module.exports = {
  Slide,
  MatchingSlide,
  InfoSlide,
  InputWoordenSlide,
  InputZinnennSlide,
  InputLiedjeSlide,
  TaalbeatSlide,
  MultichoiceSlide,
  FlashcardSlide,
  DragAndDropSlide,
  MemoryASlide,
  MemoryBSlide
};
