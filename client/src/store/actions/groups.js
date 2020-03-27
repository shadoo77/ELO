// Services
import { httpService } from "./../../services/http";
import { apiUrl, routeUrls } from "../../services/config";

export const actionTypes = {
  FETCHING_GROUPS: "FETCHING_GROUPS",
  FETCHING_GROUPS_SUCCESS: "FETCHING_GROUPS_SUCCESS",
  FETCHING_GROUPS_ERROR: "FETCHING_GROUPS_ERROR",
  ADD_GROUP: "ADD_GROUP",
  ADD_ERROR: "ADD_ERROR",
  CLEAR_ERRORS: "CLEAR_ERRORS",
  DELETE_GROUP: "DELETE_GROUP",
  UPDATE_GROUP_ACTIVITY_STATUS: "UPDATE_GROUP_ACTIVITY_STATUS"
};

export const fetching_groups_init = () => {
  return {
    type: actionTypes.FETCHING_GROUPS
  };
};

export const fetching_groups_success = results => {
  return {
    type: actionTypes.FETCHING_GROUPS_SUCCESS,
    results: results
  };
};

export const fetching_groups_fail = ex => {
  //change_group_active_status
  return {
    type: actionTypes.FETCHING_GROUPS_ERROR,
    ex: ex
  };
};

export const change_group_active_status = () => {
  return {};
};

// Clear errors
export const clearErrors = () => {
  return {
    type: actionTypes.CLEAR_ERRORS
  };
};

export const fetch_groups = teacherId => {
  return function(dispatch) {
    dispatch(fetching_groups_init());
    httpService
      .get(`${apiUrl}/group/taughtby/${teacherId}`)
      .then(response => {
        setTimeout(
          () => dispatch(fetching_groups_success(response.data)),
          Math.random() * 250 + 250
        );
      })
      .catch(ex => {
        dispatch(fetching_groups_fail(ex));
      });
  };
};

export const add_new_group = (newGroup, successfullSnack, historyService) => {
  return async function(dispatch) {
    dispatch(clearErrors());
    try {
      const response = await httpService.post(`${apiUrl}/group/`, newGroup);

      setTimeout(() => {
        dispatch({
          type: actionTypes.ADD_GROUP,
          payload: response.data
        });
        historyService.push(routeUrls.teacher.group.overview);
      }, 3000);
      successfullSnack("success");
    } catch (err) {
      dispatch({
        type: actionTypes.ADD_ERROR,
        payload: err.response.data
      });
    }
    // httpService
    //   .post(`${apiUrl}/group/`, newGroup)
    //   .then(response => {
    //     console.log("response :: ", response);
    //     dispatch({
    //       type: actionTypes.ADD_GROUP,
    //       payload: response.data
    //     });
    //   })
    //   .catch(err => {
    //     console.log("Error ::: ", err);
    //     dispatch({
    //       type: actionTypes.ADD_ERROR,
    //       payload: err.response.data
    //     });
    //   });
  };
};

export const delete_group = groupId => {
  return function(dispatch) {
    httpService
      .delete(`${apiUrl}/group/${groupId}`)
      .then(() => {
        dispatch({
          type: actionTypes.DELETE_GROUP,
          payload: groupId
        });
      })
      .catch(ex => {
        dispatch(fetching_groups_fail(ex));
      });
  };
};

export const enable_disable_group = groupId => {
  return function(dispatch) {
    httpService
      .put(`${apiUrl}/group/enable-disable/${groupId}`)
      .then(() => {
        dispatch({
          type: actionTypes.UPDATE_GROUP_ACTIVITY_STATUS,
          payload: groupId
        });
      })
      .catch(ex => {
        dispatch(fetching_groups_fail(ex));
      });
  };
};
