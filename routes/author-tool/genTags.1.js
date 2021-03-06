//const { validateNewThema } = require("../../validations/author");
const mongoose = require("mongoose");
//const db = require("../../services/db");
const {
  Tag,
  Publication,
  Theme,
  Paragraph
} = require("../../models/tag.model");
// Services
const { tagTypes, tagLevels } = require("../../services/config");
const { getUniqueKeysNames } = require("./utils");
const generateAssignments = require("./generateAssignments");

const themesNames = [
  "Kennismaken",
  "School",
  "Eten & Drinken",
  "Gezondheid",
  "Kleding",
  "Wonen",
  "Vrije tijd",
  "Reizen",
  "Werk",
  "Kinderen"
];

const themesColors = [
  "148, 15, 115", // Donker paars
  "13, 140, 17", // Donker groen?
  "69, 136, 245", // Licht blauw?
  "252, 179, 238",
  "181, 7, 7",
  "11, 68, 143",
  "245, 154, 69", // Oranje
  "255, 229, 36",
  "211, 104, 247", // Donker blauw
  "148, 237, 64"
];

module.exports = async fileContent => {
  try {
    // await db.deleteCollection("tags");
    // await db.deleteCollection("slides");
    let rootTree = await Tag.findOne({
      value: "AlfaRoot"
    });
    if (!rootTree) {
      rootTree = new Tag({
        _id: "5ce26f814d65de88b425f24f",
        depthLevel: tagLevels.ROOT,
        value: "AlfaRoot",
        type: tagTypes.BOOK,
        difficulty: 0
      });
      await rootTree.save();
      console.log(`Root [ ${rootTree.value} ] is created!`);
    }

    let tree = await Tag.findOne({
      __t: tagLevels.PUBLICATION,
      parent: rootTree
    });
    if (!tree) {
      tree = new Publication({
        _id: "5ce26f814d65de88b425f250",
        value: "Alfa",
        depthLevel: tagLevels.PUBLICATION,
        type: tagTypes.BOOK,
        root: rootTree._id,
        icon: "book-open",
        color: "95,95,95",
        parent: rootTree,
        route: "alfa",
        difficulty: 0
      });
      await tree.save();
      console.log(`Tree [ ${tree.value} ] is created!`);
    }

    const parNiveaus = getUniqueKeysNames(fileContent, "par_niveau");
    // const temp1 = parNiveaus.map(el => el.split(".")[0]);
    // const temp2 = parNiveaus.map(el => el.split(".")[1]);
    // const yy = temp1.filter((item, index) => {
    //   return temp1.indexOf(item) === index;
    // });
    // const rr = temp2.filter((item, index) => {
    //   return temp2.indexOf(item) === index;
    // });

    const test = parNiveaus.map(el => el.split("."));
    const rrr = test.map(el => {
      const para = el[1].split("*")[0];
      const diff = el[1].match(/\*/g).length;
      return { theme: el[0], para, diff: Number(diff - 1) };
    });

    let resArr = [];
    rrr.forEach(item => {
      const i = resArr.findIndex(
        x => x.theme == item.theme && x.diff === item.diff
      );
      if (i <= -1) {
        resArr.push({
          theme: item.theme,
          diff: item.diff,
          paragraphs: [item.para]
        });
      } else {
        resArr[i].paragraphs = [...resArr[i].paragraphs, item.para];
      }
    });
    console.log(resArr);

    //console.log(rr);
    let compareVal = 0;
    let bridgeId = mongoose.Types.ObjectId();

    let allAss = 0;
    //let themeOrder = 0;
    for (const niveau of parNiveaus) {
      //   order += 1;
      //   const temp = niveau.split(".");
      //   const themeIndex = temp[0];
      //   if (compareVal !== themeIndex) {
      //     compareVal = themeIndex;
      //     bridgeId = mongoose.Types.ObjectId();
      //   }
      //   const themeName = themesNames[themeIndex - 1];
      //   const paragraphName = temp[1].split("*")[0];
      //   const difficultyLevel = [...niveau].filter(el => el === "*").length - 1;
      // Generate Themes tags
      //   let theme = await Tag.findOne({
      //     value: themeName,
      //     __t: tagLevels.THEME,
      //     difficulty: difficultyLevel
      //   });
      //   if (!theme) {
      //     theme = new Theme({
      //       value: themeName,
      //       depthLevel: tagLevels.THEME,
      //       type: tagTypes.BOOK,
      //       root: rootTree._id,
      //       icon: themeName,
      //       color: themesColors[themeIndex - 1],
      //       parent: tree._id,
      //       difficulty: difficultyLevel,
      //       //order: themeOrder,
      //       bridgeId: bridgeId
      //     });
      //     await theme.save();
      //     console.log(`Theme [ ${theme.value} ] is created!`);
      //   }
      // Generate Paragraphs tags
      //   let paragraph = await Tag.findOne({
      //     value: paragraphName,
      //     __t: tagLevels.PARAGRAPH,
      //     parent: theme,
      //     difficulty: difficultyLevel
      //   });
      //   if (!paragraph) {
      //     paragraph = new Paragraph({
      //       value: paragraphName,
      //       depthLevel: tagLevels.PARAGRAPH,
      //       type: tagTypes.BOOK,
      //       root: rootTree._id,
      //       icon: niveau,
      //       color: theme.color,
      //       parent: theme._id,
      //       difficulty: difficultyLevel
      //     });
      //     await paragraph.save();
      //     console.log(
      //       `Paragraph [ ${paragraph.value} ] / (${paragraph.icon}) is created!`
      //     );
      //   }
      //   const contentOfNiveau = fileContent.filter(
      //     el => el.par_niveau === niveau
      //   );
      // Get assignments names when par_niveau is (1.3** e.g)
      //const assignmentsOfNiveau = getUniqueKeysNames(contentOfNiveau, "folder");
      // Generate Assignments tags
      //   const assCount = await generateAssignments(
      //     paragraph,
      //     assignmentsOfNiveau,
      //     contentOfNiveau
      //   );
      //allAss += assCount;
    }
    //console.log("[ Number of assignments ] <><><><><><><><><> ::: ", allAss);
  } catch (error) {
    console.log(error);
  }
};
