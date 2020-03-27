const mongoose = require("mongoose");
const { contentTypes } = require("./config");
const { InfoSlide, MultichoiceSlide } = require("../models/slide.model");

const DEFAULTDESCRIPTION = "No description entered";

// Base slide
const baseSlide = ({ name = "generic base slide", order = 0, tags = [] }) => {
  return {
    name,
    order,
    tagged: tags
  };
};

const infoSlide = (slide, content, instructions) => {
  const data = Object.assign({}, baseSlide(slide), {
    instructions,
    content
  });
  return new InfoSlide(data);
};

const multichoiceSlide = (slide, content, instructions, possibleAnswers, correctAnswers, shuffleAnswers = false) => {
  const answerIds = correctAnswers.map((index) => {
    return possibleAnswers[index]._id;
  });
  const data = Object.assign({}, baseSlide(slide), {
    content,
    instructions,
    possibleAnswers,
    correctAnswers: answerIds,
    shuffleAnswers
  });
  return new MultichoiceSlide(data);
};

const videoContent = (url, description = DEFAULTDESCRIPTION) => {
  return {
    _id: mongoose.Types.ObjectId(),
    type: contentTypes.VIDEO,
    items: [
      {
        _id: mongoose.Types.ObjectId(),
        type: contentTypes.VIDEO,
        value: url,
        description: description
      }
    ],
    description: DEFAULTDESCRIPTION
  };
};

const audioContent = (url, description = DEFAULTDESCRIPTION) => {
  return {
    _id: mongoose.Types.ObjectId(),
    type: contentTypes.AUDIO,
    items: [
      {
        _id: mongoose.Types.ObjectId(),
        type: contentTypes.AUDIO,
        value: url,
        description: description
      }
    ],
    description: DEFAULTDESCRIPTION
  };
};

const imageContent = (url, description = DEFAULTDESCRIPTION) => {
  return {
    _id: mongoose.Types.ObjectId(),
    type: contentTypes.IMAGE,
    items: [
      {
        _id: mongoose.Types.ObjectId(),
        type: contentTypes.IMAGE,
        value: url,
        description: description
      }
    ],
    description: DEFAULTDESCRIPTION
  };
};

const coverContent = (imageUrl, audioUrl, imageDescription = DEFAULTDESCRIPTION, audioDescription = DEFAULTDESCRIPTION) => {
  return {
    _id: mongoose.Types.ObjectId(),
    type: contentTypes.AUDIOCOVER,
    items: [
      {
        _id: mongoose.Types.ObjectId(),
        type: contentTypes.IMAGE,
        value: imageUrl,
        description: imageDescription
      },
      {
        _id: mongoose.Types.ObjectId(),
        type: contentTypes.AUDIO,
        value: audioUrl,
        description: audioDescription
      }
    ],
    description: DEFAULTDESCRIPTION
  };
};

module.exports = {
  infoSlide,
  multichoiceSlide,
  videoContent,
  audioContent,
  imageContent,
  coverContent
};
