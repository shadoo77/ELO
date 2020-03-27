import update from "immutability-helper";
import { actionTypes } from "../actions/slideshow.navigate";

export const DEFAULT_STATE = {
  slideshow: null,
  slide: null
};

const slideshowNavigateReducer = (
  state = DEFAULT_STATE,
  action
) => {
  switch (action.type) {
    case actionTypes.START_SLIDESHOW:
      return update(state, {
        slideshow: {
          $set: action.slideshow
        },
        slide: {
          $set: action.slide
        }
      });
    case actionTypes.PLAY_SLIDE:
      return update(state, {
        slide: {
          $set: action.slide
        }
      });
    default:
      return state;
  }
};

export default slideshowNavigateReducer;
