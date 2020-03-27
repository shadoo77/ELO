import update from "immutability-helper";
import { actionTypes } from "../actions/groups.slideshows";

export const DEFAULT_STATE = {
  isLoading: false,
  hasFailed: false,
  errormessage: "",
  users: []
};

export default (state = DEFAULT_STATE, action) => {
  switch (action.type) {
    case actionTypes.FETCHING_USERS_SLIDESHOWS_INIT:
      return update(state, {
        isLoading: { $set: true },
        hasFailed: { $set: false }
      });
    case actionTypes.FETCHING_USERS_SLIDESHOWS_SUCCESS:
      return update(state, {
        isLoading: { $set: false },
        hasFailed: { $set: false },
        users: { $set: action.results }
      });
    case actionTypes.FETCHING_USERS_SLIDESHOWS_ERROR:
      return update(state, {
        isLoading: { $set: false },
        hasFailed: { $set: true },
        errormessage: { $set: action.errormessage }
      });
    default:
      return state;
  }
};
