// Services
import { httpService } from "../../services/http";
import { apiUrl } from "../../services/config";

export const actionTypes = {
  FETCHING_USERS_SLIDESHOWS_INIT: "FETCHING_USERS_SLIDESHOWS_INIT",
  FETCHING_USERS_SLIDESHOWS_SUCCESS: "FETCHING_USERS_SLIDESHOWS_SUCCESS",
  FETCHING_USERS_SLIDESHOWS_ERROR: "FETCHING_USERS_SLIDESHOWS_ERROR"
};

export const fetching_slideshows_init = () => {
  return {
    type: actionTypes.FETCHING_USERS_SLIDESHOWS_INIT
  };
};

export const fetching_slideshows_success = results => {
  return {
    type: actionTypes.FETCHING_USERS_SLIDESHOWS_SUCCESS,
    results: results
  };
};

export const fetching_slideshows_fail = ex => {
  return {
    type: actionTypes.FETCHING_USERS_SLIDESHOWS_ERROR,
    errormessage: ex
  };
};

export const fetch_slideshows_of_group = (
  branchId,
  groupId,
  studentId,
  depth
) => {
  return async function(dispatch) {
    dispatch(fetching_slideshows_init());
    httpService
      .get(
        `${apiUrl}/content/statistics/group/${groupId}/branch/${branchId}/student/${studentId}/depth/${depth}`
      )
      .then(response => {
        dispatch(fetching_slideshows_success(response.data));
      })
      .catch(ex => {
        dispatch(
          fetching_slideshows_fail(
            ex.response.status !== 400
              ? "Caught ex in fetch_slideshows: " + ex.message
              : "Geen opdrachten "
          )
        );
      });
  };
};

// export const fetch_slideshows_of_group = (branchId, groupId, studentId) => {
//   return async function(dispatch) {
//     dispatch(fetching_slideshows_init());
//     httpService
//       .get(
//         `${apiUrl}/content/slideshowsof/group/${groupId}/branch/${branchId}/student/${studentId}`
//       )
//       .then(response => {
//         dispatch(fetching_slideshows_success(response.data));
//       })
//       .catch(ex => {
//         dispatch(
//           fetching_slideshows_fail(
//             ex.response.status !== 400
//               ? "Caught ex in fetch_slideshows: " + ex.message
//               : "Geen opdrachten "
//           )
//         );
//       });
//   };
// };
