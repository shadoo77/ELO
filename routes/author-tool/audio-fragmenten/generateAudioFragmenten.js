// Services
const { alfaContentTypes } = require("../../../services/config");
const createAudioFragment = require("./createAudioFragment");
const { appendErrorsToTextFile } = require("../utils");

module.exports = async (paragraphId, paragrafRef, rows) => {
  try {
    let audioFragmenten = {
      videos: [],
      liedjes: [],
      taalbeats: [],
      audioFragmenten: []
    };
    for (const row of rows) {
      switch (row.vraagtype) {
        case "input video":
          const videoFr = await createAudioFragment(
            paragraphId,
            paragrafRef,
            row,
            alfaContentTypes.FILMPJE
          );
          audioFragmenten.videos.push(videoFr);
          break;
        case "input taalbeat":
          const taalbeatFr = await createAudioFragment(
            paragraphId,
            paragrafRef,
            row,
            alfaContentTypes.TAALBEAT
          );
          audioFragmenten.taalbeats.push(taalbeatFr);
          break;
        case "input liedje":
          const liedjesFr = await createAudioFragment(
            paragraphId,
            paragrafRef,
            row,
            alfaContentTypes.LIEDJE
          );
          audioFragmenten.liedjes.push(liedjesFr);
          break;
        default:
          break;
      }
    }
    return audioFragmenten;
  } catch (error) {
    console.log(error);
    appendErrorsToTextFile(error);
  }
};
