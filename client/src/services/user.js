import jwtDecode from "../../node_modules/jwt-decode/lib";
// Services
import { apiUrl, userRoles, routeUrls } from "./config";
import { httpService } from "./http";
import { historyService } from "./history";

async function login(account, role) {
  const endPoint = role === userRoles.STUDENT ? `${apiUrl}/auth/login` : `${apiUrl}/auth/user-login`;
  const response = await httpService.post(endPoint, account);
  localStorage.setItem("token", response.data);
  return jwtDecode(response.data);
}

function logout() {
  const user = getCurrentUser();
  if (user) {
    httpService.delete(`${apiUrl}/auth/logout/${user._id}`);
  }
  deleteAuthToken();
  historyService.push(user.role === userRoles.STUDENT ? `${routeUrls.student.auth.login}` : `${routeUrls.admin.auth.login}`);
}

function getCurrentUser() {
  try {
    const jwt = localStorage.getItem("token");
    if (jwt) {
      return jwtDecode(jwt);
    }
    return null;
  } catch (ex) {
    return ex;
  }
}

function getCurrentUserId() {
  const user = getCurrentUser();
  if (!user) {
    return null;
  }
  return user._id;
}

function getUserRole() {
  try {
    const token = jwtDecode(getAuthToken());
    return token.role;
  } catch (ex) {
    return null;
  }
}

function getAuthToken() {
  try {
    return localStorage.getItem("token");
  } catch (ex) {
    return ex;
  }
}

function deleteAuthToken() {
  try {
    localStorage.removeItem("token");
    //localStorage.removeItem("state");
    return;
  } catch (ex) {
    return ex;
  }
}

export const userService = {
  login,
  logout,
  getCurrentUser,
  getCurrentUserId,
  getUserRole,
  getAuthToken,
  deleteAuthToken
};
