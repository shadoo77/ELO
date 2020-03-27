import React, { useState, useEffect } from "react";
// Date pickers
import DateFnsUtils from "@date-io/date-fns";
import { MuiPickersUtilsProvider, TimePicker } from "@material-ui/pickers";
// Material ui
import {
  //Grid,
  Box,
  TextField,
  MenuItem,
  Fab,
  Icon,
  IconButton,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  InputAdornment,
  Typography
} from "@material-ui/core/";
import AddIcon from "@material-ui/icons/Add";
import { makeStyles } from "@material-ui/core/styles";

const weekDays = ["ma", "di", "wo", "do", "vr", "za", "zo"];

const useStyles = makeStyles(theme => ({
  typographyStyle: {
    padding: theme.spacing(1, 2)
  },
  addTimesButton: {
    margin: theme.spacing(1)
  },
  textField: {
    //marginLeft: theme.spacing(1),
    //marginRight: theme.spacing(1)
  },
  iconsButton: {
    fontSize: 10
  }
}));

const getTime = date => {
  const toDate = new Date(date);
  let getHours = toDate.getHours();
  getHours = ("0" + getHours).slice(-2);
  let getMinutes = toDate.getMinutes();
  getMinutes = ("0" + getMinutes).slice(-2);
  return getHours + ":" + getMinutes;
};

// Add element form component
function AddNewElement(props) {
  const { dayDate, startDate, endDate, action, location } = props;
  const classes = useStyles();
  const initialDate = new Date();
  initialDate.setHours(0);
  initialDate.setMinutes(0);

  const initState = {
    dag: dayDate || weekDays[0],
    start: startDate ? new Date(startDate) : initialDate,
    eind: endDate ? new Date(endDate) : initialDate,
    locatie: location || "",
    locatieError: null
  };

  const [state, setState] = useState(initState);

  const lesTimesDayAndLocationHandler = e => {
    setState({
      ...state,
      [e.target.name]: e.target.value,
      locatieError: null
    });
  };

  const lesTimesDateHandler = (date, name) => {
    setState({
      ...state,
      [name]: new Date(date),
      locatieError: null
    });
  };

  const cancelLessTimes = () => {
    setState(initState);
    props.cancelLessTimes();
  };

  const onSubmit = () => {
    const locationRgex = /^[a-zA-Z0-9.\-_$@*!]{3,50}$/;
    if (!state.locatie.match(locationRgex)) {
      setState({
        ...state,
        locatieError: "tussen 3 - 30 letters moet zijn!"
      });
      return;
    }
    action === "add"
      ? props.handleSubmit(state)
      : props.handleUpdate(props.itemId, state);
    setState(initState);
  };

  return (
    <Box display="flex" alignItems="flex-end">
      <Box mx={{ xs: 0.2, sm: 0.5, md: 1 }}>
        <TextField
          className={classes.textField}
          select
          label="Dag"
          name="dag"
          value={state.dag}
          onChange={e => lesTimesDayAndLocationHandler(e)}
          margin="dense"
          fullWidth
        >
          {weekDays.map(day => (
            <MenuItem key={day} value={day}>
              {day}
            </MenuItem>
          ))}
        </TextField>
      </Box>

      <Box mx={{ xs: 0.2, sm: 0.5, md: 1 }}>
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <TimePicker
            label="Van"
            name="start"
            ampm={false}
            style={{ maxWidth: 100 }}
            //className={classes.textField}
            //helperText={errors ? errors.start : null}
            margin="dense"
            value={state.start}
            onChange={date => lesTimesDateHandler(date, "start")}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <Icon style={{ color: "gray" }}>access_time</Icon>
                </InputAdornment>
              )
            }}
          />
        </MuiPickersUtilsProvider>
      </Box>

      <Box mx={{ xs: 0.2, sm: 0.5, md: 1 }}>
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <TimePicker
            label="Tot"
            name="eind"
            ampm={false}
            style={{ maxWidth: 100 }}
            //className={classes.textField}
            //helperText={errors ? errors.end : null}
            margin="dense"
            value={state.eind}
            onChange={date => lesTimesDateHandler(date, "eind")}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <Icon style={{ color: "gray" }}>access_time</Icon>
                </InputAdornment>
              )
            }}
          />
        </MuiPickersUtilsProvider>
      </Box>

      <Box mx={{ xs: 0.2, sm: 0.5, md: 1 }} flexGrow={1}>
        <TextField
          id="standard-basic"
          error={state.locatieError ? true : false}
          helperText={state.locatieError}
          name="locatie"
          className={classes.textField}
          label="Locatie"
          margin="dense"
          fullWidth
          value={state.locatie}
          onChange={e => lesTimesDayAndLocationHandler(e)}
        />
      </Box>

      <Box mx={{ xs: 0.2, sm: 0.5, md: 1 }} display="flex">
        <Box mx={{ xs: 0.2, sm: 0.5, md: 1 }}>
          <IconButton
            size="small"
            edge="start"
            className={classes.iconsButton}
            style={{ color: "green" }}
            onClick={onSubmit}
          >
            <Icon>done</Icon>
          </IconButton>
        </Box>
        <Box mx={{ xs: 0.2, sm: 0.5, md: 1 }}>
          <IconButton
            size="small"
            edge="start"
            className={classes.iconsButton}
            style={{ color: "red" }}
            onClick={cancelLessTimes}
          >
            <Icon>clear</Icon>
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
}

