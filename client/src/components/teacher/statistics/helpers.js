import { contentTypes } from "services/config";

function correctOrWrongAttempts(slides, status) {
  const interactions = getAttempts(slides);
  return numberOfAnswers(interactions, status);
}

function numberOfAnswers(interactions, status) {
  const answersArrayCount = interactions.filter(
    interaction =>
      interaction.isAccepted === (status === "CORRECT_ANSWERS" ? true : false)
  );
  return answersArrayCount.length;
}

function hasAnswered(slides) {
  const answers = slides.filter(
    slide => slide.interactions && slide.interactions.length
  );
  return answers.length;
}

function hasNotAnswerd(slides) {
  const answers = slides.filter(
    slide => slide.interactions && !slide.interactions.length
  );
  return answers.length;
}

function getQuestionCount(slides) {
  const questionsCount = slides.filter(slide => slide.interactions);
  return questionsCount.length;
}

function getAttempts(slides) {
  const items = slides.filter(
    slide => slide.interactions && slide.interactions.length
  );
  const interactions = items
    .map(el => el.interactions)
    .reduce((a, b) => a.concat(b), []);
  return interactions;
}

function slidesDetails(slide) {
  let details = [];
  slide.interactions.forEach(interaction => {
    const slideDetails = {};
    slideDetails.answerId = interaction.answered[0];
    slideDetails.isAccepted = interaction.isAccepted;
    slideDetails.submitTime = new Date(
      interaction.submit_time
    ).toLocaleString();
    details = [...details, slideDetails];
  });

  details.forEach(el => {
    slide.possibleAnswers.forEach(answer => {
      if (el.answerId === answer._id) {
        answer.items.forEach(item => {
          if (item.type === contentTypes.AUDIO) el.audioSrc = item.value;
          else if (item.type === contentTypes.IMAGE) el.imgSrc = item.value;
        });
      }
    });
  });
  return details;
}

function extractAllSlides(slideshows) {
  const slides = slideshows
    .map(slideshow => slideshow.slides)
    .reduce((a, b) => a.concat(b), []);
  return slides;
}

///// Get slideshows of one paragraf
function getSlideshowsOfParagraf(slideshows, paraId) {
  return slideshows.filter(item => item.entrypoint._id === paraId);
}

////// Get progress and precentages for slideshows interactions
function handleSlideshowsInteractions(slideshows) {
  const interactions = slideshows
    .map(slideshow =>
      slideshow.interactions && slideshow.interactions.length
        ? slideshow.interactions[0]
        : []
    )
    .reduce((a, b) => a.concat(b), []);
  const percentages = interactions
    .map(el => el.percentages)
    .reduce((a, b) => a.concat(b), []);
  const init = {
    progress: 0,
    correct: 0,
    wrong: 0
  };
  // const average = (value, count) => {
  //   const result = value / count;
  //   return Math.round(result);
  // };
  // const reducer = (accu, curr) => {
  //   let progress = accu.progress + curr.progress;
  //   let correct = accu.correct + curr.correct;
  //   let wrong = accu.wrong + curr.wrong;
  //   progress = average(progress, interactions.length);
  //   correct = average(correct, interactions.length);
  //   wrong = average(wrong, interactions.length);
  //   return { progress, correct, wrong };
  // };
  const reducer = (accu, curr) => {
    return {
      progress: accu.progress + curr.progress,
      correct: accu.correct + curr.correct,
      wrong: accu.wrong + curr.wrong
    };
  };
  const obj = percentages.length ? percentages.reduce(reducer) : init;
  return obj;
}

export {
  correctOrWrongAttempts,
  numberOfAnswers,
  hasAnswered,
  hasNotAnswerd,
  getQuestionCount,
  slidesDetails,
  getAttempts,
  extractAllSlides,
  getSlideshowsOfParagraf,
  handleSlideshowsInteractions
};
