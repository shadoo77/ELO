import React, { useState, useEffect } from "react";
import { Link, withRouter } from "react-router-dom";
// Components
import Spinner from "../../../shared/spinner";
//import Warner from "../../shared/warner";
//import SwitchCheck from "../../shared/switch";
import ConfirmDialog from "../../../shared/dialog";
import SearchBox from "../../../shared/inputs/expand-searchbox/";
// Services
import { routeUrls, tagLevels } from "services/config";
import { backendService } from "services/backend";
import { searchAndFilter } from "services/results-filters";
// Material ui
import {
  Tooltip,
  Grow,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Typography,
  Divider,
  Fab,
  Icon,
  CardActions
} from "@material-ui/core/";
import { makeStyles } from "@material-ui/styles";

const Transition = React.forwardRef((props, ref) => (
  <Grow ref={ref} {...props} />
));

const useStyles = makeStyles(() => ({
  iconsButton: {
    "&:hover": {
      outline: "0 !important",
      border: "0 !important",
      background: "0 !important"
    },
    "&:active": {
      outline: "0 !important",
      border: "0 !important"
    },
    "&:focus": {
      outline: "0 !important",
      border: "0 !important"
    }
  },
  addButton: {
    color: "#fff",
    //backgroundColor: "#26a69a",
    "&:hover": {
      //backgroundColor: "#00695c"
    }
  }
}));

