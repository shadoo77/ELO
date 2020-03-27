const { DragAndDropSlide } = require("../../../models/slide.model");
// Services
//const { contentTypes } = require("../../../services/config");
const { appendErrorsToTextFile } = require("../utils");

module.exports = async (row, order) => {
  try {
    const question = new DragAndDropSlide({
      name: row.vraagnummer,
      order,
      icon: row.icoon
    });

    await question.save();
    //console.log(`[ Slide ${question.name} is saved! ]`);
    return question._id;
  } catch (error) {
    console.log(error);
    appendErrorsToTextFile(error, `${row.par_niveau}/${row.folder}`);
  }
};
