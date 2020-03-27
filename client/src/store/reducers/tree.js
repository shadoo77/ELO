import update from "immutability-helper";
import { actionTypes } from "../actions/tree";

// Import helper function to search in tree for updating or inserting
import { insertInTree, deleteFromTree } from "../../services/searchInTree";

export const DEFAULT_STATE = {
  hasFailed: false,
  isLoading: false,
  tree: {},
  errors: {},
  message: "",
  currentDepth: 0,
  currentParent: null
};

const treeReducer = (state = DEFAULT_STATE, action) => {
  switch (action.type) {
    case actionTypes.FETCHING_TREE:
      return update(state, {
        isLoading: { $set: true },
        hasFailed: { $set: false },
        errors: { $set: {} }
      });
    case actionTypes.FETCHING_TREE_SUCCESS:
      return update(state, {
        isLoading: { $set: false },
        hasFailed: { $set: false },
        currentParent: { $set: action.target },
        tree: { $set: action.result }
      });
    case actionTypes.FETCHING_TREE_ERROR:
      return update(state, {
        isLoading: { $set: false },
        hasFailed: { $set: true },
        message: { $set: action.ex.message }
      });
    case actionTypes.NAVIGATE_TREE:
      return update(state, {
        currentParent: { $set: action.target }
      });
    // Add a new item to tree
    case actionTypes.ADD_TO_TREE:
      const newTree = insertInTree(state.tree, action.item);
      return update(state, {
        isLoading: { $set: false },
        hasFailed: { $set: false },
        errors: { $set: {} },
        tree: { $set: newTree }
      });
    case actionTypes.ADDING_TREE_ERROR:
      return update(state, {
        isLoading: { $set: false },
        hasFailed: { $set: false },
        errors: { $set: action.err }
      });
    case actionTypes.DELETE_FROM_TREE:
      const temp = deleteFromTree(state.tree, action.id, action.parentId);
      return update(state, {
        isLoading: { $set: false },
        hasFailed: { $set: false },
        errors: { $set: {} },
        tree: { $set: temp }
      });
    default:
      return state;
  }
};

export default treeReducer;
