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
    details = [...details, slideDetails];
  });

  details.forEach(el => {
    slide.possibleAnswers.forEach(answer => {
      if (el.answerId === answer._id) {
        el.imgSrc = answer.content.values[1].value;
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

export {
  correctOrWrongAttempts,
  numberOfAnswers,
  hasAnswered,
  hasNotAnswerd,
  getQuestionCount,
  slidesDetails,
  getAttempts,
  extractAllSlides,
  getSlideshowsOfParagraf
};
