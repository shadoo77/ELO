import update from "immutability-helper";
import { actionTypes } from "../actions/slideshows";

export const DEFAULT_STATE = {
  data: {
    isLoading: false,
    hasFailed: false,
    errormessage: "",
    items: []
  },
  ui: {
    saving: { slideshow: null, slide: null },
    active: {
      slideshow: null,
      slide: null
    },
    fade: { slideshow: false, slide: false }
  }
};

const slideshowsFetchReducer = (state = DEFAULT_STATE, action) => {
  switch (action.type) {
    case actionTypes.FETCHING_SLIDESHOWS_INIT:
      return update(state, {
        data: {
          isLoading: { $set: true },
          hasFailed: { $set: false }
        }
      });
    case actionTypes.FETCHING_SLIDESHOWS_SUCCESS:
      return update(state, {
        data: {
          isLoading: { $set: false },
          hasFailed: { $set: false },
          items: { $set: action.results }
        }
      });
    case actionTypes.FETCHING_SLIDESHOWS_ERROR:
      return update(state, {
        data: {
          isLoading: { $set: false },
          hasFailed: { $set: true },
          errormessage: { $set: action.errormessage }
        }
      });
    default:
      return state;
  }
};

export default slideshowsFetchReducer;
