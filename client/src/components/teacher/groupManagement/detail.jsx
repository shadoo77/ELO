import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
import { fetch_groups } from "../../../store/actions/groups";
import { httpService } from "services/http";
import { apiUrl } from "services/config";
import { Link } from "react-router-dom";
// Services
import { userService } from "services/user";
import { backendService } from "services/backend";
import { routeUrls } from "services/config";
// Components
import GroupContainer from "../../shared/group/Container";
//import Spinner from "../../shared/spinner";
import Warner from "../../shared/warner";
// Material ui
import {
  Grid,
  Avatar,
  Tooltip,
  CircularProgress,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Icon,
  Divider,
  Typography,
  Box,
  Fab
} from "@material-ui/core/";
import { deepPurple } from "@material-ui/core/colors";

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    width: "100%",
    backgroundColor: theme.palette.background.paper
  },
  centerText: {
    display: "flex",
    alignItems: "center"
  },
  icon: {
    marginRight: theme.spacing()
  },
  iconsButton: {
    "&:active": {
      outline: "0 !important",
      border: "0 !important"
    },
    "&:focus": {
      outline: "0 !important",
      border: "0 !important"
    }
  },
  paperStyle: {
    padding: theme.spacing(3, 5)
  },
  avatar: {
    margin: "0 10px",
    color: "#fff",
    cursor: "pointer",
    backgroundColor: deepPurple[500]
  }
}));

const GroupDetails = props => {
  const classes = useStyles();
  const teacherId = userService.getCurrentUser()._id;
  const { items, hasFailed, isLoading, message } = props;
  const [organisation, setOrganisation] = useState({});
  const [group, setGroup] = useState({
    id: "",
    name: "",
    lessTimes: []
  });
  const [studentsState, setStudentsState] = useState({
    loading: false,
    students: []
  });
  const [teachers, setTeachers] = useState([]);

  // Fetch student
  async function getStudents(groupId) {
    setStudentsState({
      ...studentsState,
      loading: true
    });
    const results = await httpService.get(`${apiUrl}/group/${groupId}`);
    if (results) {
      setStudentsState({
        ...studentsState,
        loading: false,
        students: [...results.data.students]
      });
    }
  }

  // Did mount
  useEffect(() => {
    getStudents(props.match.params.id);
    props.fetch_groups(teacherId);
  }, []);

  async function getEmployers(teacherId) {
    const result = await backendService.getEmployersOfTeacher(teacherId);
    const resOrganisation = result.data[0];
    setOrganisation(resOrganisation);
  }

  // Will recieve props
  useEffect(() => {
    getEmployers(teacherId);

    items.forEach(item => {
      item._id === props.match.params.id &&
        setGroup({
          ...group,
          id: props.match.params.id,
          name: item.name,
          lessTimes: item.lessTimes
        });
      if (item._id === props.match.params.id && item.teachers.length) {
        let teacherArr = [];
        item.teachers.forEach((t, i) => {
          organisation.teachers &&
            organisation.teachers.length &&
            organisation.teachers.forEach(el => {
              if (el._id === t) teacherArr[i] = { id: t, name: el.name };
            });
          setTeachers(teacherArr);
        });
      }
    });
  }, [items]);

  // Get teachers avatar
  function getTeachersAvatar(teachers) {
    return teachers.map(el => {
      const elName = el.name.split(",");
      const lettersArr = elName.map(el => el.trim().charAt(0));
      // return lettersArr.join("");
      return { name: el.name, avatar: lettersArr.join("") };
    });
  }

  // Render teachers avatar
  // function renderAvatar() {
  //   const avatars = getTeachersAvatar(teachers);
  //   console.log("avatars ::::: ", avatars);
  //   return (
  //     <Grid
  //       container
  //       justify="flex-start"
  //       alignItems="center"
  //       style={{
  //         display: "flex",
  //         flexWrap: "nowrap"
  //       }}
  //     >
  //       {teachers && teachers.length
  //         ? teachers.map((el, i) => (
  //             <Tooltip title={el.name} key={`avatar${i}`}>
  //               <Avatar className={classes.avatar}>{avatars[i]}</Avatar>
  //             </Tooltip>
  //           ))
  //         : null}
  //     </Grid>
  //   );
  // }

  // Button add student
  function addStudentButton() {
    return (
      <Link
        to={`${routeUrls.teacher.student.add}/${
          typeof group.id !== "undefined" ? group.id : ""
        }`}
        style={{ textDecoration: "none" }}
      >
        <Tooltip title="Student toevoegen">
          <Fab size="small" color="secondary">
            <Icon>person_add</Icon>
          </Fab>
        </Tooltip>
      </Link>
    );
  }

  // Render spinner
  const spinner = () => (
    <div style={{ textAlign: "center", margin: "30px auto" }}>
      <CircularProgress />
    </div>
  );

  /////////////////////////////////////////////////////
  function studentsRender(students, loading) {
    return loading ? (
      spinner()
    ) : (
      <Typography component="div">
        <Box p={3}>
          <List>
            {!students.length ? (
              <ListItem style={{ maxWidth: 500 }}>
                <Typography variant="body1" component="div">
                  {`Deze groep is leeg`} {addStudentButton()}
                </Typography>
              </ListItem>
            ) : (
              students.map((student, i) => {
                return (
                  <React.Fragment key={student._id}>
                    <ListItem button>
                      <ListItemAvatar>
                        <Avatar style={{ backgroundColor: "#555" }}>
                          {student.name.charAt(0)}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={student.name}
                        secondary="thema1/para2/opdracht3"
                      />
                      <ListItemSecondaryAction>
                        {/* Students statistieken     &&&&&&&&&&&&&&&&&&&&&&   */}
                        <Link
                          to={`${routeUrls.teacher.student.status}/${student._id}`}
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
                      </ListItemSecondaryAction>
                    </ListItem>
                    {i === students.length - 1 ? null : <Divider />}
                  </React.Fragment>
                );
              })
            )}
          </List>
        </Box>
      </Typography>
    );
  }

  //const subtitles = ["wo : 12:00 - 16:30 , h210", "do : 09:00 - 12:00 , A2.00"];

  const getTime = date => {
    const toDate = new Date(date);
    let getHours = toDate.getHours();
    getHours = ("0" + getHours).slice(-2);
    let getMinutes = toDate.getMinutes();
    getMinutes = ("0" + getMinutes).slice(-2);
    return getHours + ":" + getMinutes;
  };

  const subtitles = lessTimes => {
    return (
      lessTimes &&
      lessTimes.length &&
      lessTimes.map(
        item => `${item.day} : ${getTime(item.start)} - ${getTime(item.end)}`
      )
    );
  };

  const { students, loading } = studentsState;

  return (
    <React.Fragment>
      {!hasFailed && isLoading ? (
        spinner()
      ) : !isLoading && hasFailed ? (
        <Warner message={message} />
      ) : items.length === 0 ? (
        <ListItem>
          <Typography>Er zijn geen actieve groepen!</Typography>
        </ListItem>
      ) : items && items.length ? (
        <GroupContainer
          title={`Groep ${group.name}`}
          //subtitle="Hier vind je details"
          subtitles={subtitles(group.lessTimes || [])}
          header={getTeachersAvatar(teachers)}
          headerType="avatar"
        >
          {studentsRender(students, loading)}
        </GroupContainer>
      ) : null}
    </React.Fragment>
  );
};

const mapStateToProps = state => {
  const { hasFailed, isLoading, items, message } = state.groups;
  return {
    hasFailed,
    isLoading,
    items,
    message
  };
};

export default connect(
  mapStateToProps,
  { fetch_groups }
)(GroupDetails);
