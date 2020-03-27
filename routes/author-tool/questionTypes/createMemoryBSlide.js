const { MemoryBSlide } = require("../../../models/slide.model");
// Services
//const { contentTypes } = require("../../../services/config");
const { appendErrorsToTextFile } = require("../utils");

module.exports = async (row, order) => {
  try {
    console.log(".....", row.icoon);
    const question = new MemoryBSlide({
      name: row.vraagnummer,
      icon: typeof row.icoon === "undefined" ? "memory" : row.icoon,
      order
    });

    await question.save();
    //console.log(`[ Slide ${question.name} is saved! ]`);
    return question._id;
  } catch (error) {
    console.log(error);
    appendErrorsToTextFile(error, `${row.par_niveau}/${row.folder}`);
  }
};
