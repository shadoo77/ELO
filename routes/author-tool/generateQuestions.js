const { Slide } = require("../../models/slide.model");
// Import questions types
const { appendErrorsToTextFile } = require("./utils");
const createInfoSlide = require("./questionTypes/createInfoSlide");
const createInputWoordenSlide = require("./questionTypes/createInputWoordenSlide");
const createInputZinnenSlide = require("./questionTypes/createInputZinnenSlide");
const createInputLiedjeSlide = require("./questionTypes/createInputLiedjeSlide");
const createTaalbeatSlide = require("./questionTypes/createTaalbeatSlide");
const createMultiChoiceSlide = require("./questionTypes/createMultiChoiceSlide");
const createMatchingSlide = require("./questionTypes/createMatchingSlide");
const createFlashCardSlide = require("./questionTypes/createFlashCardSlide");
const createDragAndDropSlide = require("./questionTypes/createDragAndDropSlide");
const createMemoryASlide = require("./questionTypes/createMemoryASlide");
const createMemoryBSlide = require("./questionTypes/createMemoryBSlide");

module.exports = async (niveau, questionsData) => {
  try {
    let questions = [];
    //for (const row of questionsData) {
    for (const [index, row] of questionsData.entries()) {
      let question = await Slide.findOne({
        name: row.vraagnummer
      });
      if (question) {
        questions.push(question);
      } else {
        switch (row.vraagtype) {
          case "input video":
            question = await createInfoSlide(row, index + 1);
            questions.push(question);
            break;
          case "input woorden":
            question = await createInputWoordenSlide(row, index + 1);
            questions.push(question);
            break;
          case "input zinnen":
            question = await createInputZinnenSlide(row, index + 1);
            questions.push(question);
            break;
          case "input taalbeat":
            question = await createTaalbeatSlide(row, index + 1);
            questions.push(question);
            break;
          case "input liedje":
            question = await createInputLiedjeSlide(row, index + 1);
            questions.push(question);
            break;
          case "MC":
          case "MR":
            question = await createMultiChoiceSlide(row, index + 1);
            questions.push(question);
            break;
          case "Matching":
            question = await createMatchingSlide(row, index + 1);
            questions.push(question);
            break;
          case "D&D":
            question = await createDragAndDropSlide(row, index + 1);
            questions.push(question);
            break;
          case "flashCard":
            question = await createFlashCardSlide(row, index + 1);
            //questions.push(question);
            break;
          case "MemoryA":
            question = await createMemoryASlide(row, index + 1);
            questions.push(question);
            break;
          case "MemoryB":
            question = await createMemoryBSlide(row, index + 1);
            questions.push(question);
            break;
          default:
            console.log(`[ Error : ] Unknown vraagType (${row.vraagtype}) !`);
            break;
          //throw error;
        }
      }
    }
    return questions;
    //return [];
  } catch (error) {
    console.log(error);
    appendErrorsToTextFile(error, niveau);
  }
};
