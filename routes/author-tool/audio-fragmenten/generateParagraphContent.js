const mongoose = require("mongoose");
const generateAudioFragmenten = require("./generateAudioFragmenten");
// Services
const {
  alfaContentTypes,
  alfaContentLevels
} = require("../../../services/config");

module.exports = async (themeId, paragraphs, fileContent) => {
  try {
    for (const paragraph of paragraphs) {
      const paragraphId = mongoose.Types.ObjectId();
      paragraph._id = paragraphId;
      paragraph.path = `${themeId}#${paragraphId}`;
      let resArr = [];
      for (const para of paragraph.children) {
        const subParaId = mongoose.Types.ObjectId();
        const dataRowsOfNiveau = fileContent.filter(
          el => el.par_niveau === para.paragrafRef
        );
        const {
          videos,
          liedjes,
          taalbeats,
          audioFragmenten
        } = await generateAudioFragmenten(
          subParaId,
          para.paragrafRef,
          dataRowsOfNiveau
        );
        para._id = subParaId;
        para.path = `${themeId}#${paragraphId}#${subParaId}`;
        para.depthLevel = alfaContentLevels.SUB_PARAGRAPH;
        para.content.forEach(el => {
          el.items =
            el.type === alfaContentTypes.FILMPJE
              ? videos
              : el.type === alfaContentTypes.TAALBEAT
              ? taalbeats
              : el.type === alfaContentTypes.LIEDJE
              ? liedjes
              : audioFragmenten;
        });
        resArr.push(para);
      }
      paragraph.children = resArr;
    }
    return paragraphs;
  } catch (error) {
    console.log("Hier we go ^^^^^ ", error);
  }
};
