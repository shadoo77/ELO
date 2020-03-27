import React, { Suspense } from "react";
import { Switch } from "react-router-dom";
import { NetworkErrorBoundary } from "rest-hooks";
// Components
import ProtectedRoute from "components/shared/protectedRoute";
import SlideshowPlayer from "./player/player";
import PublicationBrowser from "./browser/publication";
import NodeBrowser from "./browser/node";
import Spinner from "components/shared/spinner/";
import Warner from "components/shared/warner/";
// Services
import { accessibleBy, routeUrls } from "services/config";
import { userService } from "services/user";
// Material UI
import { createStyles, makeStyles } from "@material-ui/core/styles";
import { Container } from "@material-ui/core";

function ErrorPage({ error }) {
  const errormsg = `${error.status} - ${{ ...error.response }}, ${
    error.response.statusText
  }`;

  if (error.status >= 400 && error.status <= 499) {
    userService.deleteAuthToken();
    window.location.href = "/";
  }

  return <Warner message={errormsg} />;
}

const useStyles = makeStyles(theme =>
  createStyles({
    root: {
      maxWidth: 768,
      [theme.breakpoints.down("xs")]: {
        padding: 0
      }
    }
  })
);

const StudentContainer = () => {
  const classes = useStyles();
  return (
    <>
      <Container className={classes.root}>
        <Suspense fallback={<Spinner />}>
          <NetworkErrorBoundary fallbackComponent={ErrorPage}>
            <Switch>
              <ProtectedRoute
                path={`${routeUrls.student.browse.tag}/theme/:themeId/paragraph/:parId/assignment/:assignmentId`}
                component={SlideshowPlayer}
                accessible={accessibleBy.CLASSROOM}
              />

              <ProtectedRoute
                path={`${routeUrls.student.browse.tag}/theme/:themeId/paragraph/:parId`}
                component={NodeBrowser}
                accessible={accessibleBy.CLASSROOM}
              />

              <ProtectedRoute
                path={`${routeUrls.student.browse.tag}/theme/:themeId`}
                component={NodeBrowser}
                accessible={accessibleBy.CLASSROOM}
              />
              <ProtectedRoute
                path={`${routeUrls.student.browse.tag}/publication/:pubId?`}
                component={PublicationBrowser}
                accessible={accessibleBy.CLASSROOM}
              />
            </Switch>
          </NetworkErrorBoundary>
        </Suspense>
      </Container>
    </>
  );
};

export default StudentContainer;
