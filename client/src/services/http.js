import axios from "axios";
import { userService } from "./user";

axios.interceptors.response.use(null, error => {
  // const expectedErrors =
  //   error.response &&
  //   error.response.status >= 400 &&
  //   error.response.status < 500;

  // if (!expectedErrors) {
  //   console.error("Axios intercepted a response error: ", error);
  // }
  console.log("Axios intercepting error, log out?", error.response.status);
  if (error.response.status === 401) {
    console.log(
      "INTERCEPTING some 400 http status, delete token",
      error.response
    );
    userService.deleteAuthToken();
    window.location.href = "/";
    // userService.logout();
  }

  return Promise.reject(error);
});

// Add auth jwt to every request
axios.interceptors.request.use(
  reqConfig => {
    const headers = {
      Authorization: userService.getAuthToken() //X-Auth-Token
    };
    reqConfig.headers = headers;
    console.log("AXIOS REQ", reqConfig);
    return reqConfig;
    /*
    if (reqConfig.url.includes("/auth/logout")) {
      const userRole = userService.getUserRole();
      userService.deleteAuthToken();
      //historyService.push("/user-login");
      historyService.push(
        userRole === userRoles.STUDENT
          ? "/login"
          : "/user-login"
      );
    }
    */
  },
  error => Promise.reject(error)
);

export const httpService = {
  get: axios.get,
  post: axios.post,
  put: axios.put,
  delete: axios.delete
};
