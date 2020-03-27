import React, { Component } from "react";
import { httpService } from "../../../services/http";
import {
  apiUrl,
  routeUrls
} from "../../../services/config";
import { userService } from "../../../services/user";
import { historyService } from "../../../services/history";
import queryString from "query-string";
import {
  CircularProgress,
  Dialog,
  DialogTitle,
  TextField,
  MenuItem,
  Grid,
  Fab,
  Icon
} from "@material-ui/core/";

class EditStudent extends Component {
  state = {
    stud_id: "",
    currentGroupID: "",
    name: "",
    username: "",
    group: "",
    groupOptions: [],
    errors: {},
    open: false,
    loading: false
  };

  componentDidMount = async () => {
    const parsedQuery = queryString.parse(
      this.props.location.search
    );
    try {
      if (this.props.location.search) {
        const results = await httpService.get(
          `${apiUrl}/group/account/${parsedQuery.stud_id}`
        );
        const groups = await httpService.get(
          `${apiUrl}/group/all/${
            userService.getCurrentUser()._id
          }`
        );
        if (results) {
          const { name, account } = results.data[0];
          this.setState({
            stud_id: parsedQuery.stud_id,
            currentGroupID: parsedQuery.group_id,
            name,
            username: account.username,
            password: account.password,
            groupOptions: groups.data,
            group: parsedQuery.group_id
          });
        }
      }
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
      group: this.state.group
    };
    try {
      await httpService.put(
        `${apiUrl}/group/edit-student?stud_id=${this.state.stud_id}&group_id=${this.state.currentGroupID}`,
        newItem
      );
      //this.setState(initState);
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
      historyService.push(
        `${routeUrls.teacher.group.detail}/${this.state.currentGroupID}`
      );
    }, 3000);
  };

  handleCancel = groupID => {
    historyService.push(
      `${routeUrls.teacher.group.detail}/${groupID}`
    );
  };

  render() {
    const {
      currentGroupID,
      name,
      username,
      errors,
      open,
      loading,
      group,
      groupOptions
    } = this.state;
    const defaultOpt = (
      <option value="default">No groups found!</option>
    );

    return (
      <React.Fragment>
        <Grid container spacing={6}>
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
                disabled
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
                      <MenuItem
                        key={option.name}
                        value={option._id}
                        selected={
                          option._id === group
                            ? true
                            : false
                        }
                      >
                        {option.name}
                      </MenuItem>
                    ))
                  : defaultOpt}
              </TextField>
              <Fab
                variant="extended"
                color="secondary"
                style={{ marginTop: 33, marginRight: 10 }}
                onClick={() =>
                  this.handleCancel(currentGroupID)
                }
              >
                <Icon>cancel</Icon>
                Annuleren
              </Fab>

              <Fab
                variant="extended"
                color="primary"
                style={{ marginTop: 33 }}
                onClick={this.handleSubmit}
              >
                <Icon>save_alt</Icon>
                Opslaan
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
          <DialogTitle
            id="alert-dialog-title"
            color="primary"
          >
            <div
              style={{
                color: "green",
                textAlign: "center"
              }}
            >
              {"Student is gewijzigd!"}
            </div>
          </DialogTitle>
        </Dialog>
      </React.Fragment>
    );
  }
}

export default EditStudent;
