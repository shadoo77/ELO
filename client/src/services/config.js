const apiUrl = "/api";
const bucketUrl = "https://kr-bucket-public-files.s3.amazonaws.com";

const baseUrls = {
  student: "/student",
  teacher: "/teacher",
  author: "/author",
  admin: "/admin",
  content: "/"
};

const routeUrls = {
  student: {
    default: `${baseUrls.student}/browse/publication/5ce26f814d65de88b425f250`,
    auth: {
      login: `${baseUrls.student}/login`,
      logout: `${baseUrls.student}/logout`
    },
    browse: {
      tag: `${baseUrls.student}/browse`,
      publication: `${baseUrls.student}/browse/publication`,
      theme: `${baseUrls.student}/browse/theme`,
      paragraph: `${baseUrls.student}/browse/paragraph`,
      assignment: `${baseUrls.student}/browse/assignment`
    }
  },
  teacher: {
    default: `${baseUrls.teacher}/group/overview`,
    auth: {
      login: `${baseUrls.teacher}/login`,
      logout: `${baseUrls.teacher}/logout`
    },
    group: {
      overview: `${baseUrls.teacher}/group/overview`,
      detail: `${baseUrls.teacher}/group`,
      add: `${baseUrls.teacher}/group/add`,
      edit: `${baseUrls.teacher}/edit/group`,
      statistics: `${baseUrls.teacher}/statistics`
    },
    student: {
      add: `${baseUrls.teacher}/student/add`,
      edit: `${baseUrls.teacher}/student/edit`,
      status: `${baseUrls.teacher}/student/status`
    },
    alfaContents: `${baseUrls.teacher}/alfaContents`
  },
  author: { default: `${baseUrls.author}/home` },
  admin: {
    default: `${baseUrls.admin}`,
    auth: {
      register: `/register`,
      login: `/login`,
      logout: `/logout`,
      forgotpassword: `/forgotpassword`
    }
  }
};

/* Important: Copy/Pasted to server/router/helpers! */
const userRoles = {
  STUDENT: 0,
  TEACHER: 1,
  ADMIN: 2,
  AUTHOR: 3
};

const everyone = [
  userRoles.ADMIN,
  userRoles.AUTHOR,
  userRoles.TEACHER,
  userRoles.STUDENT
];

const organisation = [userRoles.ADMIN, userRoles.TEACHER, userRoles.STUDENT];

const classroom = [userRoles.TEACHER, userRoles.STUDENT];

const teachers = [userRoles.TEACHER];
const students = [userRoles.STUDENT];
const authors = [userRoles.AUTHOR];
const admin = [userRoles.ADMIN];

const accessibleBy = {
  EVERYONE: everyone,
  ORGANISATION: organisation,
  CLASSROOM: classroom,
  TEACHERS: teachers,
  STUDENTS: students,
  AUTHORS: authors,
  ADMIN: admin
};

const slideTypes = {
  INFO: "info",
  MULTICHOICE: "multichoice",
  MATCHING: "matching",
  FLASHCARD: "input_woorden",
  INPUT_WOORDEN: "input_woorden",
  INPUT_ZINNEN: "input_zinnen",
  TAALBEAT: "taalbeat",
  MEMORY: "memory"
};

const playerStates = {
  IDLING: "IDLING",
  TRANSITIONING: "TRANSITIONING"
};

const slideStates = {
  AWAITING_INPUT: "AWAITING_INPUT",
  GRADING_INPUT: "GRADING_INPUT",
  DISPLAYING_FEEDBACK: "DISPLAYING_FEEDBACK",
  OUT_OF_FOCUS: "OUT_OF_FOCUS"
};

const contentTypes = {
  AUDIO: 0,
  VIDEO: 1,
  IMAGE: 2,
  TEXT: 3,
  AUDIOCOVER: 4, // Audioplayer with background cover image
  QUOTE: 5 // Text with background cover image
};

// TODO: Do we still need these?

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

/* Important: Copy/Pasted to server/router/helpers! */
const feedbackTypes = {
  BINARY: 0,
  BINARY_MESSAGE: 1,
  SMILIES: 2,
  IN_DETAIL: 3
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
  DIFFICULTY: "DIFFICULTY",
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

export {
  apiUrl,
  bucketUrl,
  slideTypes,
  baseUrls,
  playerStates,
  routeUrls,
  accessibleBy,
  userRoles,
  exerciseTypes,
  difficultyTypes,
  feedbackTypes,
  contentTypes,
  answerTypes,
  LevelsOfNodeDepth,
  tagLevels,
  slideStates,
  alfaContentTypes,
  alfaContentLevels
};
