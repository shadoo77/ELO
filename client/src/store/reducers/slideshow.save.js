import update from "immutability-helper";
import { actionTypes } from "../actions/slideshow.save";
import { answerTypes } from "../../services/config";

export const DEFAULT_STATE = {
  isPending: false,
  hasFailed: false,
  errormessage: "",
  typeFeedback: answerTypes.CORRECT,
  showFeedback: false,
  resetFeedback: false
};

const slideshowInteractionsReducer = (
  state = DEFAULT_STATE,
  action
) => {
  switch (action.type) {
    case actionTypes.SAVING_INTERACTION_INIT:
      return update(state, {
        isPending: {
          $set: true
        },
        hasFailed: {
          $set: false
        }
      });
    case actionTypes.SAVING_INTERACTION_SUCCESS:
      return update(state, {
        isPending: {
          $set: false
        },
        hasFailed: {
          $set: false
        },
        typeFeedback: {
          $set: action.isCorrect
            ? answerTypes.CORRECT
            : answerTypes.WRONG
        },
        showFeedback: {
          $set: true
        }
      });
    case actionTypes.SAVING_INTERACTION_ERROR:
      return update(state, {
        isPending: {
          $set: false
        },
        hasFailed: {
          $set: true
        },
        errormessage: {
          $set: action.errormessage
        }
      });
    case actionTypes.SAVING_HIDE_FEEDBACK:
      return update(state, {
        typeFeedback: {
          $set: ""
        },
        showFeedback: {
          $set: false
        },
        resetFeedback: { $set: true }
      });
    default:
      return state;
  }
};

export default slideshowInteractionsReducer;
