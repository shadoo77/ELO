// Services
import {
  httpService
} from "../../services/http";
import {
  apiUrl
} from "../../services/config";

export const actionTypes = {
  SAVING_INTERACTION_INIT: "SAVING_INTERACTION_INIT",
  SAVING_INTERACTION_SUCCESS: "SAVING_INTERACTION_SUCCESS",
  SAVING_INTERACTION_ERROR: "SAVING_INTERACTION_ERROR",
  SAVING_HIDE_FEEDBACK: "SAVING_HIDE_FEEDBACK"
};

export const save_interaction_init = () => {
  return {
    type: actionTypes.SAVING_INTERACTION_INIT
  };
};

export const save_interaction_success = (response, isCorrect) => {
  return {
    type: actionTypes.SAVING_INTERACTION_SUCCESS,
    result: response,
    isCorrect
  };
};

export const save_interaction_fail = ex => {
  return {
    type: actionTypes.SAVING_INTERACTION_ERROR,
    errormessage: ex
  };
};

export const hide_feedback = () => {
  return {
    type: actionTypes.SAVING_HIDE_FEEDBACK,
  };
};

export const save_interaction = (slideId, answerIds, isCorrect) => {
  return async function (dispatch) {
    dispatch(save_interaction_init());
    httpService
      .post(`${apiUrl}/content/interaction/multichoice/`, {
        slideId,
        answerIds,
        isCorrect
      })
      .then(response => {
        dispatch(save_interaction_success(response.data, isCorrect))
      }).then(() => {
        setTimeout(() => {
          dispatch(hide_feedback())
        }, 5000);
      })
      .catch(ex => {
        dispatch(
          save_interaction_fail(
            "Caught ex in save_interaction: " + ex.message
          )
        );
      });
  };
};