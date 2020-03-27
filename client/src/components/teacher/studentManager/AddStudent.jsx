import React, { Component } from "react";
import { httpService } from "../../../services/http";
import { apiUrl, routeUrls } from "../../../services/config";
import { userService } from "../../../services/user";
import { historyService } from "../../../services/history";
//import queryString from "query-string";
import {
  CircularProgress,
  Dialog,
  DialogTitle,
  TextField,
  MenuItem,
  Grid,
  Fab
} from "@material-ui/core/";

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

class AddStudent extends Component {
  state = {
    name: "",
    username: "",
    password: "",
    group: "",
    groupOptions: [],
    errors: {},
    open: false,
    loading: false
  };

  componentDidMount = async () => {
    const { group_id } = this.props.match.params;
    //console.log(this.props.match);
    //const parsedQuery = queryString.parse(this.props.location.search);
    try {
      const results = await httpService.get(
        `${apiUrl}/group/all/${userService.getCurrentUser()._id}`
      );
      this.setState({ groupOptions: results.data });
      if (group_id) this.setState({ group: group_id });
    } catch (err) {
      console.log(err);
    }
  };

  handleChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleSubmit = async e => {
    e.preventDefault();
    this.setState({ loading: true });
    const newItem = {
      name: this.state.name,
      username: this.state.username,
      password: this.state.password,
      group: this.state.group
    };
    try {
      await httpService.post(`${apiUrl}/group/addNew-student`, newItem);
      this.setState(initState);
      this.successModal();
    } catch (err) {
      this.setState({
        loading: false,
        errors: err.response.data
      });
    }
  };

  successModal = () => {
    this.setState({ open: true, loading: false });
    setTimeout(() => {
      this.setState(prevState => ({
        open: !prevState.open
      }));
      historyService.goBack();
    }, 3000);
  };

  handleCancel = () => {
    const groupId = this.props.match.params.id;
    if (groupId) {
      historyService.push(`${routeUrls.teacher.group.edit}/${groupId}`);
    } else {
      /* historyService.push(
        `${routeUrls.teacher.group.overview}`
      );*/
      historyService.goBack();
    }
  };

  render() {
    const {
      name,
      username,
      password,
      errors,
      open,
      loading,
      group,
      groupOptions
    } = this.state;
    const defaultOpt = <option value="default">No groups found!</option>;

    return (
      <React.Fragment>
        <Grid container spacing={4}>
          <Grid item sm={3} />
          <Grid item sm={6}>
            <form className="form-signin">
              <TextField
                error={errors.name ? true : false}
                helperText={errors.name}
                value={name}
                name="name"
                required
                id="student-name"
                label="Name"
                onChange={this.handleChange}
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
                onChange={this.handleChange}
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
                onChange={this.handleChange}
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
                onChange={this.handleChange}
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
                onClick={this.handleCancel}
                style={{ margin: "33px 20px" }}
              >
                Annuleren
              </Fab>
              <Fab
                variant="extended"
                color="primary"
                size="large"
                onClick={this.handleSubmit}
                // fullWidth={true}
                style={{ margin: "33px 20px" }}
              >
                Add Student
              </Fab>
            </form>
            {loading ? <CircularProgress /> : null}
          </Grid>
          <Grid item sm={3} />
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
}

export default AddStudent;
