import React, { Component } from "react";
import { httpService } from "../../../services/http";
import { apiUrl } from "../../../services/config";
import { Link } from "react-router-dom";
// Services
import { userService } from "services/user";
import { routeUrls, tagLevels } from "services/config";
import { backendService } from "services/backend";

// Material UI
import {
  Slide,
  Icon,
  Fab,
  Tooltip,
  CircularProgress,
  List,
  ListItem,
  CardHeader,
  ListItemText,
  IconButton,
  CardActions,
  ListItemSecondaryAction,
  Divider,
  Card,
  Grid,
  Typography
} from "@material-ui/core/";
import MoreVertIcon from "@material-ui/icons/MoreVert";
// Import component
import ConfirmDialog from "../../shared/dialog/";
import SwitchCheck from "../../shared/switch/";

import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import { studentsView } from "../../shared/Theme";

const EnableDisableGroup = React.forwardRef((props, ref) => (
  <SwitchCheck {...props} forwardRef={ref} />
));

class StudentView extends Component {
  state = {
    alfa: "",
    students: [],
    loading: false,
    hasGroups: false, // Check if teacher has a group or not
    dialog: {
      open: false,
      std_id: "",
      std_isActivated: false
    }
  };

  componentDidMount = async () => {
    const alfa = backendService.getAlfaRoot();
    if (alfa) this.setState({ alfa: alfa._id });
    const hasGroups = await httpService.get(
      `${apiUrl}/group/all/${userService.getCurrentUser()._id}`
    );
    if (hasGroups.data.length) {
      this.setState({ hasGroups: true });
    }
    if (this.props.groupID) {
      this.setState({ loading: true });
      const results = await httpService.get(
        `${apiUrl}/group/${this.props.groupID}`
      );
      if (results) {
        this.setState({
          students: results.data[0].students,
          loading: false
        });
      }
    }
  };

  // Transition = props => {
  //   return <Slide direction="up" {...props} />;
  // };

  Transition = React.forwardRef((props, ref) => {
    return <Slide direction="up" ref={ref} {...props} />;
  });

  handleOpenDialog = (isActive, studID) => {
    this.setState({
      dialog: {
        open: true,
        std_id: studID,
        std_isActivated: !isActive
      }
    });
  };

  handleCloseDialog = () => {
    this.setState({
      dialog: { ...this.state.dialog, open: false }
    });
  };

  changeActiveStatus = async () => {
    const { std_isActivated, std_id } = this.state.dialog;
    try {
      await httpService.put(`${apiUrl}/group/student-activate`, {
        std_isActivated,
        std_id
      });
      let students = [...this.state.students];
      const updateIndex = students.map(el => el._id).indexOf(std_id); // TODO: Do we need a copy/map here?
      students[updateIndex].isActivated = std_isActivated;
      this.setState({
        students,
        dialog: { ...this.state.dialog, open: false }
      });
    } catch (err) {
      console.log(err);
    }
  };

