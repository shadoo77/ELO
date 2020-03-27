import update from "immutability-helper";
import { actionTypes } from "../actions/slideshow.fetch";
import { actionTypes as saveActions } from "../actions/slideshow.save";

export const DEFAULT_STATE = {
  isLoading: false,
  hasFailed: false,
  errormessage: "",
  item: {}
};

const slideshowFetchReducer = (state = DEFAULT_STATE, action) => {
  switch (action.type) {
    case actionTypes.FETCHING_SLIDESHOW_INIT:
      return update(state, {
        isLoading: {
          $set: true
        },
        hasFailed: {
          $set: false
        }
      });
    case actionTypes.FETCHING_SLIDESHOW_SUCCESS:
      return update(state, {
        isLoading: {
          $set: false
        },
        hasFailed: {
          $set: false
        },
        item: {
          $set: action.result
        }
      });
    case actionTypes.FETCHING_SLIDESHOW_ERROR:
      return update(state, {
        isLoading: {
          $set: false
        },
        hasFailed: {
          $set: true
        },
        errormessage: {
          $set: action.errormessage
        }
      });
    case saveActions.SAVING_INTERACTION_SUCCESS:
      return Object.assign({}, state, {
        item: {
          ...state.item,
          slides: state.item.slides.map(slide =>
            slide._id === action.result.slide
              ? {
                  ...slide,
                  interactions: [
                    ...slide.interactions,
                    action.result
                  ]
                }
              : slide
          )
        }
      });
    default:
      return state;
  }
};

export default slideshowFetchReducer;