// Single element component
function RenderElement({ item, handleDelete, updateLessTime }) {
  const [editMode, setEditMode] = useState(false);
  const callEditFunc = id => {
    setEditMode(true);
  };

  const callDeleteFunc = id => {
    handleDelete(id);
  };

  const cancelLessTimes = () => {
    setEditMode(false);
  };

  function handleUpdate(id, item) {
    setEditMode(false);
    updateLessTime(id, item);
  }

  return editMode ? (
    <AddNewElement
      dayDate={item.day}
      startDate={item.start}
      endDate={item.end}
      location={item.location}
      cancelLessTimes={cancelLessTimes}
      handleUpdate={handleUpdate}
      itemId={item.id || item._id}
      action="update"
    />
  ) : (
    <ListItem alignItems="flex-start">
      <ListItemIcon>
        <Icon>person</Icon>
      </ListItemIcon>
      <ListItemText primary={item.day} />
      <ListItemText primary="Van" secondary={`${getTime(item.start)}`} />
      <ListItemText primary="Tot" secondary={`${getTime(item.end)}`} />
      <ListItemText primary="location" secondary={item.location} />
      <ListItemSecondaryAction>
        <IconButton
          edge="end"
          aria-label="edit"
          onClick={() => callEditFunc(item.id)}
        >
          <Icon>edit</Icon>
        </IconButton>
        <IconButton
          edge="end"
          aria-label="delete"
          onClick={() => callDeleteFunc(item.id)}
        >
          <Icon>delete</Icon>
        </IconButton>
      </ListItemSecondaryAction>
    </ListItem>
  );
}

export default props => {
  const classes = useStyles();
  const { lessTimes, error } = props;
  const [timesArr, setTimesArr] = useState([]);
  const [addLes, setAddLes] = useState(false);
  const [errorState, setErrorState] = useState("");

  useEffect(() => {
    setTimesArr(lessTimes);
  }, [lessTimes]);

  useEffect(() => {
    setErrorState(error);
  }, [error]);

  // Lesson's times
  const cancelLessTimes = () => {
    setAddLes(false);
  };

  function handleConfirm(item) {
    setAddLes(false);
    setErrorState("");
    props.submitLessTimes(item);
  }

  function handleDelete(id) {
    props.deleteLessTime(id);
  }

  function handleEdit(id, item) {
    setErrorState("");
    props.updateLessTime(id, item);
  }

  function handleClick() {
    setAddLes(true);
  }

  return (
    <React.Fragment>
      <Divider />
      <Typography variant="h6" className={classes.typographyStyle}>
        Lestijden & locaties :
        <Fab
          size="small"
          color="primary"
          aria-label="add"
          className={classes.addTimesButton}
          onClick={handleClick}
        >
          <AddIcon />
        </Fab>
      </Typography>
      {/******* Error feedback ******/}
      {errorState && (
        <Typography variant="subtitle1" component="p" style={{ color: "red" }}>
          {errorState}
        </Typography>
      )}

      {/**** Render lesson's times ****/}
      {timesArr.length ? (
        <List component="nav">
          {timesArr.map((el, i) => (
            <React.Fragment key={el.id || el._id}>
              <RenderElement
                item={el}
                handleDelete={handleDelete}
                updateLessTime={handleEdit}
              />
              {i === timesArr.length - 1 ? null : (
                <Divider variant="inset" component="li" />
              )}
            </React.Fragment>
          ))}
        </List>
      ) : null}

      {addLes && (
        <AddNewElement
          cancelLessTimes={cancelLessTimes}
          handleSubmit={handleConfirm}
          action="add"
        />
      )}
    </React.Fragment>
  );
};
