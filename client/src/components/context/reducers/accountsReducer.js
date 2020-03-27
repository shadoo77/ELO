import { actionTypes } from "../actions/accounts";

export default (state, action) => {
  switch (action.type) {
    case actionTypes.FETCHING_ACCOUNTS:
      return {
        ...state,
        hasFailed: false,
        isLoading: true
      };
    case actionTypes.FETCHING_ACCOUNTS_SUCCESS:
      return {
        ...state,
        hasFailed: false,
        isLoading: false,
        accounts: action.results
      };
    case actionTypes.FETCHING_ACCOUNTS_ERROR:
      return {
        ...state,
        hasFailed: true,
        isLoading: false,
        message: action.ex.message
      };
    default:
      return state;
  }
};
