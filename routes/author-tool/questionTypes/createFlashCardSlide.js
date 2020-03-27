const {
  MultichoiceSlide,
  MatchingSlide,
  InfoSlide,
  FlashcardSlide
} = require("../../../models/slide.model");
// Services
const {
  tagTypes,
  contentTypes,
  tagLevels,
  slideTypes
} = require("../../../services/config");
const { appendErrorsToTextFile } = require("../utils");

module.exports = async (row, order) => {
  try {
    const question = { vraagType: "FlashCard Slide ^~^", icon: row.icoon };

    return question;
  } catch (error) {
    console.log(error);
    appendErrorsToTextFile(error, `${row.par_niveau}/${row.folder}`);
  }
};
