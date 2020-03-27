const db = require("../../services/db");
// Models
const { Tag } = require("../../models/tag.model");
const { ProgressOverview, Progress } = require("../../models/progress.model");
// Services
const { tagLevels } = require("../../services/config");

module.exports = async accounts => {
  try {
    await db.deleteCollection("progress_overviews");
    await db.deleteCollection("progress_themes");
    const genRandom = () => {
      return Math.round(Math.random() * 50);
    };
    const themes = await Tag.find({ __t: tagLevels.THEME });
    if (!themes.length) {
      console.log("No themas found!");
    }
    let skipStudent = "CURS001";
    for (const student of Object.values(accounts.students)) {
      let overview = new ProgressOverview({
        user: student._id,
        publication: themes[0].parent,
        themes: themes.map(theme => ({
          tag: theme,
          correct: student.account.username === skipStudent ? 0 : genRandom(),
          wrong: student.account.username === skipStudent ? 0 : genRandom(),
          attempts: student.account.username === skipStudent ? 0 : genRandom()
        }))
      });
      await overview.save();
      console.log("[Saved empty field overview table : ]", student.name);
      for (const theme of themes) {
        const paragraphs = await Tag.find({
          __t: tagLevels.PARAGRAPH,
          parent: theme
        });
        const assignments = await Tag.find({
          __t: tagLevels.ASSIGNMENT,
          parent: { $in: paragraphs }
        });
        let progress = new Progress({
          user: student._id,
          parent: theme._id,
          difficulty: theme.difficulty,
          publication: theme.parent,
          theme: theme,
          paragraphs: paragraphs.map(paragraph => ({
            tag: paragraph,
            correct: student.account.username === skipStudent ? 0 : genRandom(),
            wrong: student.account.username === skipStudent ? 0 : genRandom(),
            attempts: student.account.username === skipStudent ? 0 : genRandom()
          })),
          assignments: assignments.map(assignment => ({
            tag: assignment,
            correct: student.account.username === skipStudent ? 0 : genRandom(),
            wrong: student.account.username === skipStudent ? 0 : genRandom(),
            attempts: student.account.username === skipStudent ? 0 : genRandom()
          }))
        });
        await progress.save();
        console.log("[Saved empty field details table : ]", student.name);
      }
    }
  } catch (error) {
    console.log(error);
  }
};
