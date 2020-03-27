const { MatchingSlide } = require("../../../models/slide.model");
// Services
const {
  genMatchingAnswers,
  genContents,
  genInstrucions,
  appendErrorsToTextFile
} = require("../utils");

module.exports = async (row, order) => {
  try {
    const possibleAnswers = genMatchingAnswers(row);
    const content = genContents(row);
    const instructions = genInstrucions(row);
    const isShuffle = row.shuffle && row.shuffle.trim() === "ja" ? true : false;

    const question = new MatchingSlide({
      name: row.vraagnummer,
      icon: row.icoon,
      order,
      content,
      instructions,
      possibleAnswers,
      shuffleAnswers: isShuffle
    });

    await question.save();
    return question._id;
  } catch (error) {
    console.log(error);
    appendErrorsToTextFile(error, `${row.par_niveau}/${row.folder}`);
  }
};
