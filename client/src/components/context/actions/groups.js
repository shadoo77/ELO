import { httpService } from "services/http";
import { apiUrl } from "services/config";

export const actionTypes = {
  FETCHING_GROUPS: "FETCHING_GROUPS",
  FETCHING_GROUPS_SUCCESS: "FETCHING_GROUPS_SUCCESS",
  FETCHING_ACCOUNTS_ERROR: "FETCHING_ACCOUNTS_ERROR"
};

export const fetching_groups_init = () => {
  return {
    type: "FETCHING_GROUPS"
  };
};

export const fetching_groups_success = results => {
  return {
    type: "FETCHING_GROUPS_SUCCESS",
    payload: results
  };
};

export const fetching_groups_fail = err => {
  return {
    type: "FETCHING_GROUPS_ERROR",
    error: err
  };
};

export const fetchGroups = async (dispatch, teacherId) => {
  dispatch(fetching_groups_init());
  try {
    const results = await httpService.get(
      `${apiUrl}/group/taughtby/${teacherId}`
    );
    dispatch(fetching_groups_success(results.data));
  } catch (err) {
    dispatch(fetching_groups_fail(err));
  }
};
