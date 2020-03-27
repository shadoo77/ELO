// Services
import { httpService } from "../../services/http";
import { apiUrl } from "../../services/config";

export const actionTypes = {
  FETCHING_SLIDESHOWS_INIT: "FETCHING_SLIDESHOWS_INIT",
  FETCHING_SLIDESHOWS_SUCCESS:
    "FETCHING_SLIDESHOWS_SUCCESS",
  FETCHING_SLIDESHOWS_ERROR: "FETCHING_SLIDESHOWS_ERROR"
};

export const fetching_slideshows_init = () => {
  return {
    type: actionTypes.FETCHING_SLIDESHOWS_INIT
  };
};

export const fetching_slideshows_success = results => {
  return {
    type: actionTypes.FETCHING_SLIDESHOWS_SUCCESS,
    results: results
  };
};

export const fetching_slideshows_fail = ex => {
  return {
    type: actionTypes.FETCHING_SLIDESHOWS_ERROR,
    errormessage: ex
  };
};

export const fetch_slideshows = parentId => {
  return async function(dispatch) {
    dispatch(fetching_slideshows_init());
    httpService
      .get(
        `${apiUrl}/content/slideshows/childrenof/${parentId}`
      )
      .then(response => {
        setTimeout(
          () =>
            dispatch(
              fetching_slideshows_success(response.data)
            ),
          Math.random() * 250 + 250
        );
      })
      .catch(ex => {
        dispatch(
          fetching_slideshows_fail(
            "Caught ex in fetch_slideshows: " + ex.message
          )
        );
      });
  };
};

//// Fetching set of slideshows based on an id (sub tree)
//// Like : get all slideshows in paragraf 1 or all slideshows in thema 1 based on thema1 id
export const fetch_slideshows_of = (
  parentId,
  studentId
) => {
  return async function(dispatch) {
    dispatch(fetching_slideshows_init());
    httpService
      .get(
        `${apiUrl}/content/slideshowsof/parent/${parentId}/student/${studentId}`
      )
      .then(response => {
        dispatch(
          fetching_slideshows_success(response.data)
        );
      })
      .catch(ex => {
        dispatch(
          fetching_slideshows_fail(
            "Caught ex in fetch_slideshows_of: " +
              ex.message
          )
        );
      });
  };
};
