// Constants

/* Important: Copy/Pasted to server/router/helpers! */
const mailTemplates = {
  PASSWOR_RESET: "./mail.templates/resetPassword",
  PASSWORD_CHANGED: "./mail.templates/passwordChanged"
};

/* Important: Copy/Pasted to server/router/helpers! */
const userRoles = {
  STUDENT: 0,
  TEACHER: 1,
  ADMIN: 2,
  AUTHOR: 3
};

/* Important: Copy/Pasted to server/router/helpers! */
const tagTypes = {
  BOOK: 0,
  SKILL: 1,
  GRAMMAR: 2
};

const slideTypes = {
  INFO: "info",
  INPUT_WOORDEN: "input_woorden",
  INPUT_ZINNEN: "input_zinnen",
  INPUT_LIEDJE: "input_liedje",
  TAAL_BEAT: "taalbeat",
  MULTICHOICE: "multichoice",
  MATCHING: "matching",
  FLASHCARD: "flashcard",
  DRAG_AND_DROP: "D&D",
  MEMORY_A: "MemoryA",
  MEMORY_B: "MemoryB"
};

/* Important: Copy/Pasted to server/router/helpers! */
const exerciseTypes = {
  MEMORY: 1,
  MULTIPLE_CHOICE: 2,
  MATCHING: 3,
  HOTSPOT: 4
};

/* Important: Copy/Pasted to server/router/helpers! */
const difficultyTypes = {
  BEGINNER: 0,
  INTERMEDIATE: 1,
  ADVANCED: 2
};

const feedbackTypes = {
  BINARY: 0,
  BINARY_MESSAGE: 1,
  SMILIES: 2,
  IN_DETAIL: 3
};

/* Important: Copy/Pasted to server/router/helpers! */
const contentTypes = {
  AUDIO: 0,
  VIDEO: 1,
  IMAGE: 2,
  TEXT: 3,
  AUDIOCOVER: 4, // Audioplayer with background cover image
  QUOTE: 5 // Text with background cover image
};

/* Important: Copy/Pasted to server/router/helpers! */
const answerTypes = {
  WRONG: 0,
  CORRECT: 1,
  SKIPPED: 2
};

/* Important: Copy/Pasted to server/router/helpers! */
const LevelsOfNodeDepth = {
  ROOT: "root",
  ALFA: "alfa",
  PUBLICATION: "PUBLICATION",
  THEME: "THEME",
  DIFFICULTY: "difficulty",
  PARAGRAF: "PARAGRAPH",
  ASSIGNMENT: "ASSIGNMENT",
  SLIDE: "SLIDE"
};

const tagLevels = {
  SLIDE: "SLIDE",
  ASSIGNMENT: "ASSIGNMENT", // Difficulty attr
  PARAGRAPH: "PARAGRAPH",
  THEME: "THEME",
  PUBLICATION: "PUBLICATION",
  ROOT: "ROOT"
};

const alfaContentTypes = {
  FILMPJE: "filmpje",
  LIEDJE: "liedje",
  TAALBEAT: "taalbeat",
  AUDIO_FRAGMENT: "audioFragment"
};

const alfaContentLevels = {
  PARAGRAPH: "PARAGRAPH",
  THEME: "THEME",
  PUBLICATION: "PUBLICATION",
  SUB_PARAGRAPH: "SUB_PARAGRAPH",
  FILMPJE: "filmpje",
  LIEDJE: "liedje",
  TAALBEAT: "taalbeat",
  AUDIO_FRAGMENT: "audioFragment",

  VIDEO_CATEGORY: "VIDEO_CATEGORY",
  TAALBEAT_CATEGORY: "TAALBEAT_CATEGORY",
  LIEDJE_CATEGORY: "LIEDJE_CATEGORY",
  AUDIOFRAGMENT_CATEGORY: "AUDIOFRAGMENT_CATEGORY",

  PAR_VID_CATEGORY: "PAR_VID_CATEGORY",
  PAR_TAALBEAT_CATEGORY: "PAR_TAALBEAT_CATEGORY",
  PAR_LIEDJE_CATEGORY: "PAR_LIEDJE_CATEGORY",
  PAR_AUDFR_CATEGORY: "PAR_AUDFR_CATEGORY"
};

module.exports = {
  mailTemplates,
  userRoles,
  tagTypes,
  slideTypes,
  exerciseTypes,
  difficultyTypes,
  feedbackTypes,
  contentTypes,
  answerTypes,
  LevelsOfNodeDepth,
  tagLevels,
  alfaContentTypes,
  alfaContentLevels
};
