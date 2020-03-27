const { MultichoiceSlide } = require("../../../models/slide.model");
const mongoose = require("mongoose");
// Services
//const { contentTypes } = require("../../../services/config");
const {
  genPossibleAnswers,
  genContents,
  genInstrucions,
  appendErrorsToTextFile
} = require("../utils");

module.exports = async (row, order) => {
  try {
    const correctAnswersArr = row.correct_antwoord.toString().split(",");
    const correctAnswers = correctAnswersArr.map(el => ({
      answersNr: el,
      answerId: mongoose.Types.ObjectId()
    }));
    let correctAnswerIds = correctAnswers.map(el => el.answerId);
    const possibleAnswers = genPossibleAnswers(row, correctAnswers);
    const content = genContents(row);
    const instructions = genInstrucions(row);
    const isShuffle = row.shuffle.trim() === "ja" ? true : false;

    const question = new MultichoiceSlide({
      name: row.vraagnummer,
      order,
      icon: row.icoon,
      content,
      instructions,
      possibleAnswers,
      correctAnswers: correctAnswerIds,
      shuffleAnswers: isShuffle
    });

    await question.save();
    //console.log(`[ Slide ${question.name} is saved! ]`);

    return question._id;
  } catch (error) {
    console.log(error);
    appendErrorsToTextFile(error, `${row.par_niveau}/${row.folder}`);
  }
};
