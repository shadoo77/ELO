const { TaalbeatSlide } = require("../../../models/slide.model");
// Services
//const { contentTypes } = require("../../../services/config");
// Utils
const {
  genContents,
  genInstrucions,
  appendErrorsToTextFile
} = require("../utils");

module.exports = async (row, order) => {
  try {
    const content = genContents(row);
    const instructions = genInstrucions(row);

    const question = new TaalbeatSlide({
      name: row.vraagnummer,
      order,
      icon: row.icoon,
      instructions,
      content
    });

    await question.save();
    //console.log(`[ Slide ${question.name} is saved! ]`);
    return question._id;
  } catch (error) {
    console.log(error);
    appendErrorsToTextFile(error, `${row.par_niveau}/${row.folder}`);
  }
};
