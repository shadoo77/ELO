import React, { useState, useEffect, useRef } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";

// Actions
import { add_new_group } from "../../../../store/actions/groups";
// Components
import GroupContainer from "../../../shared/group/Container";
import LessTimes from "./LessTimes";
import AutoSelect from "../../../shared/inputs/autoSelect";
import FabButton from "../../../shared/inputs/fabButton";
// Tools
import uuidv4 from "uuid/v4";
import { SnackbarProvider, withSnackbar } from "notistack";
import isEmpty from "services/is-empty";
// Services
import { userService } from "services/user";
import { backendService } from "services/backend";
import { historyService } from "services/history";
import { routeUrls } from "services/config";
// Material ui
import {
  Grid,
  TextField,
  FormHelperText,
  MenuItem,
  FormGroup,
  IconButton,
  Fab,
  Box,
  Icon,
  Tooltip,
  Divider,
  LinearProgress
} from "@material-ui/core/";
import CloseIcon from "@material-ui/icons/Close";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1)
  },
  typographyStyle: {
    padding: theme.spacing(1, 2)
  },
  closeIcon: {
    color: "#fff",
    padding: theme.spacing(0.5)
  }
}));

const initGroup = {
  id: "",
  name: "",
  organisation: {
    id: "",
    name: "",
    teachers: []
  },
  teachers: [],
  students: [],
  lessTimes: [],
  loading: false
};

