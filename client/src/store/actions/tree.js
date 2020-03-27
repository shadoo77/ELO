// Services
import { httpService } from "../../services/http";
import { apiUrl, routeUrls } from "../../services/config";

export const actionTypes = {
  FETCHING_TREE: "TREE_FETCHING",
  FETCHING_TREE_SUCCESS: "TREE_SUCCESS",
  FETCHING_TREE_ERROR: "TREE_ERROR",
  NAVIGATE_TREE: "NAVIGATE_TREE",
  // Add a new thema
  ADD_TO_TREE: "ADD_TO_TREE",
  // Update item in a tree
  UPDATE_IN_TREE: "UPDATE_IN_TREE",
  // Adding error
  ADDING_TREE_ERROR: "ADDING_TREE_ERROR",
  // Delete from tree
  DELETE_FROM_TREE: "DELETE_FROM_TREE"
};

export const tree_fetching_init = () => {
  return {
    type: actionTypes.FETCHING_TREE
  };
};

export const tree_fetching_success = (target, result) => {
  return {
    type: actionTypes.FETCHING_TREE_SUCCESS,
    target,
    result
  };
};

export const tree_fetching_fail = ex => {
  return {
    type: actionTypes.FETCHING_TREE_ERROR,
    ex: ex
  };
};

export const navigate_tree = id => {
  return {
    type: actionTypes.NAVIGATE_TREE,
    target: id
  };
};

export const add_new_item = item => {
  return {
    type: actionTypes.ADD_TO_TREE,
    item
  };
};

export const tree_adding_fail = err => {
  return {
    type: actionTypes.ADDING_TREE_ERROR,
    err
  };
};

export const deleting_success = (themaId, parentId) => {
  return {
    type: actionTypes.DELETE_FROM_TREE,
    id: themaId,
    parentId
  };
};

export const fetch_tree = (rootId, targetId) => {
  return async function(dispatch) {
    dispatch(tree_fetching_init());
    httpService
      .get(`${apiUrl}/tree/id/${rootId}`)
      .then(response => {
        setTimeout(
          () => dispatch(tree_fetching_success(targetId, response.data)),
          Math.random() * 250 + 250
        );
      })
      .catch(ex => {
        dispatch(tree_fetching_fail(ex));
      });
  };
};

//// Add a new thema ADD_TO_TREE
export const add_new_thema = (newItem, historyService, successAlert) => {
  return async function(dispatch) {
    dispatch(tree_fetching_init());
    httpService
      .post(`${apiUrl}/author/new-thema`, newItem)
      .then(response => {
        setTimeout(() => {
          dispatch(add_new_item(response.data));
          historyService.push(`${routeUrls.author.default}`);
        }, 3000);
        successAlert("success");
      })
      .catch(ex => {
        dispatch(tree_adding_fail(ex.response.data));
      });
  };
};

//// Delete a thema ADD_TO_TREE
export const delete_from_tree = themaId => {
  return async function(dispatch) {
    httpService
      .delete(`${apiUrl}/author/delete-thema/${themaId}`)
      .then(response => {
        dispatch(deleting_success(themaId, response.data.parentId));
      })
      .catch(ex => {
        dispatch(tree_fetching_fail(ex));
      });
  };
};
