import React, { useContext, useEffect } from "react";
import { RootContext, RootContextProvider } from "./index.js";
// Services
import { httpService } from "services/http";
import { userService } from "services/user";
import { apiUrl } from "services/config";
// Import actions
import { fetchGroups } from "./actions/groups";

function TestConstent() {
  const { state, dispatch } = useContext(RootContext);
  const { isLoading, hasFailed, groups, errormessage } = state.groups;

  // async function fetchGroups(teacherId) {
  //   dispatch({ type: "FETCHING_GROUPS" });
  //   try {
  //     const results = await httpService.get(
  //       `${apiUrl}/group/taughtby/${teacherId}`
  //     );
  //     dispatch({
  //       type: "FETCHING_GROUPS_SUCCESS",
  //       payload: results.data
  //     });
  //   } catch (err) {
  //     dispatch({
  //       type: "FETCHING_GROUPS_ERROR",
  //       error: err
  //     });
  //   }
  // }
  // Test async fetch
  useEffect(() => {
    const user = userService.getCurrentUser();
    fetchGroups(dispatch, user._id);
  }, []);

  return (
    <div>
      <h2>Groups Context</h2>
      <ul>
        {isLoading && !hasFailed ? (
          <pre>loading .. </pre>
        ) : !isLoading && hasFailed ? (
          <span>{errormessage}</span>
        ) : !isLoading && !hasFailed && groups && !groups.length ? (
          <p>empty array</p>
        ) : (
          groups.map((el, i) => (
            <li key={el._id}>{el.name + ", index : " + i}</li>
          ))
        )}
      </ul>
    </div>
  );
}

function DisplayContext() {
  return (
    <RootContextProvider>
      <TestConstent />
    </RootContextProvider>
  );
}

export default DisplayContext;
