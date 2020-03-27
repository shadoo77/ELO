export const findFirstInteractableSlide = (slideshow) => {
  return (
    slideshow.slides.find((slide) => {
      return (
        slide.interactions.length === 0
        // ||        !slide.interactions.some((interaction) => interaction.isAccepted)
      );
    }) || slideshow.slides[0]
  );
};

export const activeSlideIndex = (slideshow, activeSlide) => {
  return slideshow.slides.findIndex((slide) => slide._id === activeSlide._id);
};

// export const findLastAnswered = (slide) => {
//   return slide.interactions.length >= 1
//     ? slide.interactions[slide.interactions.length - 1].answered
//     : [];
// };

export const findLastInteraction = (slide) => {
  return slide.interactions.length >= 1
    ? slide.interactions[slide.interactions.length - 1]
    : {};
};

export const isAnswerAccepted = (interaction) => {
  return interaction.hasOwnProperty("isAccepted")
    ? interaction.isAccepted
    : "Unknown";
};
