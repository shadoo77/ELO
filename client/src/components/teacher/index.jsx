import React, { Component, Suspense } from "react";
import PropTypes from "prop-types";
import { Switch, Route, Redirect } from "react-router-dom";
import { NetworkErrorBoundary } from "rest-hooks";
// Components
import ProtectedRoute from "components/shared/protectedRoute";
import NavBar from "components/shared/navbar";
// Group management components
import GroupManagement from "components/teacher/groupManagement/";
import AddNewGroup from "components/teacher/groupManagement/add/";
import GroupDetail from "components/teacher/groupManagement/detail";
//import GroupEdit from "components/teacher/groupManagement/Edit";
// Student management components
import AddStudent from "components/teacher/studentManager/AddStudent";
import EditStudent from "components/teacher/studentManager/EditStudent";
import StudentStatus from "components/teacher/studentManager/StudentStatus";
import StudentView from "components/teacher/studentManager/studentsOverview/";
import Statistics from "components/teacher/statistics/index";
import AlfaContents from "components/teacher/alfa-contents/";
import Spinner from "components/shared/spinner/";
import Warner from "components/shared/warner/";
// Services
import { accessibleBy, routeUrls } from "services/config";
// Material UI
import { withStyles } from "@material-ui/core/styles";
import { Container } from "@material-ui/core";

const styles = theme => ({
  navBarSpacing: { margin: theme.spacing(0.5, 0, 1.5, 0) },
  "@media (max-width: 500px)": {
    container: {
      padding: 0
    }
  }
});

function ErrorPage({ error }) {
  const errormsg = `TEACHER INDEX ERROR ${error.status} - ${error.response}, ${error.response.statusText}`;
  return <Warner message={errormsg} />;
}

class TeacherContainer extends Component {
  //
  state = {};
  render() {
    const { classes } = this.props;
    return (
      <Container maxWidth="lg" className={classes.container}>
        <Suspense fallback={<Spinner />}>
          <NetworkErrorBoundary fallbackComponent={ErrorPage}>
            {/*  <Grid container>
       <Grid item container md={1} />
         <Grid item container sm={12} md={10}>
         <Grid item container> */}
            <NavBar className={classes.navBarSpacing} />
            {/*  </Grid> */}
            {/* <Grid item container className={this.props.classes.container}> */}
            <Switch>
              <ProtectedRoute
                path={`${routeUrls.teacher.group.overview}`}
                exact
                component={GroupManagement}
                accessible={accessibleBy.TEACHERS}
              />

              <ProtectedRoute
                path={`${routeUrls.teacher.group.edit}/:id`}
                exact
                component={AddNewGroup}
                accessible={accessibleBy.TEACHERS}
              />

              <ProtectedRoute
                path={`${routeUrls.teacher.group.add}`}
                exact
                component={AddNewGroup}
                accessible={accessibleBy.TEACHERS}
              />

              {/* <ProtectedRoute
            path={`${routeUrls.teacher.group.edit}/:id`}
            exact
            component={GroupEdit}
            accessible={accessibleBy.TEACHERS}
          /> */}

              <ProtectedRoute
                path={`${routeUrls.teacher.group.detail}/:id`}
                exact
                component={GroupDetail}
                accessible={accessibleBy.TEACHERS}
              />

              <ProtectedRoute
                path={`${routeUrls.teacher.group.detail}/:id/student`}
                exact
                component={StudentView}
                accessible={accessibleBy.TEACHERS}
              />

              <ProtectedRoute
                path={`${routeUrls.teacher.student.add}/:group_id?`}
                component={AddStudent}
                accessible={accessibleBy.TEACHERS}
              />

              <ProtectedRoute
                path={`${routeUrls.teacher.student.edit}/:group_id?/:std_id?`}
                component={EditStudent}
                accessible={accessibleBy.TEACHERS}
              />

              <ProtectedRoute
                path={`${routeUrls.teacher.student.status}/:std_id?`}
                component={StudentStatus}
                accessible={accessibleBy.TEACHERS}
              />

              <ProtectedRoute
                path={`${routeUrls.teacher.group.statistics}/group/:groupId/branch/:parentId/depthLevel/:depthLevel/student/:studentId?`}
                component={Statistics}
                accessible={accessibleBy.TEACHERS}
              />

              <ProtectedRoute
                path={`${routeUrls.teacher.group.statistics}/group/:groupId/branch/:parentId/depthLevel/:depthLevel`}
                component={Statistics}
                accessible={accessibleBy.TEACHERS}
              />
              {/****** Alfa contents (Films, sounds, images, taalbeats etc ....) *****/}
              <ProtectedRoute
                path={`${routeUrls.teacher.alfaContents}/branch/:branchId/depthLevel/:depthLevel`}
                component={AlfaContents}
                accessible={accessibleBy.TEACHERS}
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
            {/* </Grid>
        </Grid>
        <Grid item container md={1} />
      </Grid> */}
          </NetworkErrorBoundary>
        </Suspense>
      </Container>
    );
  }
}

TeacherContainer.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(TeacherContainer);
