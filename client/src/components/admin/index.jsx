import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";
// Components
import ProtectedRoute from "components/shared/protectedRoute";
import NavBar from "components/shared/navbar";

import AdminLanding from "./AdminLanding";

// Services
import { accessibleBy, routeUrls, baseUrls } from "services/config";
// Material UI
import { makeStyles } from "@material-ui/core/styles";
import { Container } from "@material-ui/core";

const useStyles = makeStyles(theme => ({
  navBarSpacing: { margin: theme.spacing(0.5, 0, 1.5, 0) },
  "@media (max-width: 500px)": {
    container: {
      padding: 0
    }
  }
}));

export default () => {
  const classes = useStyles();
  return (
    <Container maxWidth="lg" className={classes.container}>
      <NavBar className={classes.navBarSpacing} />
      <Switch>
        <ProtectedRoute
          path={`${routeUrls.admin.default}`}
          exact
          component={AdminLanding}
          accessible={accessibleBy.ADMIN}
        />

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
    </Container>
  );
};
