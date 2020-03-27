const { Tag, Assignment } = require("../../models/tag.model");
// Services
const { tagTypes, tagLevels } = require("../../services/config");
const generateQuestions = require("./generateQuestions");
const { appendErrorsToTextFile } = require("./utils");

module.exports = async (niveau, paragraph, assignmentNames, rowsOfNiveau) => {
  try {
    let assCount = 0;
    let assignmentOrder = 0;
    for (const assignmentName of assignmentNames) {
      assignmentOrder += 1;
      const questionsData = rowsOfNiveau.filter(
        row => row.folder === assignmentName
      );
      assCount += 1;
      //const questions = await generateQuestions(questionsData);

      // Generate Assignments tags
      let assignment = await Tag.findOne({
        value: assignmentName,
        __t: tagLevels.ASSIGNMENT,
        parent: paragraph,
        difficulty: paragraph.difficulty
      });
      if (!assignment) {
        assignment = new Assignment({
          value: assignmentName,
          icon: assignmentName,
          depthLevel: tagLevels.ASSIGNMENT,
          type: tagTypes.BOOK,
          root: paragraph.root,
          color: paragraph.color,
          parent: paragraph._id,
          slides: await generateQuestions(niveau, questionsData),
          difficulty: paragraph.difficulty,
          order: assignmentOrder
        });
        await assignment.save();
        console.log(
          `Assignment [ ${assignment.value} ] / (${paragraph.icon}) is created!`
        );
      }
    }
    return assCount;
  } catch (error) {
    console.log("Assignments :::: ", error);
    appendErrorsToTextFile(error, niveau);
  }
};
