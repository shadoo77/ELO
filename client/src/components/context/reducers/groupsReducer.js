import { actionTypes } from "../actions/groups";

export default (state, action) => {
  switch (action.type) {
    case actionTypes.FETCHING_GROUPS:
      return {
        ...state,
        hasFailed: false,
        isLoading: true
      };
    case actionTypes.FETCHING_GROUPS_SUCCESS:
      return {
        ...state,
        hasFailed: false,
        isLoading: false,
        groups: action.payload
      };
    case actionTypes.FETCHING_GROUPS_ERROR:
      return {
        ...state,
        hasFailed: true,
        isLoading: false,
        message: action.error.message
      };
    default:
      return state;
  }
};
