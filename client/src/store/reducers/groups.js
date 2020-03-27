import { actionTypes } from "./../actions/groups";

const DEFAULT_STATE = {
  hasFailed: false,
  isLoading: true,
  items: [],
  message: "",
  errors: {}
};

const groupsReducer = (state = DEFAULT_STATE, action) => {
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
        items: action.results,
        errors: {}
      };
    case actionTypes.FETCHING_NODES_ERROR:
      return {
        ...state,
        hasFailed: true,
        isLoading: false,
        message: action.ex.message
      };
    case actionTypes.ADD_GROUP:
      return {
        ...state,
        hasFailed: false,
        isLoading: false,
        items: [...state.items, action.payload],
        errors: {}
      };
    case actionTypes.ADD_ERROR:
      return {
        ...state,
        hasFailed: true,
        isLoading: false,
        errors: action.payload
      };
    case actionTypes.CLEAR_ERRORS:
      return {
        ...state,
        errors: {}
      };
    case actionTypes.UPDATE_GROUP_ACTIVITY_STATUS:
      const updatedItems = state.items.filter(item => {
        if (item._id === action.payload) item.isActive = !item.isActive;
        return item;
      });
      return {
        ...state,
        hasFailed: false,
        isLoading: false,
        items: updatedItems
      };
    case actionTypes.DELETE_GROUP:
      return {
        ...state,
        hasFailed: false,
        isLoading: false,
        items: state.items.filter(el => el._id !== action.payload)
      };
    default:
      return state;
  }
};

export default groupsReducer;