  render() {
    const { classes } = this.props;
    const { students, loading } = this.state;
    const spinner = (
      <div style={{ textAlign: "center", margin: "30px auto" }}>
        <CircularProgress />
      </div>
    );
    /////////////////////////////////////////////////////
    /////  Card view ///////////////////////////////////
    const cardView = (
      <List>
        {students.length < 1 ? (
          <ListItem>
            <ListItemText
              primary="Deze groep is leeg"
              //secondary="U kunt studenten toevoegen bij klikken op de knop onder"
            />
          </ListItem>
        ) : (
          students.map((student, i) => {
            return (
              <React.Fragment key={student._id}>
                <ListItem button>
                  <ListItemText primary={student.name} />
                  <ListItemSecondaryAction>
                    {/* Edit Student     &&&&&&&&&&&&&&&&&&&&&&   */}
                    <Link
                      to={`${routeUrls.teacher.student.edit}?stud_id=${student._id}&group_id=${this.props.groupID}`}
                      style={{ textDecoration: "none" }}
                    >
                      <IconButton
                        aria-label="Edit"
                        className={classes.iconsButton}
                      >
                        <Tooltip title="Wijzigen">
                          <Icon>edit</Icon>
                        </Tooltip>
                      </IconButton>
                    </Link>
                    {/* Students statistieken     &&&&&&&&&&&&&&&&&&&&&&   */}
                    <Link
                      to={`${routeUrls.teacher.group.statistics}/group/${this.props.groupID}/branch/${this.state.alfa}/depthLevel/${tagLevels.THEME}/student/${student._id}`}
                      //{`${routeUrls.teacher.student.status}/${student._id}`}
                      style={{ textDecoration: "none" }}
                    >
                      <IconButton
                        aria-label="Statics"
                        className={classes.iconsButton}
                      >
                        <Tooltip title="Statistieken bekijken">
                          <Icon>bar_chart</Icon>
                        </Tooltip>
                      </IconButton>
                    </Link>
                    {/* Student is activated or inactivated     &&&&&&&&&&&&&&&&&&&&&&   */}
                    {/* <React.Fragment>
                      <IconButton
                        aria-label="Active"
                        className={classes.activeren}
                        onClick={() =>
                          this.handleOpenDialog(
                            student.isActivated,
                            student._id
                          )
                        }
                      >
                        {student.isActivated ? (
                          <Tooltip
                            title="Actief, klik om te deactiveren"
                            className={classes.activeIcon}
                          >
                            <Icon>explore</Icon>
                          </Tooltip>
                        ) : (
                          <Tooltip
                            title="Niet actief, klik om te activeren"
                            className={classes.unactiveIcon}
                          >
                            <Icon>explore_off</Icon>
                          </Tooltip>
                        )}
                      </IconButton>
                    </React.Fragment> */}
                    {/* Student activeren / deactiveren */}
                    <IconButton
                      aria-label="Enable-Disable"
                      className={classes.switchActive}
                      disableFocusRipple
                    >
                      <Tooltip
                        title={
                          student.isActivated
                            ? "Student deactiveren"
                            : "Student activeren"
                        }
                      >
                        <div
                          onClick={() =>
                            this.handleOpenDialog(
                              student.isActivated,
                              student._id
                            )
                          }
                        >
                          <EnableDisableGroup
                            switchChecked={student.isActivated}
                          />
                        </div>
                      </Tooltip>
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
                {i === students.length - 1 ? null : <Divider />}
              </React.Fragment>
            );
          })
        )}
      </List>
    );
    /////////////////////////////////////////////
    ////// Button add a new person //////////////
    const linkToAddStudent = this.state.hasGroups ? (
      <Link
        to={`${routeUrls.teacher.student.add}/${
          typeof this.props.groupID !== "undefined" ? this.props.groupID : ""
        }`}
        style={{ textDecoration: "none" }}
      >
        <Tooltip title="Voeg een nieuwe student toe">
          <Fab className={classes.addNewStudent} size="small">
            <Icon>person_add</Icon>
          </Fab>
        </Tooltip>
      </Link>
    ) : (
      <Fab
        className={classes.addNewStudent}
        size="small"
        disabled
        style={{
          textDecoration: "none",
          pointerEvents: "none"
        }}
      >
        <Icon>person_add</Icon>
      </Fab>
    );

    //////////////////////////////////////////////

    return (
      <Grid container spacing={4}>
        <Grid item xs={12} sm={12}>
          <Card style={{ padding: 12 }}>
            <CardHeader
              action={
                <IconButton>
                  <MoreVertIcon />
                </IconButton>
              }
              title="Studenten"
            />
            <Divider />
            {loading ? spinner : cardView}

            {/* Confirm dialog for active and inactive students */}
            <ConfirmDialog
              transition={this.Transition}
              dialogOpen={this.state.dialog.open}
              dialogTitle={
                !this.state.dialog.std_isActivated
                  ? "Student deactiveren ?"
                  : "Student activeren ?"
              }
              dialogContent={`U gaat deze student 
              ${
                !this.state.dialog.std_isActivated
                  ? " deactiveren "
                  : " activeren "
              }
              , weet u het zeker !?`}
              implementConfirmState={this.changeActiveStatus}
              handleCloseDialog={this.handleCloseDialog}
            />

            <CardActions className={classes.actions}>
              {linkToAddStudent}
            </CardActions>
            {!this.state.hasGroups && (
              <Typography color="textSecondary">
                Voeg maar een nieuwe groep toe voordat u kunt een nieuwe student
                aanmaken!
              </Typography>
            )}
          </Card>
        </Grid>
        {/* TODO : Inactive students */}
      </Grid>
    );
  }
}

StudentView.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(studentsView)(StudentView);
