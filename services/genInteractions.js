const mongoose = require("mongoose");
const { MultiplechoiceInteraction } = require("../models/slides.interactions.model");
// const { TagInteraction, SlideshowInteraction } = require("../models/~tags.interactions.model");

// Base slide
const baseInteraction = ({ user, depthLevel }) => {
  return {
    user,
    depthLevel
  };
};

// const generateTagInteraction = (interaction, tagdata) => {
//   const data = Object.assign({}, baseInteraction(interaction), tagdata);
//   return new TagInteraction(data);
// };

const generateSlideshowInteraction = (interaction, tagdata) => {
  const data = Object.assign({}, baseInteraction(interaction), tagdata);
  return new SlideshowInteraction(data);
};

const generateMultichoiceSlideInteraction = (interaction, slidedata) => {
  const data = Object.assign({}, baseInteraction(interaction), slidedata);
  return new MultiplechoiceInteraction(data);
};

module.exports = {
  // generateTagInteraction,
  generateSlideshowInteraction,
  generateMultichoiceSlideInteraction
};
