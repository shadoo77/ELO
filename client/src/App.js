// React
import React from "react";
import { Route, Switch, Redirect } from "react-router-dom";
// Components
import ProtectedRoute from "./components/shared/protectedRoute";
// Components
import Login from "./components/student/login/login";
import StudentContainer from "./components/student/";
import TeacherContainer from "./components/teacher/";
// Author Components
import AuthorContainer from "./components/author/";
// Services
import { userService } from "./services/user";
import { httpService } from "services/http";
import { apiUrl } from "services/config";
import {
  userRoles,
  accessibleBy,
  routeUrls,
  baseUrls
} from "./services/config";
import "./services/fontawesome";
// Fonts
import "typeface-roboto";
// Users
import UserLogin from "./components/shared/userLogin";
import UserRegister from "./components/shared/userRegister";
import ForgotPassword from "./components/shared/forgot-password/ForgotPassword";
import ResetPassword from "./components/shared/forgot-password/ResetPassword";

// Delete token if it's out of date
import jwt_decode from "jwt-decode";

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
    localStorage.removeItem("token");
    // Redirect to main page
    window.location.href = "/";
  }
}

const authCheck = (props, DestinationComponent) => {
  const user = userService.getCurrentUser();
  if (user && user.role === userRoles.STUDENT) {
    return <Redirect to={`${routeUrls.student.default}`} />;
  } else if (user && user.role === userRoles.TEACHER) {
    return <Redirect to={`${routeUrls.teacher.default}`} />;
  } else if (user && user.role === userRoles.AUTHOR) {
    return <Redirect to={`${routeUrls.author.default}`} />;
  } else if (user && user.role === userRoles.ADMIN) {
    return <Redirect to={`${routeUrls.admin.default}`} />;
  } else {
    return <DestinationComponent {...props} />;
  }
};

const App = () => {
  return (
    <div className="App" style={{ height: "100%" }}>
      <Switch>
        <Route
          path="/student/login"
          exact
          render={props => authCheck(props, Login)}
        />

        <ProtectedRoute
          path={`${baseUrls.student}`}
          component={StudentContainer}
          accessible={accessibleBy.STUDENTS}
        />

        <ProtectedRoute
          path={`${baseUrls.teacher}`}
          component={TeacherContainer}
          accessible={accessibleBy.TEACHERS}
        />

        <ProtectedRoute
          path={`${baseUrls.author}`}
          component={AuthorContainer}
          accessible={accessibleBy.EVERYONE}
        />

        <Route
          path="/login"
          exact
          render={props => authCheck(props, UserLogin)}
        />

        <Route
          path="/forgotpassword"
          exact
          render={props => authCheck(props, ForgotPassword)}
        />
        <Route
          path="/wachtwoord-resetten/:pass_token"
          exact
          render={props => authCheck(props, ResetPassword)}
        />

        <Route
          path="/register"
          exact
          render={props => authCheck(props, UserRegister)}
        />

        <Route path="/" exact render={() => <Redirect to="/student/login" />} />

        <Route
          path="/404"
          exact
          render={() => (
            <h2 style={{ color: "red" }}>
              <center>Error 404: Wrong page!</center>
            </h2>
          )}
        />

        <Route exact render={() => <Redirect to="/404" />} />
      </Switch>
    </div>
  );
};

export default App;
