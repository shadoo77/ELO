import React from "react";
import { Route, Redirect } from "react-router-dom";
// Services
import { userService } from "../../../services/user";
import { userRoles, routeUrls } from "../../../services/config";

import jwt_decode from "jwt-decode";

const ProtectedRoute = ({
  path,
  component: Component,
  render,
  accessible: accessibleBy,
  ...remainingProps
}) => {
  if (localStorage.token) {
    const decoded = jwt_decode(localStorage.token);
    //   // Logout user automaticlly after an expire time
    const currentTime = Date.now() / 1000;
    if (decoded.exp < currentTime) {
      const user = userService.getCurrentUserId();
      if (user) {
        userService.logout();
      }
      // Remove token from localStorage
      // localStorage.removeItem("token");
      // Redirect to main page
      // window.location.href = "/";
    }
  }

  return (
    <Route
      {...remainingProps}
      render={(props) => {
        const user = userService.getCurrentUser();
        if (!user) {
          return <Redirect to={`${routeUrls.student.auth.login}`} />;
        }
        if (
          (accessibleBy.indexOf(userRoles.STUDENT) > -1 &&
            user.role === userRoles.STUDENT) ||
          (accessibleBy.indexOf(userRoles.TEACHER) > -1 &&
            user.role === userRoles.TEACHER) ||
          (accessibleBy.indexOf(userRoles.AUTHOR) > -1 &&
            user.role === userRoles.AUTHOR) ||
          (accessibleBy.indexOf(userRoles.ADMIN) > -1 &&
            user.role === userRoles.ADMIN)
        ) {
          return Component ? (
            // For class components
            <Component {...props} />
          ) : (
            // For stateless functions
            render(props)
          );
        } else {
          // Which login page do we want to display? Depends
          // on type of user! Admin, author and teacher
          // share the same loginpage
          const userLoginType =
            accessibleBy.indexOf(userRoles.STUDENT) > -1 &&
            user.role === userRoles.STUDENT
              ? routeUrls.student.auth.login
              : routeUrls.admin.auth.login;
          // Redirect to login page for type of user
          return <Redirect to={userLoginType} />;
        }
      }}
    />
  );
};

export default ProtectedRoute;
