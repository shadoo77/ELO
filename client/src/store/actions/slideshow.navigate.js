export const actionTypes = {
  START_SLIDESHOW: "START_SLIDESHOW",
  PLAY_SLIDE: "PLAY_SLIDE"
};

export const play_slide = slide => {
  return {
    type: actionTypes.PLAY_SLIDE,
    slide
  };
};

export const start_slideshow = (slideshow, slide) => {
  return {
    type: actionTypes.START_SLIDESHOW,
    slideshow,
    slide
  };
};
