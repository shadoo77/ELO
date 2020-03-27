import React, { useState, useEffect } from "react";
// Date pickers
import DateFnsUtils from "@date-io/date-fns";
import { MuiPickersUtilsProvider, TimePicker } from "@material-ui/pickers";
// Material ui
import {
  Grid,
  TextField,
  FormHelperText,
  MenuItem,
  FormGroup,
  Fab,
  Icon,
  IconButton,
  Tooltip,
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
  addLesTimes: {
    display: "flex",
    flexWrap: "wrap"
  },
  typographyStyle: {
    padding: theme.spacing(1, 2)
    //margin: theme.spacing(4, 0, 2)
  },
  addTimesButton: {
    margin: theme.spacing(1)
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1)
  },
  iconsButton: {
    fontSize: 10
  }
}));

const getTime = date => {
  let getHours = date.getHours();
  getHours = ("0" + getHours).slice(-2);
  let getMinutes = date.getMinutes();
  getMinutes = ("0" + getMinutes).slice(-2);
  return getHours + ":" + getMinutes;
};

// Add element form component
function AddNewElement(props) {
  const { dayDate, startDate, endDate, action } = props;
  const classes = useStyles();
  const initialDate = new Date();
  initialDate.setHours(0);
  initialDate.setMinutes(0);

  const initState = {
    dag: dayDate || weekDays[0],
    start: startDate || initialDate,
    eind: endDate || initialDate
  };

  const [state, setState] = useState(initState);

  const lesTimesDayHandler = e => {
    setState({
      ...state,
      dag: e.target.value
    });
  };

  const lesTimesDateHandler = (date, name) => {
    setState({
      ...state,
      [name]: new Date(date)
    });
  };

  const cancelLessTimes = () => {
    setState(initState);
    props.cancelLessTimes();
  };

  const onSubmit = () => {
    action === "add"
      ? props.handleSubmit(state)
      : props.handleUpdate(props.itemId, state);
    setState(initState);
  };

  return (
    <Grid container justify="center" className={classes.addLesTimes}>
      <Grid item xs={2}>
        <TextField
          select
          label="Dag"
          name="dag"
          value={state.dag}
          onChange={e => lesTimesDayHandler(e)}
          margin="dense"
          fullWidth
        >
          {weekDays.map(day => (
            <MenuItem key={day} value={day}>
              {day}
            </MenuItem>
          ))}
        </TextField>
      </Grid>
      <Grid item xs={3}>
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <TimePicker
            label="Van"
            name="start"
            ampm={false}
            className={classes.textField}
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
      </Grid>
      <Grid item xs={3}>
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <TimePicker
            label="Tot"
            name="eind"
            ampm={false}
            className={classes.textField}
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
      </Grid>
      <Grid
        item
        container
        justify="flex-start"
        alignContent="flex-end"
        xs={3}
        spacing={1}
      >
        <Grid item style={{ display: "flex", flexWrap: "nowrap" }}>
          <IconButton
            size="small"
            edge="start"
            className={classes.iconsButton}
            style={{ color: "green" }}
            onClick={onSubmit}
          >
            <Icon>done</Icon>
          </IconButton>
        </Grid>
        <Grid item>
          <IconButton
            size="small"
            edge="start"
            className={classes.iconsButton}
            style={{ color: "red" }}
            onClick={cancelLessTimes}
          >
            <Icon>clear</Icon>
          </IconButton>
        </Grid>
      </Grid>
    </Grid>
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
      cancelLessTimes={cancelLessTimes}
      handleUpdate={handleUpdate}
      itemId={item.id}
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
  const { lessTimes, errors } = props;
  const [timesArr, setTimesArr] = useState([]);
  const [addLes, setAddLes] = useState(false);

  useEffect(() => {
    setTimesArr(lessTimes);
  }, [lessTimes]);

  // Lesson's times
  const cancelLessTimes = () => {
    setAddLes(false);
  };

  function handleSubmit(item) {
    setAddLes(false);
    props.submitLessTimes(item);
  }

  function handleDelete(id) {
    props.deleteLessTime(id);
  }

  function handleEdit(id, item) {
    props.updateLessTime(id, item);
  }

  return (
    <React.Fragment>
      <Divider />
      <Typography variant="h6" className={classes.typographyStyle}>
        Lestijden :
        <Fab
          size="small"
          color="primary"
          aria-label="add"
          className={classes.addTimesButton}
          onClick={() => setAddLes(true)}
        >
          <AddIcon />
        </Fab>
      </Typography>
      {timesArr.length ? (
        <List component="nav">
          {timesArr.map((el, i) => (
            <React.Fragment key={el.id}>
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
          handleSubmit={handleSubmit}
          action="add"
        />
      )}
    </React.Fragment>
  );
};
