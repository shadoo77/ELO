const mongoose = require("mongoose");
//const db = require("../../../services/db");
const { AudioFragment } = require("../../../models/alfaContent.model");
// Services
const { alfaContentTypes } = require("../../../services/config");
const { appendErrorsToTextFile } = require("../utils");

module.exports = async (paragraphId, paragrafRef, row, type) => {
  try {
    let newAudioFragment = new AudioFragment({
      _id: mongoose.Types.ObjectId(),
      paragraphId,
      paragrafRef,
      type
    });
    switch (type) {
      case alfaContentTypes.FILMPJE:
        newAudioFragment.src = row.content_video || "";
        break;
      case alfaContentTypes.TAALBEAT:
        newAudioFragment.src = row.content_audio || "EMPTY";
        newAudioFragment.description = row.content_audio_descr || "";
        break;
      case alfaContentTypes.LIEDJE:
        if (row.icoon === "kijken") {
          newAudioFragment.src = row.content_video || "";
        } else {
          newAudioFragment.src = row.content_audio || "";
          newAudioFragment.description = row.content_audio_descr || "";
        }
        break;
    }
    await newAudioFragment.save();
    return newAudioFragment._id;
  } catch (error) {
    console.log(paragrafRef, " ==== type ====== ", type, error);
    appendErrorsToTextFile(error, `${row.par_niveau}/${row.folder}`);
  }
};
