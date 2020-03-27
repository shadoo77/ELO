import React, { useState, useEffect } from "react";
import { httpService } from "../../../../services/http";
import { apiUrl, routeUrls } from "../../../../services/config";
import { userService } from "../../../../services/user";
import { historyService } from "../../../../services/history";
import {
  CircularProgress,
  Dialog,
  DialogTitle,
  TextField,
  MenuItem,
  Grid,
  Fab
} from "@material-ui/core/";
// Components
//import StudentView from "../../studentManager/StudentView";

const initState = {
  name: "",
  username: "",
  password: "",
  group: "",
  groupOptions: [],
  errors: {},
  open: false,
  loading: false
};

export default function(props) {
  const [state, setState] = useState({
    name: "",
    username: "",
    password: "",
    group: "",
    groupOptions: [],
    errors: {},
    open: false,
    loading: false
  });

  async function fetchingData() {
    try {
      const results = await httpService.get(
        `${apiUrl}/group/all/${userService.getCurrentUser()._id}`
      );
      setState({ ...state, group: props.groupId, groupOptions: results.data });
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    fetchingData();
  }, []);

  const handleChange = e => {
    setState({ ...state, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setState({ ...state, loading: true });
    const newItem = {
      name: state.name,
      username: state.username,
      password: state.password,
      group: state.group
    };

    try {
      await httpService.post(`${apiUrl}/group/addNew-student`, newItem);
      setState(initState);
      successModal();
    } catch (err) {
      setState({
        ...state,
        loading: false,
        errors: err.response.data
      });
    }
  };

  const successModal = () => {
    setState({ ...state, open: true, loading: false });
    setTimeout(() => {
      setState(prevState => ({
        open: !prevState.open
      }));
      historyService.goBack();
    }, 3000);
  };

  const handleCancel = () => {
    historyService.goBack();
    // const groupId = props.match.params.group_id;
    // if (groupId) {
    //   historyService.push(`${routeUrls.teacher.group.detail}/${groupId}`);
    // } else {
    //   historyService.push(`${routeUrls.teacher.group.overview}`);
    //   historyService.goBack();
    // }
  };

  const {
    name,
    username,
    password,
    errors,
    open,
    loading,
    group,
    groupOptions
  } = state;

  const defaultOpt = <option value="default">No groups found!</option>;

  return (
    <React.Fragment>
      <Grid container spacing={4} justify="center" alignContent="center">
        <Grid item xs={12} sm={9}>
          <form className="form-signin">
            <TextField
              error={errors.name ? true : false}
              helperText={errors.name}
              value={name}
              name="name"
              required
              id="student-name"
              label="Name"
              onChange={handleChange}
              margin="dense"
              style={{ marginTop: 35 }}
              fullWidth
            />
            <TextField
              error={errors.username ? true : false}
              helperText={errors.username}
              value={username}
              name="username"
              required
              id="student-username"
              label="Username"
              onChange={handleChange}
              margin="dense"
              style={{ marginTop: 35 }}
              fullWidth
            />
            <TextField
              error={errors.password ? true : false}
              helperText={errors.password}
              value={password}
              name="password"
              required
              type="password"
              id="student-password"
              label="Password"
              onChange={handleChange}
              margin="dense"
              style={{ marginTop: 35 }}
              fullWidth
            />
            <TextField
              error={errors.group ? true : false}
              id="outlined-select-currency"
              select
              label="Select"
              name="group"
              value={group}
              onChange={handleChange}
              helperText="Please select a group of the student"
              margin="normal"
              fullWidth
              style={{ marginTop: 35 }}
              variant="outlined"
            >
              {groupOptions.length > 0
                ? groupOptions.map(option => (
                    <MenuItem key={option.name} value={option._id}>
                      {option.name}
                    </MenuItem>
                  ))
                : defaultOpt}
            </TextField>
            <Fab
              variant="extended"
              color="secondary"
              size="large"
              onClick={handleCancel}
              style={{ margin: "33px 20px" }}
            >
              Annuleren
            </Fab>
            <Fab
              variant="extended"
              color="primary"
              size="large"
              onClick={handleSubmit}
              // fullWidth={true}
              style={{ margin: "33px 20px" }}
            >
              Add Student
            </Fab>
          </form>
          {loading ? <CircularProgress /> : null}
        </Grid>
      </Grid>

      <Dialog
        open={open}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title" color="primary">
          <div
            style={{
              color: "green",
              textAlign: "center"
            }}
          >
            {"A student is added successful!"}
          </div>
        </DialogTitle>
      </Dialog>
    </React.Fragment>
  );
}
