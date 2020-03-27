const mongoose = require("mongoose");
const db = require("../../../services/db");
const {
  ThemeContent,
  AudioFragment
} = require("../../../models/alfaContent.model");
// Services
const { tagLevels, alfaContentTypes } = require("../../../services/config");
const { getUniqueKeysNames } = require("../utils");
const generateParagraphContent = require("./generateParagraphContent");

module.exports = async fileContent => {
  try {
    // await db.deleteCollection("content_themes");
    // await db.deleteCollection("audiofragmentens");

    const parNiveaus = getUniqueKeysNames(fileContent, "par_niveau");
    const test = parNiveaus.map(el => el.split("."));

    const allThemes = test.map(el => el[0]);
    let uniqueThemes = [...new Set(allThemes)];

    const parNvPerTheme = [];
    uniqueThemes.forEach(tl => {
      const ele = { theme: tl, paras: [] };
      const temp = [];
      parNiveaus.forEach(niv => {
        const ite = niv.split(".");
        if (tl === ite[0]) {
          ele.paras = [...ele.paras, niv];
          temp.push(niv.split("*")[0]);
        }
      });
      const allParagraphs = temp.map(el => el.split("*")[0]);
      ele.allParagraphs = [...new Set(allParagraphs)];
      parNvPerTheme.push(ele);
    });

    let resultArr = [];
    parNvPerTheme.forEach(niv => {
      const ele = {
        theme: niv.theme,
        depthLevel: tagLevels.THEME,
        children: []
      };
      niv.allParagraphs.forEach(para => {
        const sele = {
          value: para,
          depthLevel: tagLevels.PARAGRAPH,
          children: []
        };
        niv.paras.forEach(elpara => {
          const nivElement = {
            paragrafRef: elpara,
            content: [
              { type: alfaContentTypes.FILMPJE, items: [] },
              { type: alfaContentTypes.TAALBEAT, items: [] },
              { type: alfaContentTypes.LIEDJE, items: [] },
              { type: alfaContentTypes.AUDIO_FRAGMENT, items: [] }
            ]
          };
          const ite = elpara.split(".")[1];
          const currPar = para.split(".")[1];
          if (currPar === ite.split("*")[0]) {
            sele.children = [...sele.children, nivElement];
          }
        });
        ele.children = [...ele.children, sele];
      });
      resultArr.push(ele);
    });
    let temm = [];
    for (const item of resultArr) {
      let theme = await ThemeContent.findOne({
        value: `Theme ${item.theme}`,
        depthLevel: tagLevels.THEME
      });
      if (theme) {
        console.log(`Thema${item.theme} is al bestaan!`);
        return;
      }
      const themeId = mongoose.Types.ObjectId();
      const paragraphContent = await generateParagraphContent(
        themeId,
        item.children,
        fileContent
      );

      theme = new ThemeContent({
        _id: themeId,
        value: `Theme ${item.theme}`,
        depthLevel: tagLevels.THEME,
        path: themeId,
        children: paragraphContent
      });
      await theme.save();
      console.log(`Theme [ ${theme.value} ] is created!`);
      temm.push(theme);
    }
    return temm;
  } catch (error) {
    console.log("Hier we go ^^^^^ ", error);
  }
};