function StudentsList(props) {
  const classes = useStyles();
  const { renderCase, students } = props;
  const groupID = props.match.params.id;
  const [alfa, setAlfa] = useState("");
  const [state, setState] = useState({
    filter: ""
  });
  const [dialog, setDialog] = useState({
    open: false,
    studentId: ""
  });
  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    studentId: ""
  });

  const isMounted = React.useRef(false);

  async function getAlfa() {
    try {
      const alfa = await backendService.getAlfaRoot();
      if (!isMounted.current) {
        setAlfa(alfa._id);
      }
    } catch (error) {
      console.log("error >>>>>>><>><<<<", error);
    }
  }

  useEffect(() => {
    getAlfa();
    return () => {
      isMounted.current = true;
    };
  }, []);

  // Filter search
  const filterChange = val => {
    setState({ ...state, filter: val });
  };

  const clearSearch = () => {
    setState({ ...state, filter: "" });
  };

  const changeActivity = async () => {
    const { studentId } = dialog;
    const studentIsActivated = renderCase === "active" ? false : true;
    props.changeActivity(studentId, studentIsActivated);
    setDialog({
      ...dialog,
      open: false
    });
  };

  const handleDelete = async () => {
    const { studentId } = deleteDialog;
    props.deleteStudent(studentId);
    setDeleteDialog({
      ...deleteDialog,
      open: false,
      studentId: ""
    });
  };

  // Dialog handle open
  const handleOpenDialog = studentId => {
    setDialog({
      ...dialog,
      open: true,
      studentId: studentId
    });
  };

  // Dialog handle close
  const handleCloseDialog = () => {
    setDialog({
      ...dialog,
      open: false,
      studentId: ""
    });
  };

  // Delete dialog open
  const handleOpenDeleteDialog = studentId => {
    setDeleteDialog({
      ...deleteDialog,
      open: true,
      studentId: studentId
    });
  };

  // Dialog handle close
  const handleCloseDeleteDialog = () => {
    setDeleteDialog({
      ...deleteDialog,
      open: false,
      studentId: ""
    });
  };

  const studentsRender = data => {
    return data.map((student, i) =>
      renderCase === "active"
        ? /******* Render active case */
          student.isActivated && (
            <React.Fragment key={student._id}>
              <ListItem
              //   button
              //   component={Link}
              //   to={`${routeUrls.teacher.group.detail}/${group._id}`}
              >
                <ListItemText primary={student.name} />
                <ListItemSecondaryAction>
                  {/* Student statistics */}
                  <Link
                    to={`${routeUrls.teacher.group.statistics}/group/${groupID}/branch/${alfa}/depthLevel/${tagLevels.THEME}/student/${student._id}`}
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
                  {/* Modify student */}
                  <Link
                    to={`${routeUrls.teacher.student.edit}?stud_id=${student._id}&group_id=${groupID}`}
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

                  {/* Activate group supervised_user_circle */}
                  <IconButton
                    aria-label="Enable-Disable"
                    className={classes.iconsButton}
                    disableFocusRipple
                    onClick={() => handleOpenDialog(student._id)}
                  >
                    <Tooltip title="Student deactiveren">
                      <Icon>visibility</Icon>
                    </Tooltip>
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>

              {i === data.length - 1 ? null : <Divider />}
            </React.Fragment>
          )
        : /******* Render inactive case */
          !student.isActivated && (
            <React.Fragment key={student._id}>
              <ListItem
              //   button
              //   component={Link}
              //   to={`${routeUrls.teacher.group.detail}/${group._id}`}
              >
                <ListItemText primary={student.name} />
                <ListItemSecondaryAction>
                  {/* Activate group  */}
                  <IconButton
                    aria-label="Enable-Disable"
                    className={classes.iconsButton}
                    disableFocusRipple
                    onClick={() => handleOpenDialog(student._id)}
                  >
                    <Tooltip title="Student activeren">
                      <Icon>visibility_off</Icon>
                    </Tooltip>
                  </IconButton>

                  {/* Delete group     &&&&&&&&&&&&&&&&&&&&&&   */}
                  <IconButton
                    aria-label="Delete"
                    onClick={() => handleOpenDeleteDialog(student._id)}
                  >
                    <Tooltip title="Student verwijderen">
                      <Icon>delete_forever</Icon>
                    </Tooltip>
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
              {i === data.length - 1 ? null : <Divider />}
            </React.Fragment>
          )
    );
  };

  const searchFilter = () => {
    return (
      <React.Fragment>
        <SearchBox
          handleChange={filterChange}
          clearSearch={clearSearch}
          value={state.filter}
        />
        <Divider />
      </React.Fragment>
    );
  };
  ///////// (data, searchValue, activeState, selectedKey)
  const searchValue = state.filter;
  const activeState = renderCase === "active" ? true : false;
  const selectedKey = "isActivated";
  const filteredData = searchAndFilter(
    students || [],
    searchValue,
    activeState,
    selectedKey
  );

  return (
    <React.Fragment>
      {state.loading ? (
        <Spinner />
      ) : filteredData.length === 0 ? (
        <React.Fragment>
          {searchFilter()}
          <ListItem>
            <Typography>
              Er zijn geen {renderCase === "active" ? "actieve" : "inactieve"}{" "}
              studenten!
            </Typography>
          </ListItem>
        </React.Fragment>
      ) : filteredData && filteredData.length > 0 ? (
        <React.Fragment>
          {/* {confirmDialog()} */}
          {renderCase === "active" ? (
            <ConfirmDialog
              transition={Transition}
              dialogOpen={dialog.open}
              dialogTitle="Weet u zeker dat u deze groep wilt deactiveren ?`"
              dialogContent="U gaat de group deactiveren weet u zeker ?"
              implementConfirmState={changeActivity}
              handleCloseDialog={handleCloseDialog}
            />
          ) : (
            <React.Fragment>
              <ConfirmDialog
                transition={Transition}
                dialogOpen={deleteDialog.open}
                dialogTitle={`Weet u zeker dat u deze groep wilt verwijderen ?`}
                dialogContent={`U gaat de group verwijderen, weet u zeker ?`}
                implementConfirmState={handleDelete}
                handleCloseDialog={handleCloseDeleteDialog}
              />
              <ConfirmDialog
                transition={Transition}
                dialogOpen={dialog.open}
                dialogTitle="Weet u zeker dat u deze groep wilt activeren ?"
                dialogContent="U gaat de group activeren, weet u zeker ?"
                implementConfirmState={changeActivity}
                handleCloseDialog={handleCloseDialog}
              />
            </React.Fragment>
          )}
          {searchFilter()}
          <List>{studentsRender(filteredData)}</List>
        </React.Fragment>
      ) : null}
      <CardActions
        style={{ float: "right", padding: "1em", marginBottom: "0.5em" }}
      >
        <Link
          to={`${routeUrls.teacher.student.add}/${
            typeof groupID !== "undefined" ? groupID : ""
          }`}
          style={{ textDecoration: "none" }}
        >
          <Tooltip title="Voeg een nieuwe student toe">
            <Fab className={classes.addButton} size="large" color="secondary">
              <Icon>add</Icon>
            </Fab>
          </Tooltip>
        </Link>
      </CardActions>
    </React.Fragment>
  );
}

export default withRouter(StudentsList);