//////////// High Order component for Add a new group
function AddGroup(props) {
  const classes = useStyles();
  const [group, setGroup] = useState(initGroup);
  const [organisations, setOrganisations] = useState([]);
  const [errors, setErrors] = useState({});

  async function fetchOrganisations() {
    try {
      const teacherId = await userService.getCurrentUserId();
      if (!teacherId) {
        throw new Error("TEACHER ID FAILED: ", teacherId);
      }
      const employers = await backendService.getEmployersOfTeacher(teacherId);
      if (!employers) {
        throw new Error("EMPLOYERS CANT BE FOUND");
      }
      const teacher = employers.data[0].teachers.find(
        teacher => teacher._id === teacherId
      );
      setGroup({
        ...group,
        organisation: {
          ...group.organisation,
          teachers: [...group.organisation.teachers, teacher._id]
        }
      });
      setOrganisations(employers.data);

      // Edit case
      const groupId = props.match.params.id;
      if (groupId) {
        const fetchGroup = await backendService.getGroupById(groupId);
        const groupData = fetchGroup.data;
        setGroup({
          ...group,
          id: groupData._id,
          name: groupData.name,
          organisation: {
            ...group.organisation,
            id: groupData.organisation._id,
            name: groupData.organisation.name,
            teachers: groupData.teachers
          },
          teachers: groupData.organisation.teachers,
          students: groupData.students,
          lessTimes: groupData.lessTimes
        });
      }
    } catch (err) {
      console.error("Caught: ", err);
    }
  }

  useEffect(() => {
    fetchOrganisations();
  }, []);

  const handleNameChange = e => {
    setGroup({
      ...group,
      [e.target.name]: e.target.value
    });
    setErrors({
      ...errors,
      name: ""
    });
  };

  function chooseTeacher(teachersArr) {
    const teachersInClass = teachersArr.map(el => el.value);
    setGroup({
      ...group,
      organisation: {
        ...group.organisation,
        teachers: teachersInClass
      }
    });
  }

  const handleSubmit = async e => {
    e.preventDefault();
    setGroup({
      ...group,
      loading: true
    });

    const newGroup = {
      id: group.id,
      name: group.name,
      organisation: group.organisation.id,
      lessTimes: group.lessTimes,
      teachers: group.organisation.teachers,
      students: [],
      action: "add"
    };
    console.log("New groep : ", newGroup);
    try {
      props.add_new_group(newGroup, successfullSnack, historyService);
      setGroup({
        ...group,
        loading: false
      });
    } catch (ex) {
      setGroup({
        ...group,
        loading: false
      });
    }
  };

  // Function which skip the first invocation
  function useEffectSkipFirst(fn, arr) {
    const isFirst = useRef(true);

    useEffect(() => {
      if (isFirst.current) {
        isFirst.current = false;
        return;
      }

      fn();
    }, arr);
  }

  useEffectSkipFirst(() => {
    if (props.errors && !isEmpty(props.errors)) {
      setErrors(props.errors);
    }
  }, [props.errors]);

  // Handle cancel
  const handleCancel = () => {
    historyService.push(`${routeUrls.teacher.group.overview}`);
  };

  const organisationChangeHandler = e => {
    const organisationId = e.target.value;
    const employer = organisations.find(employer => {
      return employer._id === organisationId;
    });
    setGroup({
      ...group,
      organisation: {
        ...group.organisation,
        id: employer._id,
        name: employer.name
      },
      teachers: [...employer.teachers]
    });
    setErrors({
      ...errors,
      organisation: ""
    });
  };

  const submitLessTimes = timeObj => {
    const item = {
      id: uuidv4(),
      day: timeObj.dag,
      start: timeObj.start,
      end: timeObj.eind,
      location: timeObj.locatie
    };
    setGroup({
      ...group,
      lessTimes: [...group.lessTimes, item]
    });
  };

  const updateLessTime = (itemId, item) => {
    const editedIndex = group.lessTimes
      .map(el => el.id || el._id)
      .indexOf(itemId);
    const tempArr = group.lessTimes;
    tempArr[editedIndex].day = item.dag;
    tempArr[editedIndex].start = item.start;
    tempArr[editedIndex].end = item.eind;
    tempArr[editedIndex].location = item.locatie;
    setGroup({
      ...group,
      lessTimes: [...tempArr]
    });
  };

  const deleteLessTime = itemId => {
    const removeIndex = group.lessTimes.map(el => el.id).indexOf(itemId);
    const tempArr = group.lessTimes;
    tempArr.splice(removeIndex, 1);
    setGroup({
      ...group,
      lessTimes: [...tempArr]
    });
  };

  const label = (txt, required) => (
    <span>
      {txt}
      {required && <span style={{ color: "red" }}> *</span>}
    </span>
  );

  /////// Snackbar functions /////////
  const successfullSnack = variant => {
    // variant could be success, error, warning or info
    props.enqueueSnackbar("Nieuwe groep is succesvol gemaakt !", {
      variant,
      action: snackAction,
      autoHideDuration: 2500
    });
  };

  // add multiple actions to one snackbar
  const snackAction = key => (
    <React.Fragment>
      <IconButton
        key="close"
        aria-label="Close"
        className={classes.closeIcon}
        onClick={() => {
          props.closeSnackbar(key);
        }}
      >
        <CloseIcon />
      </IconButton>
    </React.Fragment>
  );

  return (
    <GroupContainer
      title="Nieuwe groep"
      subtitle="Alle * velden zijn verplicht"
    >
      <Grid container justify="center" alignItems="center">
        <Grid item xs={12} sm={7} style={{ padding: 10 }}>
          <form onSubmit={e => handleSubmit(e)}>
            <TextField
              variant="outlined"
              name="name"
              placeholder="VCIT1G4A"
              fullWidth
              value={group.name}
              onChange={e => handleNameChange(e)}
              margin="normal"
              label={label("Groepsnaam", true)}
              error={errors.name ? true : false}
              helperText={errors.name}
            />
            <FormHelperText htmlFor="txtAddName">
              {errors.groupNameEmpty ? null : (
                <span id="txtAddNameHelpBlock" className="form-text text-muted">
                  Hoe heet de groep? Gebruik: "<b>VCIT</b>
                  &lt;leerjaar&gt;&lt;opleiding&gt;&lt;lettercode&gt;"
                </span>
              )}
            </FormHelperText>

            <TextField
              id="select"
              select
              label={label("Organisatie", true)}
              error={errors.organisation ? true : false}
              helperText={errors.organisation}
              name={group.organisation.name}
              value={group.organisation.id}
              onChange={e => organisationChangeHandler(e)}
              margin="normal"
              fullWidth
              style={{ marginTop: 35 }}
              variant="outlined"
            >
              {organisations.map(organisation => (
                <MenuItem key={organisation._id} value={organisation._id}>
                  {organisation.name}
                </MenuItem>
              ))}
            </TextField>

            {/* Checkboxes here      %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% */}
            <AutoSelect // group.organisation.teachers + [userService.getCurrentUserId()]
              data={group.teachers}
              unremovableValue={userService.getCurrentUserId()}
              defaultValues={group.organisation.teachers}
              label={label("Welke docenten geven er les aan deze klas?", true)}
              handleSubmit={chooseTeacher}
            />

            {/***** Lesson's times component ********/}
            <LessTimes
              lessTimes={group.lessTimes}
              errors={errors.lessTimes}
              submitLessTimes={submitLessTimes}
              updateLessTime={updateLessTime}
              deleteLessTime={deleteLessTime}
            />

            {/********* Locations **********************/}
            {/* <Location
              typographyStyle={classes.typographyStyle}
              location={group.location || ""}
              locationSubmit={locationSubmit}
              organisationId={group.organisation.id}
              error={errors.location}
            />
            */}
            <Box mt={3} mb={3}>
              {group.loading ? <LinearProgress /> : <Divider />}
            </Box>

            {/********* Submit and cancel buttons **********************/}
            <FormGroup row style={{ margin: "20px 0" }}>
              <Tooltip title="Cancel">
                <Fab
                  size="small"
                  variant="extended"
                  color="secondary"
                  onClick={handleCancel}
                  name="cancel"
                >
                  <Icon>cancel</Icon>
                  Annuleren
                </Fab>
              </Tooltip>
              <Box ml={2}>
                <FabButton
                  name="save"
                  loading={group.loading}
                  variant="extended"
                  width="100"
                  height="40"
                  fabSize="large"
                  icon="save"
                  iconSize="large"
                  iconFontSize="35"
                  spinnerSize={25}
                  marginTop={25}
                  marginLeft={50}
                  tooltipText="Opslaan"
                  clickHandler={handleSubmit}
                />
              </Box>
            </FormGroup>
          </form>
        </Grid>
      </Grid>
    </GroupContainer>
  );
}

AddGroup.propTypes = {
  add_new_group: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => {
  const { isLoading, hasFailed, errors, message, items } = state.groups;
  return {
    isLoading,
    hasFailed,
    message,
    errors,
    items
  };
};

const wrappedExportingComponent = connect(
  mapStateToProps,
  { add_new_group }
)(withRouter(AddGroup));

const RegPage = withSnackbar(wrappedExportingComponent);

function AddGroupWithSnack() {
  return (
    <SnackbarProvider maxSnack={3}>
      <RegPage />
    </SnackbarProvider>
  );
}

export default AddGroupWithSnack;
